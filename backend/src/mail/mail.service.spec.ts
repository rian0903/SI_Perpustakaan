import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('MailService', () => {
  let service: MailService;
  let mockConfigService: Partial<ConfigService>;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    sendMailMock = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    mockConfigService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        const config: Record<string, any> = {
          SMTP_HOST: 'smtp.testmail.com',
          SMTP_PORT: 587,
          SMTP_USER: 'user@testmail.com',
          SMTP_PASS: 'password123',
          MAIL_FROM: '"Perpustakaan Test" <noreply@test.com>',
        };
        return config[key] !== undefined ? config[key] : defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize SMTP transporter when config is provided', () => {
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.testmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'user@testmail.com',
        pass: 'password123',
      },
    });
  });

  it('should send registration confirmation email', async () => {
    const result = await service.sendRegistrationConfirmation({
      email: 'pemohon@example.com',
      fullName: 'Ahmad Syafiq',
      registrationNumber: 'REG-2026-000001',
      createdAt: new Date('2026-08-28T10:00:00Z'),
    });

    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: '"Perpustakaan Test" <noreply@test.com>',
        to: 'pemohon@example.com',
        subject: 'Pendaftaran Keanggotaan Berhasil Diterima',
      }),
    );
  });

  it('should send approval notification email', async () => {
    const result = await service.sendApprovalNotification({
      email: 'pemohon@example.com',
      fullName: 'Ahmad Syafiq',
      registrationNumber: 'REG-2026-000001',
      membershipNumber: 'LIB-2026-000001',
    });

    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'pemohon@example.com',
        subject: 'Pendaftaran Keanggotaan Disetujui',
      }),
    );
  });

  it('should send rejection notification email', async () => {
    const result = await service.sendRejectionNotification({
      email: 'pemohon@example.com',
      fullName: 'Ahmad Syafiq',
      registrationNumber: 'REG-2026-000001',
      rejectionReason: 'Foto KTP buram dan tidak terbaca',
    });

    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'pemohon@example.com',
        subject: 'Pendaftaran Keanggotaan Tidak Disetujui',
      }),
    );
  });

  it('should send ready for pickup notification email', async () => {
    const result = await service.sendReadyForPickupNotification({
      email: 'pemohon@example.com',
      fullName: 'Ahmad Syafiq',
      registrationNumber: 'REG-2026-000001',
      membershipNumber: 'LIB-2026-000001',
    });

    expect(result).toBe(true);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'pemohon@example.com',
        subject: 'Kartu Keanggotaan Siap Diambil',
      }),
    );
  });

  it('should fallback to mock email mode when SMTP configuration is missing', async () => {
    const emptyConfigService = {
      get: jest.fn().mockReturnValue(undefined),
    };

    const mockService = new MailService(emptyConfigService as any);

    const result = await mockService.sendRegistrationConfirmation({
      email: 'mockuser@example.com',
      fullName: 'Budi Santoso',
      registrationNumber: 'REG-2026-000002',
      createdAt: new Date(),
    });

    expect(result).toBe(true);
  });

  it('should catch sendMail errors gracefully without throwing', async () => {
    sendMailMock.mockRejectedValueOnce(new Error('SMTP Timeout Error'));

    const result = await service.sendApprovalNotification({
      email: 'error@example.com',
      fullName: 'User Test',
      registrationNumber: 'REG-2026-000003',
      membershipNumber: 'LIB-2026-000003',
    });

    expect(result).toBe(false);
  });
});
