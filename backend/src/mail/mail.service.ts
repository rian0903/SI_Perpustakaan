import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT', 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`SMTP Mailer initialized successfully targeting host: ${host}`);
    } else {
      this.logger.warn(
        `SMTP environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS) not fully set. Email notifications will be logged to console in mock mode.`,
      );
    }
  }

  private compileTemplate(templateName: string, data: Record<string, any>): string {
    let source = '';

    const possiblePaths = [
      path.join(__dirname, 'templates', `${templateName}.hbs`),
      path.join(__dirname, '..', 'mail', 'templates', `${templateName}.hbs`),
      path.join(process.cwd(), 'backend', 'src', 'mail', 'templates', `${templateName}.hbs`),
      path.join(process.cwd(), 'src', 'mail', 'templates', `${templateName}.hbs`),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        source = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    if (!source) {
      source = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Perpustakaan Daerah Kota Buku</h2>
          <p>Halo <strong>{{fullName}}</strong>,</p>
          <p>Nomor Registrasi: <strong>{{registrationNumber}}</strong></p>
          {{#if membershipNumber}}<p>Nomor Anggota: <strong>{{membershipNumber}}</strong></p>{{/if}}
          {{#if rejectionReason}}<p>Alasan Penolakan: {{rejectionReason}}</p>{{/if}}
        </div>
      `;
    }

    const template = handlebars.compile(source);
    return template(data);
  }

  async sendMail(to: string, subject: string, templateName: string, context: Record<string, any>): Promise<boolean> {
    try {
      const html = this.compileTemplate(templateName, context);
      const from = this.configService.get<string>('MAIL_FROM', '"Perpustakaan Kota Buku" <no-reply@perpustakaan.go.id>');

      if (this.transporter) {
        await this.transporter.sendMail({
          from,
          to,
          subject,
          html,
        });
        this.logger.log(`Email '${subject}' successfully sent to: ${to}`);
      } else {
        this.logger.log(`[MOCK EMAIL SENT] To: ${to} | Subject: "${subject}" | Template: ${templateName}`);
      }
      return true;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to send email '${subject}' to ${to}: ${err.message}`, err.stack);
      return false;
    }
  }

  async sendRegistrationConfirmation(data: { email: string; fullName: string; registrationNumber: string; createdAt: Date }) {
    const dateFormatted = new Date(data.createdAt).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return this.sendMail(
      data.email,
      'Pendaftaran Keanggotaan Berhasil Diterima',
      'registration',
      {
        fullName: data.fullName,
        registrationNumber: data.registrationNumber,
        submittedAt: dateFormatted,
      },
    );
  }

  async sendApprovalNotification(data: { email: string; fullName: string; registrationNumber: string; membershipNumber: string }) {
    return this.sendMail(
      data.email,
      'Pendaftaran Keanggotaan Disetujui',
      'approved',
      {
        fullName: data.fullName,
        registrationNumber: data.registrationNumber,
        membershipNumber: data.membershipNumber,
      },
    );
  }

  async sendRejectionNotification(data: { email: string; fullName: string; registrationNumber: string; rejectionReason?: string }) {
    return this.sendMail(
      data.email,
      'Pendaftaran Keanggotaan Tidak Disetujui',
      'rejected',
      {
        fullName: data.fullName,
        registrationNumber: data.registrationNumber,
        rejectionReason: data.rejectionReason || 'Dokumen atau data identitas yang diunggah belum memenuhi persyaratan perpustakaan.',
      },
    );
  }

  async sendReadyForPickupNotification(data: { email: string; fullName: string; registrationNumber: string; membershipNumber: string }) {
    return this.sendMail(
      data.email,
      'Kartu Keanggotaan Siap Diambil',
      'ready-for-pickup',
      {
        fullName: data.fullName,
        registrationNumber: data.registrationNumber,
        membershipNumber: data.membershipNumber,
      },
    );
  }
}
