const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // ✅ Sans guillemets
      secure: true,
      auth: {
        user: "alizeroukiaya0911@gmail.com",
        pass: "tpipwvmgatjrbxhh",
      },
    });

    const mailOptions = {
      from: '"Test" <alizeroukiaya0911@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
