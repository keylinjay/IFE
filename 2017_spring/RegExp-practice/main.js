var fselect = function (s) {
    return document.querySelectorAll(s);}

var testPhoneNumber = function (s) {
    var Reg = /(134|135|136|137|138|139|150)\d{8}/;
    return Reg.test(s);}
	       
