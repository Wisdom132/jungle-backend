const express = require("express");
const nodemailer = require('nodemailer');
const config = require('../config');
const exphbs = require('express-handlebars');
const hbs = require("nodemailer-express-handlebars")


const app = express();


let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: config.host_mailer,
    pass: config.host_mailer_password
  },
  tls: {
    rejectUnauthorized: false
  }
});

const handlebarOptions = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: 'src/views/patials',
    layoutsDir: 'src/views/layouts',
    defaultLayout: '',
  },
  viewPath: 'src/views/templates',
  extName: '.handlebars',
};

transporter.use('compile', hbs(handlebarOptions));



let confirmMail = (user, token) => transporter.sendMail({
  from: '"Jungle Deleveries" <ekpotwisdom@gmail.com>',
  to: user,
  subject: "Email Confirmation",
  text: 'If You Recieve This Then You Are A Strong Man',
  template: "confirmemail",
  context: {
    token: token
  }
});

let forgotPassword = (user, token) => transporter.sendMail({
  from: '"Jungle Deleveries" <ekpotwisdom@gmail.com>',
  to: user,
  subject: "Password Reset",
  text: 'If You Recieve This Then You Are A Strong Man',
  template: "forgotpassword",
  context: {
    token: token
  }
})

let resetConfirmation = (user) => transporter.sendMail({
  from: '"Jungle Deleveries" <ekpotwisdom@gmail.com>',
  to: user,
  subject: "Password Reset",
  text: 'If You Recieve This Then You Are A Strong Man',
  template: "resetConfirmation",
  context: {
    user: user
  }
})

let changePasswordConfirmation = (user) => transporter.sendMail({
  from: '"Jungle Deleveries" <ekpotwisdom@gmail.com>',
  to: user,
  subject: "Password Changed",
  text: 'If You Recieve This Then You Are A Strong Man',
  template: "changepasswordconfirmation",
  context: {
    user: user
  }
})

module.exports = {
  changePasswordConfirmation,
  confirmMail,
  forgotPassword,
  resetConfirmation
};