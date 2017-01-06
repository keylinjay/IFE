
function insertLast (node,v) {
	var nBlock = document.createElement('span');
	nBlock.className = 'showData';
	nBlock.innerText = v;
	if(v){
		node.appendChild(nBlock);
	}
}
function insertFirst (node,v) {
	var nBlock = document.createElement('span'),
		nOldFirst = node.children[0];
	nBlock.className = 'showData';
	nBlock.innerText = v;
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