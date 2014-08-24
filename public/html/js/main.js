define(function (require, exports, module) {
    var $ = require("jquery");
    require('validate')($);
    $("#regform").validate({
        rules: {
            email: {
                required:true
            }
        },
        messages: {
            email: {
                required:"xxxx"
            }
        }
    });
    

});