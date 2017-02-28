


var fselect = function (s) {
    return document.querySelectorAll(s);}

var testPhoneNumber = function (s) {

    var Reg = new RegExp("1(3[0-35-9]|[4578]\\d)\\d{8}");
    return Reg.test(s);}

var testRepeateWorld = function (s) {
    var Reg = /\b(\w+)\b\s+\1\b/;
    return Reg.test(s);}

var showContent = function (node, s) {
    node.innerText = s;}


		
		
	
    
    


function blindshow (node, show, eventname, ftest) {
    node.addEventListener(eventname, function (e){
	showContent(show, node.value + " is " + ftest(node.value));},
			  false);
    
}


function init (){
    blindshow(fselect('#task1')[0],
	      fselect('.task1')[0],
	      'keyup',
	      testPhoneNumber);
    blindshow(fselect('#task2')[0],
	      fselect('.task2')[0],
	      'keyup',
	      testRepeateWorld);
}


init();
	
