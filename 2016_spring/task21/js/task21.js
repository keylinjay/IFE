(function(undefined,window){
	function $(selector,contax,selectroot){
		return new $.fn.init(selector,contax,selectroot);
	}
	$.fn = $.prototype = {
		constructor:$,
		length:0,
		init:function(selector,contax,selectroot){
			if(!selector){
				return this;
			}
			var id = /^#([\w_-]+)/,
				cln = /^\.([\w_-]+)/,
				node,i,len;
			if(id.test(selector)){
				this.push(document.getElementById(selector.substring(1) ) );
			}else if(cln.test(selector)){
				node = document.getElementsByClassName(selector.substring(1) );
				for(i = 0,len = node.length;i < len;i++){
					this.push(node[i]);
				}
			}else{
				node = document.getElementsByTagName(selector);
				for(i = 0,len = node.length;i < len;i++){
					this.push(node[i]);
				}
			}
			return this;
		},
		push:function(){
			if(Array.prototype.push){
				Array.prototype.push.apply(this,arguments);
			}else{
			    	
			}
			return this;
		},
		foreach:function(fn){
			for(var i = 0;i < this.length;i++){
				fn.call(this,this[i]);
			}
			return this;
		},
		map:function(fn){
			if(Array.prototype.map){
				return Array.prototype.map.call(this,fn);
			}
		},
		reduce:function(fn){
			if(Array.prototype.reduce){
				return Array.prototype.reduce.call(this,fn);
			}
			var total = this[0];
			for(var i = 1,len = this.length;i < len;i++){
				total += fn.call(this,total,this[i])
			}
			return total;
		},
		html:function(html){
			this.foreach(function(v,i,a){
				v.innerHTML = html;
			});
		},
		addClass:function(name){
			var reg = new RegExp("\\s*"+name+"\\s*","g");
			this.foreach(function(node){
				if(!reg.test(name)){
					node.className += name;
				}
			});
			return this;
		},
		removeClass:function(name){
			var reg = new RegExp("\\s*"+name+"\\s*","g");
			this.foreach(function(node){
				node.className.replace(reg," ");
			});
			return this;
		},
		isArray:function(){},
		isObject:function(){},
		eventProx:function(targetName,eventtype,fn){
			this.foreach(function(v,i,a){
				v.addEventListener(eventtype,function(){
					var event = arguments[0] || window.event,
						target = event.target;
					if(target.tagName.toLowerCase() === targetName){
						fn(event,target);
					}
				},false);
			});
			return this;
		},
	}
	$.extend = $.fn.extend = function(){
		var deep = false,
			target = arguments[0] || {},
			len = arguments.length,
			i = 1,
			isArray = false,
			options,name,src,copy,clone;
		if(typeof arguments[0] === "boolean"){
			deep = arguments[0];
			target = arguments[1];
			i = i+1;
		}
		if(i === len){
			target = this;
			i = i-1;
		}
		for(;i < len;i++){
			if( (options = arguments[i]) != null){
				for(name in options){
					src = target[ name ];
					copy = options [ name ];
					if ( copy !== target ){
						if ( deep && ( typeof copy === "object" || (isArray = ( typeof copy === "Array" )) ) ){
							if(isArray){
								isArray = false;
								clone = src && ( typeof src === "Array" )? src : [];
							}else{
								clone = src && ( typeof src === "object" )? src : {};
							}
							target[ name ] = $.extend(deep,clone,copy);
						}else if ( copy !== "undefined" ){
							target[ name ] = copy;
						}
					}
				}
			}
		}
		return target;
	};

	$.fn.extend({
		
	});

	$.domReady = function(){};
	$.fn.init.prototype = $.fn;
	window.$ = $;
}(undefined,window));
// 业务代码
(function(undefined,window){
	var dataTag = [],
		dataHobby = [],
		ntag = '#tag',
		ninputTag = '#input-tag',
		nhobbies = '#hobby',
		ninputHobbies = '#input-hobbies';
	function add(data,v){
		if(data === dataTag){
			if(!v || /^[\s\,\，]$/.test(v) ){return data;}
			console.log('replace');
			data.push(v.replace(/[\s\n\,\，]+/g,""));	
		}else{
			var arr = [];
			// console.log(v.split(/[\s\n\t\,\，]+/));
			arr = v.split(/[\s\n\t\,\，]+/);
			arr = arr.map(function(v){return v.replace(/^\s*\s*$/g,"");});
			arr = arr.filter(function(v){return v != "";});
			// data = [];
			[].push.apply(data,arr);
		}
		if(data.length > 10){
			var len = data.length - 10;
			data.splice(0,len);
		}
	}
	function remove(data,v){
		var index = data.indexOf(v);
		data.splice(index,1);
	}
	function render(data,id){
		var s = "";
		for(var i =0,len = data.length;i < len;i++){
			s += "<span>"+data[i]+"</span>";
		}
		console.log(s);
		$(id).html(s);
	}
	function deleteTag(event,target){
		console.log(target.parentNode.id)
		if(target.parentNode.id === "tag"){
			remove(dataTag,target.innerText);
			render(dataTag,ntag);
		}else{
			remove(dataHobby,target.innerText);
			render(dataHobby,nhobbies);
		}
	}
	function addTag(event,target){
		var keychar = event.keyCode || event.which || false;
		if(keychar){
			console.log("tag");
			if(/[\s\,\，]/.test(target.value) || keychar ===13){
				add(dataTag,target.value);
				render(dataTag,ntag);
				target.value = "";
			}
		}else{
			add(dataHobby,$(ninputHobbies)[0].value);
			console.log(dataHobby);
			render(dataHobby,nhobbies);
		}
	}
	function init(){
		$(ninputTag).eventProx('input','keydown',addTag);
		$(ntag).eventProx('span','click',deleteTag);
		$("#cfm").eventProx('button','click',addTag);
		$(nhobbies).eventProx('span','click',deleteTag);

	}
	init();
}(undefined,window));


// 阻止表单自动提交
$("#form21")[0].onkeydown = function(e){
	return (e.keyCode || e.which)===13?false:true;
}

