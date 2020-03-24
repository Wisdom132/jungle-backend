const nodemailer = require("nodemailer");
const config = require( "../config" );


let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: config.host_mailer, 
      pass: config.host_mailer_password
    },
    tls: {
      rejectUnauthorized: false
    }
  });



  let confirmMail = (user) =>  transporter.sendMail({
    from: '"Jungle Deleveries" <ekpotwisdom@gmail.com>',
    to: user, 
    subject: "Testing Dynamic", 
    text: "If You Recieve This Then You Are A Strong Man",
    html: `hello`
  });

  module.exports = {
    confirmMail
};