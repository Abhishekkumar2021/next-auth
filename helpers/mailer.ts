import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,
  port: process.env.SMTP_PORT as unknown as number,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const mailOptions = {
      from: "abhishek@gmail.com",
      to,
      subject,
      html,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
