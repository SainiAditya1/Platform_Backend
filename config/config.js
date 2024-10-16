export const createVerificationEmail = (username, verificationLink) => {
  const mailOptions = {};
  mailOptions.subject = 'Account Verification on Deliverix Logistics Platform';
  mailOptions.html = `
      <h2 style="font-weight: bold;">Account Verification Required</h2>
      <p>Dear ${username},</p>
      <p>Thank you for registering on the Deliverix Logistics platform. To complete your registration and verify your account, please click the link below:</p>
      <p><a href="${verificationLink}" style="text-decoration: none; color: #007bff;">Verify My Account</a></p>
      <p>If you did not create an account using this email address, please ignore this email.</p>
      <p>If you have any questions or need further assistance, feel free to reach out to our support team.</p>
      <div>
          <p>Best regards,</p>
          <p><strong>The Deliverix Logistics Team</strong></p>
      </div>
      <p style="margin-top: 20px;">&copy; ${new Date().getFullYear()} Deliverix Logistics. All rights reserved.</p>
    `;

  return mailOptions;
};
