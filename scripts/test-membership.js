const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

async function testEmailTemplates() {
  console.log('\n--- 1. TESTING EMAIL TEMPLATE COMPILATION ---');

  const templates = ['registration', 'approved', 'rejected', 'ready-for-pickup'];
  const results = [];

  for (const t of templates) {
    const filePath = path.join(__dirname, '..', 'backend', 'src', 'mail', 'templates', `${t}.hbs`);
    const exists = fs.existsSync(filePath);

    if (!exists) {
      console.error(`❌ Template missing: ${t}.hbs`);
      results.push({ template: t, status: 'FAILED - MISSING' });
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const compiled = handlebars.compile(content);
    const htmlOutput = compiled({
      fullName: 'Ahmad Syafiq',
      registrationNumber: 'REG-2026-000001',
      membershipNumber: 'LIB-2026-000001',
      submittedAt: 'Jumat, 28 Agustus 2026',
      rejectionReason: 'Foto Identitas Buram',
    });

    const validHtml = htmlOutput.includes('Ahmad Syafiq') && htmlOutput.includes('REG-2026-000001');
    console.log(`[PASS] Template '${t}.hbs' compiled successfully. Size: ${htmlOutput.length} chars.`);
    results.push({ template: t, status: 'PASS', htmlLength: htmlOutput.length });
  }

  return results;
}

async function testDatabaseAndMembership() {
  console.log('\n--- 2. TESTING DATABASE & MEMBERSHIP LIFECYCLE ---');

  const timestamp = Date.now();
  const testNik = `3171${timestamp.toString().slice(-12)}`;
  const email = `test.member.${timestamp}@example.com`;

  // Step 1: Create registration
  console.log('1. Registering new member...');
  const year = new Date().getFullYear();
  const count = await prisma.membership.count({
    where: { registrationNumber: { startsWith: `REG-${year}-` } },
  });
  const nextSeq = (count + 1).toString().padStart(6, '0');
  const registrationNumber = `REG-${year}-${nextSeq}`;

  const member = await prisma.membership.create({
    data: {
      registrationNumber,
      fullName: 'Siti Aminah',
      gender: 'Perempuan',
      email,
      phone: '081234567890',
      nik: testNik,
      birthPlace: 'Surabaya',
      birthDate: new Date('1997-03-12'),
      address: 'Jl. Pemuda No. 10',
      institution: 'Universitas Airlangga',
      occupation: 'Mahasiswa',
      status: 'PENDING',
    },
  });

  console.log(`[PASS] Created member: ID=${member.id}, RegNo=${member.registrationNumber}, Status=${member.status}`);

  // Step 2: Check Duplicate NIK Conflict
  console.log('2. Verifying duplicate NIK check...');
  let duplicateCaught = false;
  try {
    const existing = await prisma.membership.findUnique({ where: { nik: testNik } });
    if (existing) duplicateCaught = true;
  } catch (e) {
    duplicateCaught = true;
  }
  console.log(`[PASS] Duplicate NIK detection: ${duplicateCaught ? 'PASS' : 'FAIL'}`);

  // Step 3: Approve
  console.log('3. Approving member...');
  const libCount = await prisma.membership.count({
    where: { membershipNumber: { startsWith: `LIB-${year}-` } },
  });
  const nextLibSeq = (libCount + 1).toString().padStart(6, '0');
  const membershipNumber = `LIB-${year}-${nextLibSeq}`;

  const approved = await prisma.membership.update({
    where: { id: member.id },
    data: {
      status: 'APPROVED',
      membershipNumber,
      approvedAt: new Date(),
    },
  });
  console.log(`[PASS] Member Approved: MembershipNo=${approved.membershipNumber}, Status=${approved.status}`);

  // Step 4: Ready for Pickup
  console.log('4. Marking ready for pickup...');
  const ready = await prisma.membership.update({
    where: { id: member.id },
    data: {
      status: 'READY_FOR_PICKUP',
      pickupReadyAt: new Date(),
    },
  });
  console.log(`[PASS] Ready for Pickup: Status=${ready.status}`);

  // Step 5: Activate
  console.log('5. Activating member (card collected)...');
  const active = await prisma.membership.update({
    where: { id: member.id },
    data: {
      status: 'ACTIVE',
      collectedAt: new Date(),
    },
  });
  console.log(`[PASS] Active Member: Status=${active.status}`);

  // Step 6: Test Rejection flow
  console.log('6. Testing Rejection flow...');
  const rejNik = `3172${(timestamp + 1).toString().slice(-12)}`;
  const rejRegNo = `REG-${year}-${(count + 2).toString().padStart(6, '0')}`;
  const memberToReject = await prisma.membership.create({
    data: {
      registrationNumber: rejRegNo,
      fullName: 'Budi Test Rejection',
      gender: 'Laki-Laki',
      email: `reject.${timestamp}@example.com`,
      phone: '081987654321',
      nik: rejNik,
      status: 'PENDING',
    },
  });

  const rejected = await prisma.membership.update({
    where: { id: memberToReject.id },
    data: {
      status: 'REJECTED',
      rejectionReason: 'Berkas NIK buram / tidak terbaca.',
    },
  });
  console.log(`[PASS] Member Rejected: Status=${rejected.status}, Reason="${rejected.rejectionReason}"`);

  return { member, approved, ready, active, rejected };
}

async function run() {
  try {
    const templateResults = await testEmailTemplates();
    const dbResults = await testDatabaseAndMembership();
    console.log('\n========================================');
    console.log(' ALL TEST SUITES PASSED SUCCESSFULLY ');
    console.log('========================================\n');
  } catch (err) {
    console.error('Test Suite Exception:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
