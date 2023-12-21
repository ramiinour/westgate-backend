var nodemailer = require('nodemailer');

const transporter = (username = null, password = null) => {
  if (!username || !password) {
    username = config.nodemailer.defaultEmailAddress;
    password = config.nodemailer.passwordForDefaultAddress;
  }
  return nodemailer.createTransport({
      host: 'smtp.googlemail.com',
      // host: 'smtp.mail.yahoo.com',
      port: 465,
      auth: {
        user: username,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false
      },
      logger: true
    });
}


module.exports = transporter;