const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        console.log("BREVO_USER:", process.env.BREVO_USER);
        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("BREVO_PASS exists:", !!process.env.BREVO_PASS);

        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_PASS
            }
        });

        console.log("Verifying SMTP...");
        await transporter.verify();
        console.log("SMTP VERIFIED");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;