const nodemailer = require('nodemailer');
require('dotenv').config();

async function testGmailSmtp() {
  console.log('--- TESTING LIVE GMAIL SMTP DISPATCH ---');
  console.log(`SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`SMTP User: ${process.env.SMTP_USER}`);

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
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP Connection verified successfully!');

    console.log('Sending test email to nandariansyah54321@gmail.com...');
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || '"Perpustakaan Kota Buku" <nandariansyah54321@gmail.com>',
      to: 'nandariansyah54321@gmail.com',
      subject: '✅ Uji Coba Pengiriman Email SMTP Perpustakaan Kota Buku',
      html: `
        <div style="font-family: sans-serif; padding: 24px; background: #f8fafc; border-radius: 8px;">
          <h2 style="color: #0284c7;">Perpustakaan Daerah Kota Buku</h2>
          <p>Halo <strong>Nandariansyah</strong>,</p>
          <p>Ini adalah email konfirmasi uji coba pengiriman email dari sistem perpustakaan menggunakan SMTP Gmail.</p>
          <p style="background: #e0f2fe; padding: 12px; border-radius: 6px; color: #0369a1;">
            🎉 <strong>Status: Pengiriman Email SMTP Terkoneksi & Berhasil!</strong>
          </p>
        </div>
      `,
    });

    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
  }
}

testGmailSmtp();
