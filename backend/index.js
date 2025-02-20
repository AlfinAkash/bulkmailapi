require("dotenv").config();
const nodemailer = require("nodemailer");
const cors = require("cors");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // CORS Middleware
  cors({
    origin: ["http://localhost:3000", "https://bulkmailapi.vercel.app"], // Add your frontend domain
    methods: ["POST"],
  })(req, res, async () => {
    try {
      const { msg, emailList } = req.body;

      // Validate input
      if (!msg || !Array.isArray(emailList) || emailList.length === 0) {
        return res.status(400).json({ success: false, error: "Invalid input data" });
      }

      // Configure Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      for (const email of emailList) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "You got a Text Message from Your App!",
          text: msg,
        });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Failed to send email:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });
};
