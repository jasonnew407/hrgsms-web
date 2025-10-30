import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'morenahotelsofficial@gmail.com',
    pass: process.env.EMAIL_PASS || 'ftql gbzw hmxd gjkj', 
  },
});
const sendVerificationEmail = async (email, firstName, lastName, verificationKey) => {

  const mailOptions = {
    from: `"Morena Hotels" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email Address - Morena Hotels',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8f9fa;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); padding: 30px 40px; text-align: center;">
                            <table width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Company Logo Placeholder -->
                                        <div style="background-color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                                            <img src="https://rajaratahotel.lk/wp-content/uploads/2019/07/Logo-1.png" alt="Morena Hotels" style="max-width: 200px; height: auto;">
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 20px;">
                                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Welcome to Morena Hotels</h1>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                            <h2 style="color: #333333; margin: 0 0 10px 0; font-size: 22px;">Hello ${firstName} ${lastName},</h2>
                            <p style="color: #666666; margin: 0; font-size: 16px; line-height: 1.6;">
                                Thank you for registering with Morena Hotels. To complete your guest profile and start enjoying our services, please verify your email address using the verification code below.
                            </p>
                        </td>
                    </tr>

                    <!-- Verification Code Section -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; text-align: center; border: 2px dashed #007bff;">
                                <p style="color: #333333; margin: 0 0 15px 0; font-size: 16px; font-weight: 500;">
                                    Your Email Verification Code:
                                </p>
                                <div style="background: linear-gradient(135deg, #007bff, #0056b3); color: blue; padding: 20px; border-radius: 8px; display: inline-block; min-width: 200px;">
                                    <h1 style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                                        ${verificationKey}
                                    </h1>
                                </div>
                                <p style="color: #666666; margin: 20px 0 0 0; font-size: 14px;">
                                    Enter this code on the verification page to complete your registration
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Instructions -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background-color: #e8f4ff; border-radius: 6px; padding: 20px;">
                                <h3 style="color: #0056b3; margin: 0 0 15px 0; font-size: 18px;">📝 How to Verify Your Email</h3>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="40" valign="top" style="color: #007bff; font-size: 18px;">1.</td>
                                        <td style="color: #333333; font-size: 14px; padding-bottom: 10px;">
                                            Return to the Morena Hotels registration page
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="40" valign="top" style="color: #007bff; font-size: 18px;">2.</td>
                                        <td style="color: #333333; font-size: 14px; padding-bottom: 10px;">
                                            Find the email verification section
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="40" valign="top" style="color: #007bff; font-size: 18px;">3.</td>
                                        <td style="color: #333333; font-size: 14px; padding-bottom: 10px;">
                                            Enter the verification code shown above
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="40" valign="top" style="color: #007bff; font-size: 18px;">4.</td>
                                        <td style="color: #333333; font-size: 14px;">
                                            Click "Verify Email" to complete your registration
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Important Information -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px;">
                                <h3 style="color: #856404; margin: 0 0 12px 0; font-size: 16px;">⚠️ Important Security Information</h3>
                                <ul style="color: #856404; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.5;">
                                    <li>This verification code will expire in <strong>24 hours</strong></li>
                                    <li>Do not share this code with anyone</li>
                                    <li>Morena Hotels will never ask for this code via phone or email</li>
                                    <li>If you didn't request this code, please ignore this email</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Next Steps -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">🎉 What's Next After Verification?</h3>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="40" valign="top" style="color: #007bff; font-size: 18px;">🔹</td>
                                    <td style="color: #666666; font-size: 14px; padding-bottom: 8px;">
                                        Complete your guest profile with preferences and special requests
                                    </td>
                                </tr>
                                <tr>
                                    <td width="40" valign="top" style="color: #007bff; font-size: 18px;">🔹</td>
                                    <td style="color: #666666; font-size: 14px; padding-bottom: 8px;">
                                        Access exclusive member rates and packages
                                    </td>
                                </tr>
                                <tr>
                                    <td width="40" valign="top" style="color: #007bff; font-size: 18px;">🔹</td>
                                    <td style="color: #666666; font-size: 14px;">
                                        Enjoy faster check-ins and personalized service
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Support Section -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 6px;">
                                <p style="color: #666666; margin: 0 0 10px 0; font-size: 14px;">
                                    Need help with verification?
                                </p>
                                <p style="color: #333333; margin: 0; font-size: 15px; font-weight: 500;">
                                    📞 Call us at +1 (555) 123-4567 or ✉️ support@morenahotels.com
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #2c3e50; padding: 30px 40px; text-align: center;">
                            <table width="100%">
                                <tr>
                                    <td>
                                        <img src="https://via.placeholder.com/150x40/ffffff/2c3e50?text=Morena" alt="Morena Hotels" style="max-width: 150px; height: auto; margin-bottom: 15px;">
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style="color: #bdc3c7; margin: 5px 0; font-size: 14px;">
                                            +1 (555) 123-4567 • guestservices@morenahotels.com
                                        </p>
                                        <p style="color: #bdc3c7; margin: 5px 0; font-size: 14px;">
                                            123 Luxury Avenue, Hospitality District
                                        </p>
                                        <p style="color: #95a5a6; margin: 15px 0 0 0; font-size: 12px;">
                                            © 2024 Morena Hotels. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 20px;">
                                        <a href="#" style="color: #3498db; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy Policy</a>
                                        <span style="color: #bdc3c7;">•</span>
                                        <a href="#" style="color: #3498db; text-decoration: none; font-size: 12px; margin: 0 10px;">Terms of Service</a>
                                        <span style="color: #bdc3c7;">•</span>
                                        <a href="#" style="color: #3498db; text-decoration: none; font-size: 12px; margin: 0 10px;">Contact Us</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Security Notice -->
                <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                    <tr>
                        <td align="center">
                            <p style="color: #7f8c8d; font-size: 12px; margin: 0; line-height: 1.4;">
                                For security reasons, please do not share this verification code with anyone. 
                                If you didn't create an account with Morena Hotels, please ignore this message 
                                and delete this email immediately.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

const sendPasswordResetEmail = async (email, firstName, lastName, verificationCode) => {

  const mailOptions = {
    from: `"Morena Hotels" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - Morena Hotels',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8f9fa;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px 40px; text-align: center;">
                            <table width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Company Logo Placeholder -->
                                        <div style="background-color: white; padding: 15px; border-radius: 8px; display: inline-block;">
                                            <img src="https://via.placeholder.com/200x60/dc3545/ffffff?text=Morena+Hotels" alt="Morena Hotels" style="max-width: 200px; height: auto;">
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 20px;">
                                        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Password Reset Request</h1>
                                        <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                                            Secure your account with verification
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                            <h2 style="color: #333333; margin: 0 0 10px 0; font-size: 22px;">Hello ${firstName} ${lastName},</h2>
                            <p style="color: #666666; margin: 0; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password for your Morena Hotels account. Use the verification code below to proceed with resetting your password.
                            </p>
                        </td>
                    </tr>

                    <!-- Verification Code Section -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; text-align: center; border: 2px dashed #dc3545;">
                                <p style="color: #333333; margin: 0 0 15px 0; font-size: 16px; font-weight: 500;">
                                    Your Password Reset Verification Code:
                                </p>
                                <div style="background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 20px; border-radius: 8px; display: inline-block; min-width: 200px;">
                                    <h1 style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                                        ${verificationCode}
                                    </h1>
                                </div>
                                <p style="color: #666666; margin: 20px 0 0 0; font-size: 14px;">
                                    Enter this code on the password reset page to verify your identity
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Instructions -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background-color: #ffe6e6; border-radius: 6px; padding: 20px;">
                                <h3 style="color: #dc3545; margin: 0 0 15px 0; font-size: 18px;">🔐 How to Reset Your Password</h3>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="40" valign="top" style="color: #dc3545; font-size: 18px;">1.</td>
                                        <td style="color: #333333; font-size: 14px; padding-bottom: 10px;">
                                            Return to the Morena Hotels password reset page
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="40" valign="top" style="color: #dc3545; font-size: 18px;">2.</td>
                                        <td style="color: #333333; font-size: 14px; padding-bottom: 10px;">
                                            Enter the verification code shown above
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="40" valign="top" style="color: #dc3545; font-size: 18px;">3.</td>
                                        <td style="color: #333333; font-size: 14px; padding-bottom: 10px;">
                                            Create a new strong password for your account
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="40" valign="top" style="color: #dc3545; font-size: 18px;">4.</td>
                                        <td style="color: #333333; font-size: 14px;">
                                            Confirm your new password to complete the process
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Security Alert -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px;">
                                <h3 style="color: #856404; margin: 0 0 12px 0; font-size: 16px;">🚨 Important Security Alert</h3>
                                <ul style="color: #856404; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.5;">
                                    <li>This verification code will expire in <strong>1 hour</strong> for security</li>
                                    <li><strong>Never share</strong> this code with anyone</li>
                                    <li>Morena Hotels staff will never ask for this code</li>
                                    <li>If you didn't request this reset, please contact us immediately</li>
                                    <li>Consider changing your password regularly for maximum security</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Didn't Request Section -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background-color: #e8f4ff; border-radius: 6px; padding: 20px; text-align: center;">
                                <h3 style="color: #0056b3; margin: 0 0 10px 0; font-size: 18px;">Not You?</h3>
                                <p style="color: #333333; margin: 0; font-size: 14px; line-height: 1.5;">
                                    If you didn't request a password reset, your account might be compromised. 
                                    <br>Please contact our security team immediately and change your password.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Password Tips -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">💡 Password Best Practices</h3>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="40" valign="top" style="color: #dc3545; font-size: 18px;">•</td>
                                    <td style="color: #666666; font-size: 14px; padding-bottom: 8px;">
                                        Use a combination of uppercase and lowercase letters
                                    </td>
                                </tr>
                                <tr>
                                    <td width="40" valign="top" style="color: #dc3545; font-size: 18px;">•</td>
                                    <td style="color: #666666; font-size: 14px; padding-bottom: 8px;">
                                        Include numbers and special characters
                                    </td>
                                </tr>
                                <tr>
                                    <td width="40" valign="top" style="color: #dc3545; font-size: 18px;">•</td>
                                    <td style="color: #666666; font-size: 14px; padding-bottom: 8px;">
                                        Make it at least 8 characters long
                                    </td>
                                </tr>
                                <tr>
                                    <td width="40" valign="top" style="color: #dc3545; font-size: 18px;">•</td>
                                    <td style="color: #666666; font-size: 14px;">
                                        Avoid using personal information or common words
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Support Section -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 6px;">
                                <p style="color: #666666; margin: 0 0 10px 0; font-size: 14px;">
                                    Need help or have security concerns?
                                </p>
                                <p style="color: #333333; margin: 0; font-size: 15px; font-weight: 500;">
                                    📞 Security Team: +1 (555) 123-4567<br>
                                    ✉️ security@morenahotels.com
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #2c3e50; padding: 30px 40px; text-align: center;">
                            <table width="100%">
                                <tr>
                                    <td>
                                        <img src="https://via.placeholder.com/150x40/ffffff/2c3e50?text=Morena" alt="Morena Hotels" style="max-width: 150px; height: auto; margin-bottom: 15px;">
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style="color: #bdc3c7; margin: 5px 0; font-size: 14px;">
                                            +1 (555) 123-4567 • security@morenahotels.com
                                        </p>
                                        <p style="color: #bdc3c7; margin: 5px 0; font-size: 14px;">
                                            123 Luxury Avenue, Hospitality District
                                        </p>
                                        <p style="color: #95a5a6; margin: 15px 0 0 0; font-size: 12px;">
                                            © 2024 Morena Hotels. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 20px;">
                                        <a href="#" style="color: #3498db; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy Policy</a>
                                        <span style="color: #bdc3c7;">•</span>
                                        <a href="#" style="color: #3498db; text-decoration: none; font-size: 12px; margin: 0 10px;">Terms of Service</a>
                                        <span style="color: #bdc3c7;">•</span>
                                        <a href="#" style="color: #3498db; text-decoration: none; font-size: 12px; margin: 0 10px;">Security Center</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Security Notice -->
                <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                    <tr>
                        <td align="center">
                            <p style="color: #7f8c8d; font-size: 12px; margin: 0; line-height: 1.4;">
                                This is an automated security message from Morena Hotels. 
                                For your protection, please do not share this verification code with anyone. 
                                If you received this email in error, please delete it immediately.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export { sendVerificationEmail, sendPasswordResetEmail };