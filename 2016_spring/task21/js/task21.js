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
						fn(target);
					}
				},false);
			});
			return this;
		},
	}
	$.extend = function(){};
	$.domReady = function(){};
	$.fn.init.prototype = $.fn;
	window.$ = $;
}(undefined,window));
// 业务代码
(function(undefined,window){
	var data = [];
	function add(v){
		data.push(v.replace(/[\s\n\,\，]+/,""));
		if(data.length > 10){
			data = data.splice(-10,10);
		}
	}
	function remove(v){
		var index = data.indexOf(v);
		data.splice(index,1);
	}
	function render(id){
		var s = "";
		for(var i =0,len = data.length;i < len;i++){
			s += "<span>"+data[i]+"</span>";
		}
		console.log(s);
		$(id).html(s);
	}
	function deleteTag(node){
		remove(node.innerText);
		render("#tag");
	}
	function init(){
		add($("#input-tag")[0].value);
		render("#tag");
		$("#input-tag")[0].value = '';
	}

	$("#input-tag")[0].onkeydown = function(){
		var event = arguments[0] || window.event,
			keychar = event.keyCode || event.which;
			console.log(keychar);
		if(/[\s\n\,\，]$/.test(this.value) || keychar === 13 ){
			init();
		}
	};
	$("#tag").eventProx('span','click',deleteTag);
}(undefined,window));


// 阻止表单自动提交
$("#form21")[0].onkeydown = function(e){
	return (e.keyCode || e.which)===13?false:true;
}

