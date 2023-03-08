const nodemailer = require('nodemailer');
const Code = require('../API/RandNum');

async function MailSender(mail){
    const mailAddress = "your id"; // sender's Mail
    const mailPassword = "your password"; // The password This Account
    let code = await Code.CreateCode();
    let transporter = nodemailer.createTransport({
        host : "smtp.naver.com", // Your smtp Server name
        secure : true, // port number 465 if the value is false then You can use anoter port
        auth : { // sender's inform
            user : mailAddress,
            pass : mailPassword
        }
    }); // This is the sender's information Maybe?

    return new Promise((resolve) => {
        transporter.sendMail({
        from : `"Unknown" <your mail>`, // The sender's inform
        to : mail, // reciever's address
        subject : "Title", // The subject of Mail
        text : `The code is: ${code}` // The contents of Mail
    }, (err, info) => {
        if(err) {
            resolve({"response" : false});
        }
        else {
            resolve({"response" : true, "code" : code});
        }
    })});
}

module.exports = { MailSender : MailSender };