import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "22550a0b861d92",
      pass: "45cab8ed38e3e1"
    }
});

export const sendMail = async (to: string, subject: string, html: string) => {
    try {
        const mailOptions = {
            from: 'abhishek@gmail.com',
            to,
            subject,
            html
        };

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error : any) {
        throw new Error(error.message);
    }
};