const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    //1- Create a transporter (service that send email like 'gmail','mailgun', 'sendgrid', etc.)// gmail sen 500 email in the day
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, //if secure false port 587
      secure: true,
      auth: {
        user: "alizeroukiaya0911@gmail.com",
        pass: "tpipwvmgatjrbxhh",
      },
    });
    //2- define email options(like from ,to ,subject , email content )
    const mailOptions = {
      from: " Artissan Website <alizeroukiaya0911@gmail.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
    //3-send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
