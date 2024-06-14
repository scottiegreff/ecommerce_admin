import nodemailer from "nodemailer";
import winston from "winston";

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export const sendMail = async (
  from: string,
  to: string,
  subject: string,
  html: string
) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  console.log(process.env.MAIL_HOST);
  console.log(process.env.MAIL_PASSWORD);

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: html,
    attachments: [
      {
        filename: "pol.jpg",
        path: "public/images/pol.jpg",
        cid: "unique@gmail.com",
      },
    ],
  };

  logger.info(`Sending mail to - ${to}`);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
    } else {
      logger.info("Email sent: " + info.response);
    }
  });
};
