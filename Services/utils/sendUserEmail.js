const nodemailer = require('nodemailer');

const sendUserEmail = async options => {
    try {
        var transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "a5702898b19d3e",
              pass: "7c86c42e72104a"
            }
          });

        const message = {
            from: `Clinic <admin@clinic.com>`,
            to: options.email,
            subject: options.subject,
            html: options.message
        }

        await transport.sendMail(message); 
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = sendUserEmail;