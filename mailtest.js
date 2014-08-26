var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.126.com',
    port: 25,
    auth: {
        user: 'xiangjf01@126.com',
        pass: '01xiangjf'
    }
});
transporter.sendMail({
    from: 'xiangjf01@126.com',
    to: 'dingjian@pipikou.com',
    subject: 'hello',
    text: 'hello world!'
}, function (err) {
    if (err) {
        console.log(err);
    }
});