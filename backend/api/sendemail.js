const nodemailer = require("nodemailer");
const cors = require("cors");

module.exports = async (req, res) => {
  // ✅ Enable CORS for requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { msg, emailList } = req.body;

    // ✅ Check if request contains valid data
    if (!msg || !emailList || !Array.isArray(emailList)) {
      return res.status(400).json({ success: false, error: "Invalid request data" });
    }

    // ✅ Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Send emails to each recipient
    for (const email of emailList) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "You got a Text Message from Your App!",
        text: msg,
      });
    }

    return res.status(200).json({ success: true, message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Failed to send email:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
