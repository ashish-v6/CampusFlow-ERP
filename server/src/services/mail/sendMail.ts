import nodemailer from "nodemailer";
import _config from "../../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: _config.mailUser,
    clientId: _config.mailClientId,
    clientSecret: _config.mailClientSecret,
    refreshToken: _config.mailRefreshToken,
  },
});

transporter.verify((error: Error | null, success: boolean) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages", success);
  }
});

// Function to send email
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `By Authentication service`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { transporter, sendEmail };
