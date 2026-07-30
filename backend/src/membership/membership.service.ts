import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { MembershipRepository } from './membership.repository';
import { MailService } from '../mail/mail.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { MembershipQueryDto } from './dto/membership-query.dto';
import { MembershipStatus } from '@prisma/client';

@Injectable()
export class MembershipService {
  constructor(
    private readonly repository: MembershipRepository,
    private readonly mailService: MailService,
  ) {}

  private async generateRegistrationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.repository.countByYear(year, 'REG');
    const nextSeq = (count + 1).toString().padStart(6, '0');
    return `REG-${year}-${nextSeq}`;
  }

  private async generateMembershipNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.repository.countByYear(year, 'LIB');
    const nextSeq = (count + 1).toString().padStart(6, '0');
    return `LIB-${year}-${nextSeq}`;
  }

  async register(dto: CreateMembershipDto) {
    if (dto.nik) {
      const existing = await this.repository.findByNik(dto.nik);
      if (existing) {
        throw new ConflictException(`NIK '${dto.nik}' sudah terdaftar dalam sistem keanggotaan.`);
      }
    }

    let registrationNumber = await this.generateRegistrationNumber();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existingReg = await this.repository.findByRegistrationNumber(registrationNumber);
      if (!existingReg) {
        isUnique = true;
      } else {
        attempts++;
        const rand = Math.floor(100000 + Math.random() * 900000);
        registrationNumber = `REG-${new Date().getFullYear()}-${rand}`;
      }
    }

    const membership = await this.repository.create({
      ...dto,
      registrationNumber,
    });

    // Email 1: Send registration confirmation
    await this.mailService.sendRegistrationConfirmation({
      email: membership.email,
      fullName: membership.fullName,
      registrationNumber: membership.registrationNumber,
      createdAt: membership.createdAt,
    });

    return membership;
  }

  async getStatus(registrationNumber: string) {
    const membership = await this.repository.findByRegistrationNumber(registrationNumber);
    if (!membership) {
      throw new NotFoundException(`Pendaftaran dengan nomor registrasi '${registrationNumber}' tidak ditemukan.`);
    }
    return {
      registrationNumber: membership.registrationNumber,
      membershipNumber: membership.membershipNumber,
      fullName: membership.fullName,
      status: membership.status,
      rejectionReason: membership.rejectionReason,
      createdAt: membership.createdAt,
      approvedAt: membership.approvedAt,
      pickupReadyAt: membership.pickupReadyAt,
      collectedAt: membership.collectedAt,
    };
  }

  async findAll(query: MembershipQueryDto) {
    return this.repository.findAll({
      status: query.status,
      search: query.search,
      page: query.page || 1,
      limit: query.limit || 20,
    });
  }

  async findById(id: string) {
    const membership = await this.repository.findById(id);
    if (!membership) {
      throw new NotFoundException('Data pendaftaran keanggotaan tidak ditemukan.');
    }
    return membership;
  }

  async getStats() {
    return this.repository.getStats();
  }

  async approve(id: string) {
    const membership = await this.findById(id);
    if (membership.status !== MembershipStatus.PENDING) {
      throw new BadRequestException(`Status pendaftaran saat ini adalah '${membership.status}'. Hanya status 'PENDING' yang dapat disetujui.`);
    }

    const membershipNumber = await this.generateMembershipNumber();

    const updated = await this.repository.updateStatus(id, {
      status: MembershipStatus.APPROVED,
      membershipNumber,
      approvedAt: new Date(),
    });

    // Email 2: Send approval notification
    await this.mailService.sendApprovalNotification({
      email: updated.email,
      fullName: updated.fullName,
      registrationNumber: updated.registrationNumber,
      membershipNumber: updated.membershipNumber!,
    });

    return updated;
  }

  async reject(id: string, rejectionReason: string) {
    const membership = await this.findById(id);
    if (membership.status === MembershipStatus.ACTIVE) {
      throw new BadRequestException('Keanggotaan yang sudah aktif tidak dapat ditolak.');
    }

    const updated = await this.repository.updateStatus(id, {
      status: MembershipStatus.REJECTED,
      rejectionReason,
    });

    // Email 3: Send rejection notification
    await this.mailService.sendRejectionNotification({
      email: updated.email,
      fullName: updated.fullName,
      registrationNumber: updated.registrationNumber,
      rejectionReason,
    });

    return updated;
  }

  async markReadyForPickup(id: string) {
    const membership = await this.findById(id);
    if (membership.status !== MembershipStatus.APPROVED) {
      throw new BadRequestException(`Pendaftaran harus dalam status 'APPROVED' sebelum ditandai siap diambil.`);
    }

    const updated = await this.repository.updateStatus(id, {
      status: MembershipStatus.READY_FOR_PICKUP,
      pickupReadyAt: new Date(),
    });

    // Email 4: Send ready-for-pickup notification
    await this.mailService.sendReadyForPickupNotification({
      email: updated.email,
      fullName: updated.fullName,
      registrationNumber: updated.registrationNumber,
      membershipNumber: updated.membershipNumber!,
    });

    return updated;
  }

  async activate(id: string) {
    const membership = await this.findById(id);
    if (membership.status !== MembershipStatus.READY_FOR_PICKUP && membership.status !== MembershipStatus.APPROVED) {
      throw new BadRequestException(`Kartu keanggotaan belum siap diambil atau disetujui.`);
    }

    const updated = await this.repository.updateStatus(id, {
      status: MembershipStatus.ACTIVE,
      collectedAt: new Date(),
    });

    return updated;
  }
}
