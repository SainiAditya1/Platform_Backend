const nodemailer = require('nodemailer');

const createTransporter = (user, pass) => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass,
    },
  });
};

const sendMail = async (
  owner,
  pass,
  from,
  to,
  subject,
  htmlContent,
  attachments = []
) => {
  const transporter = createTransporter(owner, pass);

  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: htmlContent,
      attachments: attachments,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = { sendMail };
