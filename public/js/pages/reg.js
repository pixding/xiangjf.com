define(function (require, exports, module) {
    var $ = require("libs/jquery");
    require('libs/validate')($);

    $.validator.addMethod("byterangelength", function (value, element, param) {
        var length = value.length;
        for (var i = 0; i < value.length; i++) {
            if (value.charCodeAt(i) > 127)
                length++;
        }
        return this.optional(element) || (length >= param[0] && length <= param[1]);
    }, $.validator.format("请确保输入的值在{0}-{1}个字符之间(一个中文字算2个字符)"));

    $.validator.addMethod("nickname", function (value, element) {
        return this.optional(element) || /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_])*$/i.test(value);
    }, "昵称只能由中文字、英文字母、数字组成!");

    $("#regform").validate({
        errorPlacement: function (label, element) {
            label.appendTo(element.parents('.regitem'));
        },
        onkeyup:false,
        rules: {
            email: {
                required: true,
                email: true,
                remote: {
                    type: "POST",
                    url: "validateAccount?type=reg"
                }
            },
            nickname: {
                required: true,
                nickname:true,
                byterangelength: [4, 14]
                
            },
            sex:{
                required:true
            },
            password: {
                required: true,
                rangelength:[6,16]
            },
            pasagain: {
                required: true,
                equalTo:"#password"
            }
            

        },
        messages: {
            email: {
                required: "请输入您的常用邮箱，作为登录帐号",
                email:"您输入的邮箱格式不正确",
                remote:"该邮箱已被注册，<a href='#'>立即登陆</a>"
            },
            nickname: {
                required: "请输入昵称"
            },
            sex: {
                required: "请选择您的性别"
            },
            password: {
                required: "请设置密码"
            },
            pasagain: {
                required: "请再输一次密码",
                equalTo:"两次密码输入不一致"
            }
        },
        success:function(label){
            label.addClass("valid").text("　")
        },
        submitHandler:function(form){
            $(".btn-register").attr("disabled","disabled").addClass("btn-registering");
            form.submit();
        }
    });

    $("#loginform").validate({
        errorPlacement: function (label, element) {
            label.appendTo(element.parents('.regitem'));
        },
        onkeyup:false,
        rules: {
            email: {
                required: true,
                email: true,
                remote: {
                    type: "POST",
                    url: "validateAccount?type=login"
                }
            },
            pass: {
                required: true,
                rangelength:[6,16]
            }


        },
        messages: {
            email: {
                required: "请输入您的登录邮箱",
                email:"您输入的登录邮箱格式不正确",
                remote:"您的帐号不存在，如果您还没有注册，<a href='#'>去注册</a>"
            },
            pass: {
                required: "请输入密码",
                rangelength:"您的密码不正确"
            }
        },
        submitHandler:function(form){
            $(".btn-login").attr("disabled","disabled").addClass("btn-logining");
            form.submit();
        }
    });
    

});