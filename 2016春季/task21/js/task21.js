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
			this.push(this.find(selector) );
			this.name = selector;
			return this;
		},
		push:function(){
			console.log(arguments);

			if(Array.push){
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
			if(Array.map){
				Array.map.call(this,fn);
				return this;
			}
		},
		reduce:function(fn){
			if(Array.reduce){
				Array.reduce.call(this,fn);
				return this;
			}
		},
		html:function(html){
			this.foreach(function(){
				this.innerHTML = html;
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
		find:function(selector){
			var id = /^#([\w_-]+)/,
				cln = /^\.([\w_-]+)/;
			if(id.test(selector)){
				this.push(document.getElementById(selector.substring(1) ) );
			}else if(cln.test(selector)){
				this.push(document.getElementsByClassName(selector.substring(1) ) );
			}else{
				return document.getElementsByTagName(selector) ;
			}
			// return this;
		},
	}
	$.extend = function(){};
	$.domReady = function(){};
	$.fn.init.prototype = $.fn;
	window.$ = $;
}(undefined,window));
function showppt(o){
	console.log(arguments);
	for(var p in o){
		if(o.hasOwnProperty(p)){
			console.log(p+':'+o[p]+'\n');
		}
	}
}