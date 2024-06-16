import path from 'path';
import nodemailer from 'nodemailer';
import { MAIL_APP_PASSWORD, MAIL_SENDER } from '@/config';
// tslint:disable-next-line: no-var-requires
const hbs = require('nodemailer-express-handlebars');

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_SENDER,
    pass: MAIL_APP_PASSWORD,
  },
});

const hbsConfig = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.join(__dirname, '../views/'),
    layoutsDir: path.join(__dirname, '../views/'),
    defaultLayout: '',
  },
  viewPath: path.join(__dirname, '../views/'),
  extName: '.hbs',
};

export const sendEmail = async (
  to: string,
  subject: string,
  template: string,
  context: object,
) => {
  transporter.use('compile', hbs(hbsConfig));

  const email = {
    form: MAIL_SENDER,
    template,
    to,
    subject,
    context,
  };

  await transporter.sendMail(email);
};
