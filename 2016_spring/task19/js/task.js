var $ = function (name) {
	 var regid = /^#.+/,
	 	regcls= /^\..+/,
	 	regtag= /[a-zA-Z]+/;
	 if (regid.test(name)) {
	 	return document.getElementById(name.substring(1));
	 }else if(regcls.test(name)){
	 	return document.getElementsByClassName(name.substring(1));
	 }else{
	 	return document.getElementsByTagName(name);
	 }
}
var chart={
	data:[],
	toHtml:function (node) {
		var html ='';
		 for(var i=0,l=this.data.length;i<l;i++){
		 	html +='<span id='+i+' style=height:'+this.data[i]+'px>'
		 			+this.data[i]+'</span>';
		 }
		 node.innerHTML=html;
	}
}
function renderChart () {
	chart.toHtml($('#show-area'));
}

function randomBuildShow (node) {
	chart.data=[];
	for(var i=0;i<50;i++){
		var v = Math.floor(Math.random()*300);
		chart.data.push(v);
	}
	renderChart();
}

function addEvent (node,eventType,handle) {
	node.addEventListener(eventType, handle,false);
}

function eventProx (node,tag,eventType,handle) {
	addEvent(node,eventType,function () {
		var event = arguments[0] || window.event,
			target = event.target;
			if(target.tagName.toLowerCase()===tag){
				handle.apply(target,event);
			}
	});
}

function funButton () {
	var value = document.getElementById('text-input').value,
		nShow = document.getElementById('show-area');
	switch (this.id) {
		case 'left-in':
			insertFirst(nShow,value);
			break;
		case 'right-in':
			insertLast(nShow,value);
			break;
		case 'left-out':
			removeFirst(nShow);
			break;
		case 'right-out':
			removeLast(nShow);
			break;
		case 'random-show':
			randomBuildShow(nShow);
			break;
		case 'sort':
			insertSort();
			break;
	}
}

function removeSelf () {
	this.parentElement.removeChild(this);
}


function initFunArea () {
	var funArea = document.getElementById('fun-area');
	eventProx(funArea,'button','click',funButton);
}

function initShowArea () {
	var nShow = document.getElementById('show-area');
	eventProx(nShow,'span','click',removeSelf);
}

function init () {
	initFunArea();
	initShowArea();
}
window.onload = init;