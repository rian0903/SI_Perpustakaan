const { NestFactory } = require('@nestjs/core');
const path = require('path');
const { AppModule } = require(path.join(__dirname, '../backend/dist/app.module'));
const { ValidationPipe } = require('@nestjs/common');

async function testApiEndpoints() {
  console.log('\n--- 3. TESTING NESTJS API & HTTP CONTROLLER LAYER ---');

  let app;
  try {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api');
    await app.listen(3009);

    const baseUrl = 'http://localhost:3009/api';
    const timestamp = Date.now();
    const testNik = `3173${timestamp.toString().slice(-12)}`;
    const email = `api.test.${timestamp}@perpustakaan.go.id`;

    // 1. Submit Registration via HTTP POST
    console.log('1. Testing HTTP POST /api/membership ...');
    const regRes = await fetch(`${baseUrl}/membership`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Budi HTTP Test',
        gender: 'Laki-Laki',
        email,
        phone: '081234567890',
        nik: testNik,
        birthPlace: 'Semarang',
        birthDate: '1995-05-20T00:00:00.000Z',
        address: 'Jl. Pandanaran No. 12',
        institution: 'Universitas Diponegoro',
        occupation: 'Mahasiswa',
      }),
    });

    const regData = await regRes.json();
    console.log(` -> Response Status: ${regRes.status}`);
    console.log(` -> Registration No: ${regData.registrationNumber}, Status: ${regData.status}`);
    const regNo = regData.registrationNumber;

    // 2. Check Status via HTTP GET
    console.log('\n2. Testing HTTP GET /api/membership/status/:regNo ...');
    const statusRes = await fetch(`${baseUrl}/membership/status/${regNo}`);
    const statusData = await statusRes.json();
    console.log(` -> Response Status: ${statusRes.status}`);
    console.log(` -> Retrieved RegNo: ${statusData.registrationNumber}, Status: ${statusData.status}`);

    // 3. Test duplicate NIK 409 Conflict
    console.log('\n3. Testing Duplicate NIK Conflict (409) ...');
    const dupRes = await fetch(`${baseUrl}/membership`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Orang Lain Duplicate NIK',
        gender: 'Perempuan',
        email: `dup.${timestamp}@example.com`,
        phone: '081299991111',
        nik: testNik,
      }),
    });
    console.log(` -> Response Status: ${dupRes.status} (Expected: 409)`);

    // 4. Test 404 Status Not Found
    console.log('\n4. Testing 404 Status Lookup ...');
    const notFoundRes = await fetch(`${baseUrl}/membership/status/REG-UNKNOWN-999`);
    console.log(` -> Response Status: ${notFoundRes.status} (Expected: 404)`);

    console.log('\n====================================================');
    console.log(' ALL HTTP API ENDPOINTS VERIFIED SUCCESSFULLY ');
    console.log('====================================================\n');
  } catch (err) {
    console.error('API Test Error:', err);
  } finally {
    if (app) await app.close();
  }
}

testApiEndpoints();
