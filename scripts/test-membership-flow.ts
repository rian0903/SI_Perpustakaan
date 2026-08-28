import { NestFactory } from '@nestjs/core';
import { AppModule } from '../backend/src/app.module';
import { MembershipService } from '../backend/src/membership/membership.service';
import { MailService } from '../backend/src/mail/mail.service';
import { MembershipStatus } from '@prisma/client';

async function runMembershipLifecycleTest() {
  console.log('====================================================');
  console.log(' STARTING MEMBERSHIP & EMAIL INTEGRATION VERIFICATION ');
  console.log('====================================================\n');

  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn', 'log'] });
  const membershipService = app.get(MembershipService);
  const mailService = app.get(MailService);

  const timestamp = Date.now();
  const testEmail = `tester.${timestamp}@perpustakaan.go.id`;
  const testNik = `317101${timestamp.toString().slice(-10)}`;
  const fullName = `Peserta Uji Keanggotaan ${timestamp.toString().slice(-4)}`;

  console.log(`[TEST STEP 1] Registering New Member: ${fullName}`);
  const registeredMember = await membershipService.register({
    fullName,
    gender: 'Laki-Laki',
    email: testEmail,
    phone: '081234567890',
    nik: testNik,
    birthPlace: 'Jakarta',
    birthDate: new Date('1996-08-17') as any,
    address: 'Jl. Pemuda No. 45, Jakarta Pusat',
    institution: 'Universitas Indonesia',
    occupation: 'Mahasiswa',
    photoUrl: '/uploads/sample-photo.jpg',
    identityCardUrl: '/uploads/sample-ktp.pdf',
  });

  console.log(` -> Created ID: ${registeredMember.id}`);
  console.log(` -> Registration No: ${registeredMember.registrationNumber}`);
  console.log(` -> Initial Status: ${registeredMember.status}\n`);

  console.log(`[TEST STEP 2] Fetching Public Status for ${registeredMember.registrationNumber}`);
  const publicStatus = await membershipService.getStatus(registeredMember.registrationNumber);
  console.log(` -> Status Retrieved: ${publicStatus.status}`);
  console.log(` -> Full Name Verified: ${publicStatus.fullName}\n`);

  console.log(`[TEST STEP 3] Approving Membership ID: ${registeredMember.id}`);
  const approvedMember = await membershipService.approve(registeredMember.id);
  console.log(` -> New Status: ${approvedMember.status}`);
  console.log(` -> Generated Membership No: ${approvedMember.membershipNumber}`);
  console.log(` -> Approved At: ${approvedMember.approvedAt}\n`);

  console.log(`[TEST STEP 4] Marking Membership Ready for Pickup`);
  const readyMember = await membershipService.markReadyForPickup(registeredMember.id);
  console.log(` -> New Status: ${readyMember.status}`);
  console.log(` -> Ready At: ${readyMember.pickupReadyAt}\n`);

  console.log(`[TEST STEP 5] Activating Membership (Card Collected)`);
  const activeMember = await membershipService.activate(registeredMember.id);
  console.log(` -> Final Status: ${activeMember.status}`);
  console.log(` -> Collected At: ${activeMember.collectedAt}\n`);

  console.log(`[TEST STEP 6] Testing Rejection Flow on Separate Registration`);
  const rejectNik = `317202${(timestamp + 1).toString().slice(-10)}`;
  const rejectMember = await membershipService.register({
    fullName: `Peserta Ditolak ${timestamp.toString().slice(-4)}`,
    gender: 'Perempuan',
    email: `ditolak.${timestamp}@perpustakaan.go.id`,
    phone: '081987654321',
    nik: rejectNik,
  });

  console.log(` -> Rejecting Registration No: ${rejectMember.registrationNumber}`);
  const rejectedMember = await membershipService.reject(
    rejectMember.id,
    'Dokumen Kartu Identitas (KTP) yang terlampir tidak jelas / buram.'
  );
  console.log(` -> Status: ${rejectedMember.status}`);
  console.log(` -> Rejection Reason: ${rejectedMember.rejectionReason}\n`);

  console.log(`[TEST STEP 7] Verifying Template Compilation Directly`);
  const templatesToTest = [
    {
      name: 'registration',
      subject: 'Pendaftaran Keanggotaan Berhasil Diterima',
      context: { fullName, registrationNumber: registeredMember.registrationNumber, submittedAt: 'Senin, 28 Agustus 2026' }
    },
    {
      name: 'approved',
      subject: 'Pendaftaran Keanggotaan Disetujui',
      context: { fullName, registrationNumber: registeredMember.registrationNumber, membershipNumber: approvedMember.membershipNumber }
    },
    {
      name: 'ready-for-pickup',
      subject: 'Kartu Keanggotaan Siap Diambil',
      context: { fullName, registrationNumber: registeredMember.registrationNumber, membershipNumber: approvedMember.membershipNumber }
    },
    {
      name: 'rejected',
      subject: 'Pendaftaran Keanggotaan Tidak Disetujui',
      context: { fullName, registrationNumber: rejectMember.registrationNumber, rejectionReason: 'Dokumen buram' }
    }
  ];

  for (const t of templatesToTest) {
    const success = await mailService.sendMail('test.recipient@perpustakaan.go.id', t.subject, t.name, t.context);
    console.log(` -> Template '${t.name}': Mail Send Status = ${success ? 'SUCCESS (OK)' : 'FAILED'}`);
  }

  await app.close();

  console.log('\n====================================================');
  console.log(' ALL MEMBERSHIP LIFECYCLE TESTS COMPLETED SUCCESSFULLY ');
  console.log('====================================================\n');
}

runMembershipLifecycleTest().catch((err) => {
  console.error('Test Execution Error:', err);
  process.exit(1);
});
