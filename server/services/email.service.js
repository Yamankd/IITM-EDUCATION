const nodemailer = require('nodemailer');

// Create transporter with Gmail SMTP
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: (process.env.GOOGLE_AUTH_USER || '').trim(),
            pass: (process.env.GOOGLE_APP_PASSWORD || '').trim(),
        },
    });
};

// Send welcome email with login credentials
const sendWelcomeEmail = async (studentEmail, studentPassword) => {
    try {
        const transporter = createTransporter();

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        const mailOptions = {
            from: `"IITM COMPUTER EDUCATION" <${process.env.GOOGLE_AUTH_USER}>`,
            to: studentEmail,
            subject: 'Welcome to IITM Computer Education - Your Login Credentials',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f9f9f9;
                        }
                        .header {
                            background-color: #0B2A4A;
                            color: white;
                            padding: 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            background-color: white;
                            padding: 30px;
                            border-radius: 0 0 5px 5px;
                        }
                        .credentials {
                            background-color: #f0f8ff;
                            padding: 20px;
                            border-left: 4px solid #D6A419;
                            margin: 20px 0;
                        }
                        .credential-item {
                            margin: 10px 0;
                            font-size: 16px;
                        }
                        .credential-label {
                            font-weight: bold;
                            color: #0B2A4A;
                        }
                        .credential-value {
                            color: #333;
                            font-family: monospace;
                            background-color: #fff;
                            padding: 5px 10px;
                            border-radius: 3px;
                            display: inline-block;
                        }
                        .button {
                            display: inline-block;
                            padding: 12px 30px;
                            background-color: #D6A419;
                            color: #0B2A4A;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                            font-size: 14px;
                        }
                        .warning {
                            background-color: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 15px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <img src="${clientUrl}/logo.png" alt="IITM Logo" style="max-width: 150px; height: auto;">
                            </div>
                            <h1 style="margin: 0;">Welcome to IITM Computer Education!</h1>
                        </div>
                        <div class="content">
                            <p>Dear Student,</p>
                            
                            <p>Your account has been successfully created. We're excited to have you join our learning platform!</p>
                            
                            <div class="credentials">
                                <h3 style="margin-top: 0; color: #0B2A4A;">Your Login Credentials</h3>
                                <div class="credential-item">
                                    <span class="credential-label">📧 Email:</span><br>
                                    <span class="credential-value">${studentEmail}</span>
                                </div>
                                <div class="credential-item">
                                    <span class="credential-label">🔑 Password:</span><br>
                                    <span class="credential-value">${studentPassword}</span>
                                </div>
                            </div>
                            
                            <div style="text-align: center;">
                                <a href="${clientUrl}/student/login" class="button">Login to Your Account</a>
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ Important:</strong> Please keep these credentials safe and secure.
                            </div>
                            
                            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                            
                            <p>Best regards,<br>
                            <strong>IITM Education Team</strong></p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply to this message.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
Welcome to IITM Education!

Dear Student,

Your account has been successfully created.

Your Login Credentials:
📧 Email: ${studentEmail}
🔑 Password: ${studentPassword}

Login here: ${clientUrl}/student/login

Please keep these credentials safe. We recommend changing your password after your first login.

If you have any questions or need assistance, please contact our support team.

Best regards,
IITM Education Team
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

// Send OTP email
const sendOtpEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        const mailOptions = {
            from: `"IITM COMPUTER EDUCATION" <${process.env.GOOGLE_AUTH_USER}>`,
            to: email,
            subject: 'Your Verification OTP - IITM Certification',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
                        .header { background-color: #0B2A4A; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background-color: white; padding: 30px; border-radius: 0 0 5px 5px; }
                        .otp-box { background-color: #f0f8ff; color: #0B2A4A; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; margin: 20px 0; border-left: 5px solid #D6A419; letter-spacing: 5px; border-radius: 5px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
                        .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0;">Email Verification</h1>
                        </div>
                        <div class="content">
                            <p>Dear User,</p>
                            <p>To complete your registration for the <strong>IITM Certification Program</strong>, please use the following One-Time Password (OTP) to verify your email address:</p>
                            
                            <div class="otp-box">
                                ${otp}
                            </div>
                            
                            <div class="warning">
                                <strong>⚠️ Note:</strong> This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
                            </div>
                            
                            <p>If you did not request this verification, please ignore this email.</p>
                            
                            <p>Best regards,<br>
                            <strong>IITM Education Team</strong></p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} IITM Computer Education. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending OTP email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendWelcomeEmail,
    sendOtpEmail,
};
