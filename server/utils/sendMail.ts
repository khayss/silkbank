import nodemailer from "nodemailer";

export const sendMail = async (email: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      to: email,
      subject: subject,
      text: text,
      html: `<h1>Silk Bank</h1><p>${text}</p>`,
    });

    console.log(`Message sent: ${info.messageId}`);
  } catch (error: any) {
    console.log(
      `Error occured while sending mail\n Error message: ${error.message}`
    );
  }
};
