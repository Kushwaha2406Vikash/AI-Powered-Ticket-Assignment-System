import nodemailer from "nodemailer";

const sendMail = async (to, subject, text) => {
 // console.log("📤 Sending email to:", to); // ✅ ADD HERE
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    /*
    // ✅ Verify once at startup
    transporter.verify((error, success) => {
      if (error) {
        console.log("❌ Gmail SMTP Error:", error);
      } else {
        console.log("✅ Gmail SMTP is ready to send emails");
      }
    });*/
    const info = await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

   // console.log("message send", await info.messageId);
    return info;
  } catch (error) {
    console.log("Mail error", error.message);
    throw error;
  }
};

export default sendMail;
