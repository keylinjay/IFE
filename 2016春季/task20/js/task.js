;(function (window,undefined) {
	 var $ = function (selector,contax,selectorRoot) {
	 	 return new $.fn.init(selector,contax,selectorRoot); 
	 };
	 $.fn = $.prototype ={
	 	//采用.prototype={}添加原型属性需要重新修正构造函数，否则构造函数会变成object
	 	constructor:$,
	 	length:0,
	 	splice:function (num) {
	 		 [].splice.call(this,num);
	 	},
	 	map:function (fn) {
	 		 [].map.call(this,fn);
	 	},
	 	init:function (selector,contax,selectorRoot) {
	 		 if(!selector){
	 		 	return this;
	 		 }
	 		 if(selector){
	 		 	//将查询到的nodelist添加到$对象中，因为$有length和splice，所以是个伪数组（其实有length就是伪数组）
	 		 	if(/^\#.+/.test(selector)){
	 		 		//如果是查询id就不能用apply
	 		 		[].push.call(this,this.find(selector));
	 		 	}else{
	 		 		[].push.apply(this,this.find(selector));
	 		 	}
	 		 	return this;
	 		 }
	 	},
	 	find:function (selector) {
	 		 if(/^\..+/.test(selector)){
	 		 	return document.getElementsByClassName(selector.substr(1));
	 		 }else if(/^\#.+/.test(selector)){
	 		 	return document.getElementById(selector.substr(1));
	 		 }else{
	 		 	return document.getElementsByTagName(selector);
	 		 }
	 	},
	 	addClass:function (str) {
	 		 var reg = new RegExp('\\s*'+str+'\\s*');
	 		 //利用map属性对数组操作
 		 	this.map(function (a) {
 		 		if(!reg.test(a.className)){
 		 			a.className += ' '+str;
 		 		}
 		 	});
	 		 return this; 
	 	},
	 	deleteClass:function (str) {
	 		 var reg = new RegExp('\\s*'+str+'\\s*');
	 		 this.map(function (a) {
	 		 	 if(reg.test(a.className)){
	 		 	 	a.className = a.className.replace(reg,'');
	 		 	 } 
	 		 });
	 		 return this;
	 	}
	 }
	 $.extend = $.fn.extend = function () {
	 	 var deep=false,isArray=false,
	 	 	 src, clone, option, name, copy,
	 	 	 len = arguments.length, 
	 	 	 //i永远指向新添加对象的参数位置
	 	 	 i=1,
	 	 	 //target为原有对象
 	 	 	 target=arguments[0] || {};
 	 	 //如果第一个参数为deep，那么就都往后移一位
 	 	 if(typeof target === 'boolean'){
 	 	 	deep = target;
 	 	 	i=2;
 	 	 	target = arguments[1];
 	 	 }
 	 	 //target不是对象或函数对象的情况
 	 	 if(typeof target !== 'object' && typeof target !== 'function'){
 	 	 	target = {};
 	 	 }
 	 	 //没有target的情况
 	 	 if(i === len){
 	 	 	target =this;
 	 	 	i = i-1;
 	 	 }
 	 	 
 	 	 for(;i<len;i++){
 	 	 	option = arguments[i];
 	 	 	//判断option是否是null或者undefined
 	 	 	if(option != null){
 	 	 		for(name in option){
 	 	 			src = target[name];
 	 	 			copy = option[name];
 	 	 			
 	 	 			//target已经有要添加的对象的情况
 	 	 			if(target === copy){
 	 	 				continue;
 	 	 			}
 	 	 			isArray = (copy instanceof Array);
 	 	 			if(deep && copy && (typeof copy ==='object' || isArray ) ){
 	 	 				if(isArray){
 	 	 					isArray = false;
 	 	 					clone = src && (src instanceof Array)?src:[];
 	 	 				}else{
 	 	 					clone = src && (typeof src === 'object')?src:{};
 	 	 				}
 	 	 				target[name]=$.extend(deep,clone,copy);
 	 	 			}else if(copy !== undefined){
 	 	 				target[name]=copy;
 	 	 				
 	 	 			}
 	 	 		}
 	 	 	}
 	 	 }
 	 	 
	 	 //返回添加后的对象
	 	 return target;
	 }
	 
	 
	 $.fn.init.prototype = $.fn;
	 window.$ = $;
}(window));


var data=[];

function renderForm (match) {
	console.log(data);
	$('#show-area')[0].innerHTML = data.map(function (a) {
		//避免直接修改原数组
		var value =a;
		  if(match){
		  	value = value.replace(new RegExp(match,'g'),'<span class=select>'+match+'</span>');
		  }else {
		  	console.log('no-match');
		  	value = '<span>'+value+'</span>';
		  }
		  return value;
	}).join('');
}
function getInputValue () {
	var str = $('#text-input')[0].value;
	
	str = $('#text-input')[0].value.split(/[^\w\u4e00-\u9fa5]+/).filter(function (a) {
		 return a!="";
	});
	return str;
}
function btnHandle (fnc) {
	var value = getInputValue();
	// 更新data的数据
	fnc.apply(data,value);
	renderForm();
}
$('#left-in')[0].onclick = function(){btnHandle([].unshift);}
$('#left-out')[0].onclick = function(){btnHandle([].shift);}
$('#right-in')[0].onclick = function(){btnHandle([].push);}
$('#right-out')[0].onclick = function(){btnHandle([].pop);}

$('#btn-find')[0].onclick = function () {
	 renderForm($('#find')[0].value); 
}