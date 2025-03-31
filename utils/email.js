// utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendApprovalEmail = (clubName, slotTime, reason) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'scient@domain.com',
    subject: `Booking Approval Request for ${clubName}`,
    text: `Slot Time: ${slotTime}\nReason: ${reason}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log('Approval email sent: ' + info.response);
  });
};

module.exports = sendApprovalEmail;
