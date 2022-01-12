require('dotenv').config();


const sMail = require('@sendgrid/mail');
sMail.setApiKey(process.env.SENDGRID_API_KEY);


async function sendEmail(from, to, subject, body) {
    try {
        let payload = {
            to: to,
            from: from,
            subject: subject,
            html: body
        }
       let resp= await sMail.send(payload);
       console.log(resp)
    } catch (error) {
        console.log(error)
        return Promise.reject(error);
    }
}


module.exports = {
    sendEmail
}