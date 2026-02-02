require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Testing Gmail SMTP Configuration...\n');

console.log('Environment Variables:');
console.log('GOOGLE_AUTH_USER:', process.env.GOOGLE_AUTH_USER);
console.log('GOOGLE_APP_PASSWORD Length:', (process.env.GOOGLE_APP_PASSWORD || '').trim().length);
console.log('');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: (process.env.GOOGLE_AUTH_USER || '').trim(),
        pass: (process.env.GOOGLE_APP_PASSWORD || '').trim(),
    },
    debug: false,
    logger: true // Log to console
});

console.log('📧 Attempting to verify SMTP connection...\n');

transporter.verify(function (error, success) {
    if (error) {
        console.log('❌ SMTP Connection Failed!');
        console.log('Error:', error.message);
        console.log('\n📋 Troubleshooting Steps:');
        console.log('1. Check if 2-Step Verification is enabled on your Gmail account');
        console.log('2. Generate a NEW App Password from: https://myaccount.google.com/apppasswords');
        console.log('3. Make sure you copied the ENTIRE 16-character password (no spaces)');
        console.log('4. Update GOOGLE_APP_PASSWORD in your .env file');
        console.log('5. Restart the server after updating .env');
    } else {
        console.log('✅ SMTP Connection Successful!');
        console.log('Server is ready to send emails');

        // Try sending a test email
        console.log('\n📨 Sending test email...');

        transporter.sendMail({
            from: `"IITM Education Test" <${process.env.GOOGLE_AUTH_USER}>`,
            to: process.env.GOOGLE_AUTH_USER, // Send to yourself
            subject: 'Test Email - IITM Education',
            text: 'This is a test email from your IITM Education platform. If you received this, email configuration is working correctly!',
            html: '<h2>✅ Email Configuration Test</h2><p>This is a test email from your IITM Education platform.</p><p>If you received this, email configuration is working correctly!</p>'
        }, (err, info) => {
            if (err) {
                console.log('❌ Test email failed:', err.message);
            } else {
                console.log('✅ Test email sent successfully!');
                console.log('Message ID:', info.messageId);
                console.log('Check your inbox:', process.env.GOOGLE_AUTH_USER);
            }
        });
    }
});
