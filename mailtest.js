/*
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
});*/


var multipost = require("multipost");
var userlist = ['上海乐凯旅行社有限公司,周旭超,13916773571,zhouxuchao@126.com,1192642989,上海市松江区谷阳北路1250弄64号302室,zhouxuchao@126.com,ILOVETMY25',
    '上海自由之旅旅行社浦东分部,张金萍,13917368902,zzjjpp79@126.com,654908688,零陵路上影广场3号楼913室,zzjjpp79@126.com,790109172',
    '中信国旅,许磊,13901621632,1009869391@qq.com,1009869391,天目路57号,1009869391@QQ.com,369369369',
    '上海龙廷国际旅行社（浦江营业部）,张民,13917623175,1243215192@qq.com,1243215192,上海市闵行区江文路559弄18-8号,1243215192@qq.com,luzhangjie001124',
    '上海嘉缘旅行社,冯雁,13817078560,442520429@qq.com,442520429,塔城路688弄9号,442520429@qq.com,2001515',
    '上海奢逸旅游咨询有限公司,杨逸,18918211312,yaoyizil@163.com,,,yaoyizil@163.com,lingling1128',
    '南通在途旅行社（麦窝旅行网）,余彬,18051606301,402125385@qq.com,402125385,如皋市如城街道绘园二区131#101室,402125385@qq.com,XFyubin123',
    '上海巴士国际旅游有限公司奉贤育秀东路营业部,顾爱群,13651867488,810522335@qq.com,810522335,奉贤育秀东路367号,810522335@qq.com,002899',
    '上海芒果国际旅行社有限公司,李杰,13661809918,61389847@qq.com,61389847,闵行区莘浜路85弄11楼,61389847@qq.com,821001',
    '上海航空国际旅游（集团）有限公司靖宇东路营业部,陈莉洁,13761891920,jdsj0330@163.com,30944691,上海市靖宇东路73号,jdsj0330@163.com,20110330',
    '上海航空国际旅行社有限公司,马国俊,13701932736,168666160@qq.com,168666160,霍山路300号,168666160@qq.com,maguojun19790604',
    '上海思渊国际旅行社有限公司,陈郁,13918017917,278749067@qq.com,278749067,协和路1033号文洋大厦B幢2层,278749067@qq.com,123456',
    '上海达程旅行社,秦丽丽,13512179948,90800294@qq.com,90800294,金山路459号,90800294@qq.com,888888',
    '南通在途旅行社（麦窝旅行网）,余彬,18051606301,402125385@qq.com,402125385,如皋市如城街道绘园二区131#101室,402125385@qq.com,XFyubin123',
    '巴士国旅天钥桥营业部,姜斌,13386086392,12197380@qq.com,12197380,斜土路2701号,12197380@qq.com,121314',
    '上海夕阳红国际旅行社,杨玉宝,13901640444,139016400@qq.com,139016400,西藏中路728号美欣大厦612室,139016400@qq.com,13901640444',
    '上海乐名国际旅行社有限公司,朱震龙,13817922555,johnlow@126.com,391905127,万航渡路2170号b6,johnlow@126.com,3424115',
    '黎新国旅（民生路营业部）,张卫东,18916211149,228807807@qq.com,228807807,浦东民生路499号北楼201室,228807807@qq.com,58853656',
    '上海新康辉五莲路营业部,孙志国,13916346085,1183715579@qq.com,1183715579,浦东新区五莲路749号-1,1183715579@qq.com,13916346085',
    '上海红楼旅行社有限公司,殷珣,13761676561,34922705@163.com,34922705,松江区谷阳北路5号,34922705@163.com,yx840323'];

var userlist2 = [ '上海自由之旅旅行社浦东分部,张金萍,13917368902,zzjjpp79@126.com,654908688,零陵路上影广场3号楼913室,zzjjpp79@126.com,790109172'];



var postFields = [
    {
        name: "email", //Required
        value: "1@qq.com" //Required
    },
    {
        name: "nickname",
        value: "1"
    },
    {
        name: "sex", //Required
        value: "1" //Required
    },
    {
        name: "password",
        value: "1111111"
    }
];

/*
for(var i=0;i<userlist2.length;i++){
    var data = userlist2[i].split(',');
    var postF = [];
    var s1 = {name:"TBValicode",value:""};
    var s2 = {name:"Type",value:"radDistributor"};
    var s3 = {name:"btnComplete",value:"注册"};
    var s4 = {name:"dropProvinces",value:"310000"};
    var s5 = {name:"droplevalCity",value:"310000"};
    var s6 = {name:"hidCity",value:"310000"};
    var s7 = {name:"hidOffice",value:""};
    var s8 = {name:"txtAddress",value:data[5]};
    var s26 = {name:"txtAdminCode",value:data[6].split('@')[0]};
    var s9 = {name:"txtCompanyPhone",value:data[2]};
    var s10 = {name:"txtCompanyName",value:data[0]};
    var s11 = {name:"txtContact",value:data[1]};
    var s12 = {name:"txtContactPhone",value:data[2]};
    var s13 = {name:"txtEmail",value:data[3]};
    var s14 = {name:"txtFax",value:""};
    var s15 = {name:"txtFlightChangNoticeMobile",value:data[2]};
    var s16 = {name:"txtHeader",value:""};
    var s17 = {name:"txtHeaderPhone",value:""};
    var s18 = {name:"txtMsnQQ",value:""};
    var s19 = {name:"txtPostNo",value:""};
    var s20 = {name:"txtPwd",value:data[7]};
    var s21 = {name:"txtPwdSure",value:data[7]};
    var s22 = {name:"txtRemark",value:""};
    var s23 = {name:"txtShoreName",value:data[0]};
    var s24 = {name:"txtUrl",value:""};
    postF.push(s1);
    postF.push(s26);
    postF.push(s2);
    postF.push(s3);
    postF.push(s4);
    postF.push(s5);
    postF.push(s6);
    postF.push(s7);
    postF.push(s8);
    postF.push(s9);

    postF.push(s10);
    postF.push(s11);
    postF.push(s12);
    postF.push(s13);
    postF.push(s14);
    postF.push(s15);
    postF.push(s16);
    postF.push(s17);
    postF.push(s18);
    postF.push(s19);
    postF.push(s20);
    postF.push(s21);
    postF.push(s22);
    postF.push(s23);
    postF.push(s24);

    var req = new multipost("http://b2b.loyoyo.com/User/CompanyRegister.aspx", postF);
    req.post(function(res) {
        console.log(res.data);
    });
}
*/






for(var i=0;i<userlist2.length;i++) {
    var data = userlist2[i].split(',');
    var postF = [];
    var s1 = {name: "age", value: "saveUser"};
    var s2 = {name: "age", value: "30"};
    var s3 = {name: "app", value: "hd"};
    var s4 = {name: "area", value: "310112"};
    var s5 = {name: "height", value: "178"};
    var s6 = {name: "method", value: "全身"};
    var s7 = {name: "mod", value: "detail"};
    var s8 = {name: "phone", value: data[2]};

    var s9 = {name: "uname", value: data[1]};
    var s10 = {name: "weight", value: 70};
    var s11 = {name: "sex", value: 3};
    postF.push(s1);
    postF.push(s2);
    postF.push(s3);
    postF.push(s4);
    postF.push(s5);
    postF.push(s6);
    postF.push(s7);
    postF.push(s8);
    postF.push(s9);
    postF.push(s10);
    postF.push(s11);
    var req = new multipost("http://www.yesshou.com/index.php", postF);
    req.post(function (res) {
        console.log(res.data);
    });
};

