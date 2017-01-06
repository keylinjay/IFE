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
var show={
	data:[],
	toHtml:function (node) {
		var html ='';
		 for(var i=0,l=this.data.length;i<l;i++){
		 	html +='<span>'+data[i]+'</span>';
		 }
		 node.innerHTML=html;
	}
}
function renderShowArea () {
	show.toHtml($('#show-area'));
}
function moveNode (node) {
	addClass.call(this,'sorted');
	this.parentElement.insertBefore(this,node);
}
function addClass (name) {
	var reg = new RegExp('[\\s]*'+name+'[\\s]*');
	if(!reg.test(this.className)){
		this.className += " "+name;
	}
}
function removeClass (name) {
	var reg = new RegExp('[\\s]*'+name+'[\\s]*');
	if(reg.test(this.className)){
		this.className = this.className.replace(reg,"");
	}
}
function insertSort () {
	var nodeList = document.getElementById('show-area').getElementsByTagName('span');
	var temValue=nodeList[0].innerText;
	var i=1,l=nodeList.length,j=0,key=i+1;
	var timer = setInterval(run,50);
	addClass.call(nodeList[0],'sorted');
	function run () {
		if(i<l){
			addClass.call(nodeList[i],'sorting');
			if(j>=0){
				addClass.call(nodeList[j],'serching');
				removeClass.call(nodeList[key],'serching');
				removeClass.call(nodeList[0],'serching');
				if((+nodeList[i].innerText)<(+nodeList[j].innerText)){
					key = j;
					j--;
				}else{
					removeClass.call(nodeList[j],'serching');
					j=-1;
				}
			}else{
				removeClass.call(nodeList[i],'sorting');
				
				moveNode.call(nodeList[i],nodeList[key]);
				
				i++;
				j=i-1;
				key=i+1;
			}
		}else{
			clearInterval(timer);
			return;
		}
	}
	

}
function insertLast (node,v) {
	var nBlock = document.createElement('span');
	nBlock.className = 'showData';
	nBlock.innerText = v;
	nBlock.style.height = v+'px';
	if(v){
		node.appendChild(nBlock);
	}
}
function insertFirst (node,v) {
	var nBlock = document.createElement('span'),
		nOldFirst = node.children[0];
	nBlock.className = 'showData';
	nBlock.innerText = v;
	nBlock.style.height = v+'px';
	if(v){
		node.insertBefore(nBlock,nOldFirst);
	}
	
}
function removeLast (node) {
	var l = node.children.length;
	if(l>0){
		node.removeChild(node.children[l-1]);
	}
	
}
function removeFirst (node) {
	var l = node.children.length;
	if(l>0){
		node.removeChild(node.children[0]);
	}
	
}
function randomBuildShow (node) {
	var s;
	node.innerHTML="";
	for(var i=0;i<50;i++){
		var v = Math.floor(Math.random()*300);
		insertLast(node,v);
		s += v+',';
	}
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