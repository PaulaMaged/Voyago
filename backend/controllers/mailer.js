import nodemailer from "nodemailer";

export const sendNotificationEmail = async (email, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anouarleon23@gmail.com",
      pass: "ppva kluy hkfg ziug",
    },
    tls: {
      rejectUnauthorized: false, // To fix certificate error
    },
  });

  const mailOptions = {
    from: "voaygemasters@gmail.com",
    to: email,
    subject: "no-subject",
    text: message,
  };

  return transporter.sendMail(mailOptions);
};
