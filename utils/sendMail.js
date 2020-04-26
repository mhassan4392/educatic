const nodemailer = require("nodemailer");
// async..await is not allowed in global scope, must use a wrapper
const sendMail = async (options) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME, // generated ethereal user
      pass: process.env.SMTP_PASSWORD // generated ethereal password
    }
  });

  // send mail with defined transport object

  let message = {
    from:  `${process.env.SMTP_NAME} <${process.env.SMTP_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  }

  await transporter.sendMail(message)
}

module.exports = sendMail