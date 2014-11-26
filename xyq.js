/**
 * Created by Administrator on 2014/9/14.
 */
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 25,
    auth: {
        user: '13732263640@163.com',
        pass: 'djqq1987'
    }
});
transporter.sendMail({
    from: '老玩家<13732263640@163.com>',
    to: 'd1987j@qq.com',
    subject: '1',
    html: '<b>Hello world ✔</b>' // html body
}, function (err) {
    if (err) {
        console.log(err);
    }
});