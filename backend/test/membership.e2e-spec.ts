import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtAuthGuard } from './../src/auth/jwt-auth.guard';
import { RolesGuard } from './../src/auth/roles.guard';
import { MailService } from './../src/mail/mail.service';

describe('Membership System (e2e)', () => {
  let app: INestApplication;
  let createdRegistrationNumber: string;
  let createdMembershipId: string;
  const uniqueNik = `3201${Date.now()}`.substring(0, 16);

  const mockMailService = {
    sendRegistrationConfirmation: jest.fn().mockResolvedValue(true),
    sendApprovalNotification: jest.fn().mockResolvedValue(true),
    sendRejectionNotification: jest.fn().mockResolvedValue(true),
    sendReadyForPickupNotification: jest.fn().mockResolvedValue(true),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Public Registration (POST /api/membership) - Success', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/membership')
      .send({
        fullName: 'Uji Coba Pendaftar',
        gender: 'Laki-Laki',
        email: 'testing.pendaftar@example.com',
        phone: '081299998888',
        nik: uniqueNik,
        birthPlace: 'Bandung',
        birthDate: '1995-10-20T00:00:00.000Z',
        address: 'Jl. Testing No. 123, Bandung',
        institution: 'Universitas Indonesia',
        occupation: 'Mahasiswa',
        photoUrl: '/uploads/member-sample-photo.jpg',
        identityCardUrl: '/uploads/member-sample-ktp.pdf',
      })
      .expect(201);

    expect(res.status === 201 || res.status === 200).toBe(true);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('registrationNumber');
    expect(res.body.registrationNumber).toMatch(/^REG-\d{4}-\d{6}$/);
    expect(res.body.status).toBe('PENDING');

    createdRegistrationNumber = res.body.registrationNumber;
    createdMembershipId = res.body.id;

    // Verify email confirmation was dispatched
    expect(mockMailService.sendRegistrationConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'testing.pendaftar@example.com',
        registrationNumber: createdRegistrationNumber,
      }),
    );
  });

  it('2. Public Registration Edge Case - Reject Duplicate NIK', async () => {
    await request(app.getHttpServer())
      .post('/api/membership')
      .send({
        fullName: 'Duplikat NIK Person',
        gender: 'Perempuan',
        email: 'duplikat@example.com',
        phone: '081299997777',
        nik: uniqueNik,
      })
      .expect(409); // ConflictException
  });

  it('3. Check Status (GET /api/membership/status/:registrationNumber)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/membership/status/${createdRegistrationNumber}`)
      .expect(200);

    expect(res.body).toHaveProperty('registrationNumber', createdRegistrationNumber);
    expect(res.body).toHaveProperty('fullName', 'Uji Coba Pendaftar');
    expect(res.body).toHaveProperty('status', 'PENDING');
  });

  it('4. Check Status 404 for Unknown Registration Number', async () => {
    await request(app.getHttpServer())
      .get('/api/membership/status/REG-UNKNOWN-999999')
      .expect(404);
  });

  it('5. Admin List Memberships (GET /api/admin/membership)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/admin/membership')
      .expect(200);

    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('6. Admin Get Stats (GET /api/admin/membership/stats)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/admin/membership/stats')
      .expect(200);

    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('pending');
  });

  it('7. Admin Approve Registration (PATCH /api/admin/membership/:id/approve)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/admin/membership/${createdMembershipId}/approve`)
      .expect(200);

    expect(res.body.status).toBe('APPROVED');
    expect(res.body).toHaveProperty('membershipNumber');
    expect(res.body.membershipNumber).toMatch(/^LIB-\d{4}-\d{6}$/);

    expect(mockMailService.sendApprovalNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'testing.pendaftar@example.com',
        registrationNumber: createdRegistrationNumber,
        membershipNumber: res.body.membershipNumber,
      }),
    );
  });

  it('8. Invalid Transition - Re-Approve Already Approved Registration', async () => {
    await request(app.getHttpServer())
      .patch(`/api/admin/membership/${createdMembershipId}/approve`)
      .expect(400); // BadRequestException
  });

  it('9. Admin Mark Ready for Pickup (PATCH /api/admin/membership/:id/ready-for-pickup)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/admin/membership/${createdMembershipId}/ready-for-pickup`)
      .expect(200);

    expect(res.body.status).toBe('READY_FOR_PICKUP');

    expect(mockMailService.sendReadyForPickupNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'testing.pendaftar@example.com',
        registrationNumber: createdRegistrationNumber,
      }),
    );
  });

  it('10. Admin Activate Membership (PATCH /api/admin/membership/:id/activate)', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/admin/membership/${createdMembershipId}/activate`)
      .expect(200);

    expect(res.body.status).toBe('ACTIVE');
    expect(res.body).toHaveProperty('collectedAt');
  });

  it('11. Invalid Transition - Cannot Reject Active Membership', async () => {
    await request(app.getHttpServer())
      .patch(`/api/admin/membership/${createdMembershipId}/reject`)
      .send({ rejectionReason: 'Mencoba menolak keanggotaan aktif' })
      .expect(400);
  });

  it('12. Full Cycle Rejection Flow - Register and Reject', async () => {
    const rejectNik = `3202${Date.now()}`.substring(0, 16);
    const regRes = await request(app.getHttpServer())
      .post('/api/membership')
      .send({
        fullName: 'Pendaftar Ditolak',
        gender: 'Perempuan',
        email: 'ditolak@example.com',
        phone: '081234567000',
        nik: rejectNik,
      });

    const rejectId = regRes.body.id;

    const rejRes = await request(app.getHttpServer())
      .patch(`/api/admin/membership/${rejectId}/reject`)
      .send({ rejectionReason: 'Foto Identitas Buram/Tidak Jelas' })
      .expect(200);

    expect(rejRes.body.status).toBe('REJECTED');
    expect(rejRes.body.rejectionReason).toBe('Foto Identitas Buram/Tidak Jelas');

    expect(mockMailService.sendRejectionNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'ditolak@example.com',
        rejectionReason: 'Foto Identitas Buram/Tidak Jelas',
      }),
    );
  });
});
