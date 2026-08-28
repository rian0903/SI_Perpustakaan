import { Test, TestingModule } from '@nestjs/testing';
import { MembershipService } from './membership.service';
import { MembershipRepository } from './membership.repository';
import { MailService } from '../mail/mail.service';
import { MembershipStatus } from '@prisma/client';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('MembershipService', () => {
  let service: MembershipService;
  let repository: Record<keyof MembershipRepository, jest.Mock>;
  let mailService: jest.Mocked<Partial<MailService>>;

  const mockMembership = {
    id: 'mem-123',
    registrationNumber: 'REG-2026-000001',
    membershipNumber: null,
    fullName: 'Rian Pratama',
    gender: 'Laki-Laki',
    birthPlace: 'Jakarta',
    birthDate: new Date('1998-05-15'),
    nik: '3171011505980001',
    nisn: null,
    address: 'Jl. Merdeka No. 10, Jakarta',
    phone: '081234567890',
    email: 'rian@example.com',
    institution: 'Universitas Indonesia',
    occupation: 'Mahasiswa',
    photoUrl: '/uploads/member-photo.jpg',
    identityCardUrl: '/uploads/member-ktp.pdf',
    status: MembershipStatus.PENDING,
    rejectionReason: null,
    approvedAt: null,
    pickupReadyAt: null,
    collectedAt: null,
    createdAt: new Date('2026-08-28T09:00:00Z'),
    updatedAt: new Date('2026-08-28T09:00:00Z'),
  };

  beforeEach(async () => {
    repository = {
      countByYear: jest.fn().mockResolvedValue(0),
      findByNik: jest.fn().mockResolvedValue(null),
      findByRegistrationNumber: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(mockMembership),
      findById: jest.fn().mockResolvedValue(mockMembership),
      updateStatus: jest.fn(),
      findAll: jest.fn(),
      getStats: jest.fn(),
    };

    mailService = {
      sendRegistrationConfirmation: jest.fn().mockResolvedValue(true),
      sendApprovalNotification: jest.fn().mockResolvedValue(true),
      sendRejectionNotification: jest.fn().mockResolvedValue(true),
      sendReadyForPickupNotification: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        { provide: MembershipRepository, useValue: repository },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    service = module.get<MembershipService>(MembershipService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new member and trigger email confirmation', async () => {
      const dto = {
        fullName: 'Rian Pratama',
        gender: 'Laki-Laki',
        email: 'rian@example.com',
        phone: '081234567890',
        nik: '3171011505980001',
      };

      const result = await service.register(dto as any);

      expect(repository.findByNik).toHaveBeenCalledWith(dto.nik);
      expect(repository.countByYear).toHaveBeenCalledWith(new Date().getFullYear(), 'REG');
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'Rian Pratama',
          registrationNumber: 'REG-2026-000001',
        }),
      );
      expect(mailService.sendRegistrationConfirmation).toHaveBeenCalledWith({
        email: 'rian@example.com',
        fullName: 'Rian Pratama',
        registrationNumber: 'REG-2026-000001',
        createdAt: mockMembership.createdAt,
      });
      expect(result).toEqual(mockMembership);
    });

    it('should throw ConflictException if NIK is already registered', async () => {
      repository.findByNik.mockResolvedValueOnce(mockMembership as any);

      const dto = {
        fullName: 'Budi Test',
        gender: 'Laki-Laki',
        email: 'budi@example.com',
        phone: '081234567890',
        nik: '3171011505980001',
      };

      await expect(service.register(dto as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('getStatus', () => {
    it('should return registration status info for valid registration number', async () => {
      repository.findByRegistrationNumber.mockResolvedValueOnce(mockMembership as any);

      const result = await service.getStatus('REG-2026-000001');

      expect(result).toEqual({
        registrationNumber: 'REG-2026-000001',
        membershipNumber: null,
        fullName: 'Rian Pratama',
        status: MembershipStatus.PENDING,
        rejectionReason: null,
        createdAt: mockMembership.createdAt,
        approvedAt: null,
        pickupReadyAt: null,
        collectedAt: null,
      });
    });

    it('should throw NotFoundException for unknown registration number', async () => {
      repository.findByRegistrationNumber.mockResolvedValueOnce(null);

      await expect(service.getStatus('REG-UNKNOWN')).rejects.toThrow(NotFoundException);
    });
  });

  describe('approve', () => {
    it('should approve pending registration, generate membership number, and send approval email', async () => {
      const approvedMembership = {
        ...mockMembership,
        status: MembershipStatus.APPROVED,
        membershipNumber: 'LIB-2026-000001',
        approvedAt: new Date(),
      };
      repository.updateStatus.mockResolvedValueOnce(approvedMembership as any);

      const result = await service.approve('mem-123');

      expect(repository.countByYear).toHaveBeenCalledWith(new Date().getFullYear(), 'LIB');
      expect(repository.updateStatus).toHaveBeenCalledWith(
        'mem-123',
        expect.objectContaining({
          status: MembershipStatus.APPROVED,
          membershipNumber: 'LIB-2026-000001',
        }),
      );
      expect(mailService.sendApprovalNotification).toHaveBeenCalledWith({
        email: 'rian@example.com',
        fullName: 'Rian Pratama',
        registrationNumber: 'REG-2026-000001',
        membershipNumber: 'LIB-2026-000001',
      });
      expect(result.status).toBe(MembershipStatus.APPROVED);
    });

    it('should throw BadRequestException if registration is not PENDING', async () => {
      repository.findById.mockResolvedValueOnce({
        ...mockMembership,
        status: MembershipStatus.APPROVED,
      } as any);

      await expect(service.approve('mem-123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('reject', () => {
    it('should reject membership with reason and send rejection email', async () => {
      const rejectedMembership = {
        ...mockMembership,
        status: MembershipStatus.REJECTED,
        rejectionReason: 'Berkas NIK tidak terlampir.',
      };
      repository.updateStatus.mockResolvedValueOnce(rejectedMembership as any);

      const result = await service.reject('mem-123', 'Berkas NIK tidak terlampir.');

      expect(repository.updateStatus).toHaveBeenCalledWith('mem-123', {
        status: MembershipStatus.REJECTED,
        rejectionReason: 'Berkas NIK tidak terlampir.',
      });
      expect(mailService.sendRejectionNotification).toHaveBeenCalledWith({
        email: 'rian@example.com',
        fullName: 'Rian Pratama',
        registrationNumber: 'REG-2026-000001',
        rejectionReason: 'Berkas NIK tidak terlampir.',
      });
      expect(result.status).toBe(MembershipStatus.REJECTED);
    });

    it('should throw BadRequestException when trying to reject an ACTIVE membership', async () => {
      repository.findById.mockResolvedValueOnce({
        ...mockMembership,
        status: MembershipStatus.ACTIVE,
      } as any);

      await expect(service.reject('mem-123', 'Alasan')).rejects.toThrow(BadRequestException);
    });
  });

  describe('markReadyForPickup', () => {
    it('should update status to READY_FOR_PICKUP and send notification email', async () => {
      repository.findById.mockResolvedValueOnce({
        ...mockMembership,
        status: MembershipStatus.APPROVED,
        membershipNumber: 'LIB-2026-000001',
      } as any);

      const readyMembership = {
        ...mockMembership,
        status: MembershipStatus.READY_FOR_PICKUP,
        membershipNumber: 'LIB-2026-000001',
        pickupReadyAt: new Date(),
      };
      repository.updateStatus?.mockResolvedValueOnce(readyMembership as any);

      const result = await service.markReadyForPickup('mem-123');

      expect(repository.updateStatus).toHaveBeenCalledWith(
        'mem-123',
        expect.objectContaining({
          status: MembershipStatus.READY_FOR_PICKUP,
        }),
      );
      expect(mailService.sendReadyForPickupNotification).toHaveBeenCalledWith({
        email: 'rian@example.com',
        fullName: 'Rian Pratama',
        registrationNumber: 'REG-2026-000001',
        membershipNumber: 'LIB-2026-000001',
      });
      expect(result.status).toBe(MembershipStatus.READY_FOR_PICKUP);
    });

    it('should throw BadRequestException if status is not APPROVED', async () => {
      repository.findById.mockResolvedValueOnce({
        ...mockMembership,
        status: MembershipStatus.PENDING,
      } as any);

      await expect(service.markReadyForPickup('mem-123')).rejects.toThrow(BadRequestException);
    });
  });

  describe('activate', () => {
    it('should activate membership from READY_FOR_PICKUP status', async () => {
      repository.findById.mockResolvedValueOnce({
        ...mockMembership,
        status: MembershipStatus.READY_FOR_PICKUP,
        membershipNumber: 'LIB-2026-000001',
      } as any);

      const activeMembership = {
        ...mockMembership,
        status: MembershipStatus.ACTIVE,
        membershipNumber: 'LIB-2026-000001',
        collectedAt: new Date(),
      };
      repository.updateStatus?.mockResolvedValueOnce(activeMembership as any);

      const result = await service.activate('mem-123');

      expect(result.status).toBe(MembershipStatus.ACTIVE);
    });
  });
});
