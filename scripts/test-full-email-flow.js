const { NestFactory } = require('@nestjs/core');
const path = require('path');
const { AppModule } = require(path.join(__dirname, '../backend/dist/app.module'));
const { MembershipService } = require(path.join(__dirname, '../backend/dist/membership/membership.service'));

async function testFullEmailFlow() {
  console.log('======================================================');
  console.log(' TESTING LIVE EMAIL DISPATCH FOR ALL MEMBERSHIP STAGES ');
  console.log('======================================================\n');

  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['warn', 'error'] });
  const membershipService = app.get(MembershipService);

  const timestamp = Date.now();
  const recipientEmail = 'nandariansyah54321@gmail.com';
  const testNik = `3175${timestamp.toString().slice(-12)}`;
  const fullName = `M. Nandariansyah (Uji Coba ${timestamp.toString().slice(-4)})`;

  // 1. Send Registration Confirmation Email
  console.log(`[STAGE 1] Registering Member: ${fullName}...`);
  const member = await membershipService.register({
    fullName,
    gender: 'Laki-Laki',
    email: recipientEmail,
    phone: '081234567890',
    nik: testNik,
    birthPlace: 'Jakarta',
    birthDate: '1998-08-17T00:00:00.000Z',
    address: 'Jl. Pemuda No. 100',
    institution: 'Universitas Indonesia',
    occupation: 'Mahasiswa',
  });
  console.log(` -> Registration No: ${member.registrationNumber}`);
  console.log(` -> Email Pendaftaran Berhasil Dikirim ke ${recipientEmail}!\n`);

  // Wait 3 seconds
  await new Promise((r) => setTimeout(r, 3000));

  // 2. Send Approval Email
  console.log(`[STAGE 2] Approving Registration No: ${member.registrationNumber}...`);
  const approved = await membershipService.approve(member.id);
  console.log(` -> Membership No Generated: ${approved.membershipNumber}`);
  console.log(` -> Email Persetujuan Berhasil Dikirim ke ${recipientEmail}!\n`);

  // Wait 3 seconds
  await new Promise((r) => setTimeout(r, 3000));

  // 3. Send Card Ready For Pickup Email
  console.log(`[STAGE 3] Marking Card Ready for Pickup (Kartu Siap Diambil)...`);
  const ready = await membershipService.markReadyForPickup(member.id);
  console.log(` -> New Status: ${ready.status}`);
  console.log(` -> Email "KARTU SIAP DIAMBIL" Berhasil Dikirim ke ${recipientEmail}!\n`);

  await app.close();

  console.log('======================================================');
  console.log(' ALL 3 LIVE EMAILS DISPATCHED TO GMAIL SUCCESSFULLY! ');
  console.log('======================================================\n');
}

testFullEmailFlow().catch((err) => {
  console.error('Error testing live email flow:', err);
  process.exit(1);
});
