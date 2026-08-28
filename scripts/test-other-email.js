const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSendToOtherEmail(targetEmail) {
  console.log('--- TESTING SMTP TO TARGET EMAIL ---');
  console.log(`From: ${process.env.MAIL_FROM}`);
  console.log(`To: ${targetEmail}`);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: targetEmail,
      subject: '📌 Uji Coba Pendaftaran Keanggotaan Perpustakaan',
      html: `
        <div style="font-family: sans-serif; padding: 24px; background: #f8fafc;">
          <h2 style="color: #0f172a;">Perpustakaan Daerah Kota Buku</h2>
          <p>Halo,</p>
          <p>Ini adalah email konfirmasi pendaftaran keanggotaan untuk dipastikan penerimaannya pada email lain.</p>
          <p>Nomor Registrasi: <strong>REG-2026-999999</strong></p>
        </div>
      `,
    });

    console.log(`✅ Email successfully dispatched!`);
    console.log(`Message ID: ${info.messageId}`);
    console.log(`Accepted: ${JSON.stringify(info.accepted)}`);
    console.log(`Rejected: ${JSON.stringify(info.rejected)}`);
    console.log(`Response: ${info.response}`);
  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
}

const target = process.argv[2] || 'nandariansyah54321@gmail.com';
testSendToOtherEmail(target);
