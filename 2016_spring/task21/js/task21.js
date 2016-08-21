(function(undefined,window){
	var _g = function _g(selector,context,selectroot){
		return new _g.fn.init(selector,context,selectroot);
	}
	_g.fn = _g.prototype = {
		constructor:_g,
		length:0,
		init:function(selector,context,selectroot){
			if(!selector){
				return this;
			}
			_g.merge( this , _g.find(selector) );
			return this;
		},
		each:function(callback,args){
			return _g.each(this, callback , args );
		},
		html:function(html){
			this.each(function(node){
				node.innerHTML = html;
			});
		},
		addClass:function(name){
			var reg = new RegExp("\\s*"+name+"\\s*","g");
			this.each(function(node){
				if(!reg.test(name)){
					node.className += name;
				}
			});
			return this;
		},
		removeClass:function(name){
			var reg = new RegExp("\\s*"+name+"\\s*","g");
			this.each(function(node){
				node.className.replace(reg," ");
			});
			return this;
		},
		eventProx:function(targetName,eventtype,fn){
			this.each(function(node){
					node.addEventListener(eventtype,function(){
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
	_g.extend = _g.fn.extend = function(){
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
							target[ name ] = _g.extend(deep,clone,copy);
						}else if ( copy !== "undefined" ){
							target[ name ] = copy;
						}
					}
				}
			}
		}
		return target;
	};

	_g.extend({
		find:function(selector){
			if(document.querySelectorAll(selector) ){
				return document.querySelectorAll(selector);
			}else{
				throw "not support querySelectorAll";
			}
		},
		merge:function(first,second){
			var len = second.length;
			var i = first.length;
			var j;
			for( j = 0 ; j < len ; j++ ){
				first[ i++ ] = second[ j ];
			}
			first.length = i;
			return first;
		},
		each:function(obj,callback,args){
			var len = obj.length;
			var i;
			var value;
			if( args ){
				for( i = 0 ; i < len ; i++ ){
					value = callback.apply( obj , args );
					if(value === false){
						break;
					}
				}
			}else{
				for( i = 0 ; i < len ; i++ ){
					value = callback.call( obj , obj[i] );
					if(value === false){
						break;
					}
				}
			}
			return obj;
		},
	});

	_g.fn.init.prototype = _g.fn;
	window._g = _g;
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
			if(!v || /^[\s\,\，]_g/.test(v) ){return data;}
			console.log('replace');
			data.push(v.replace(/[\s\n\,\，]+/g,""));	
		}else{
			var arr = [];
			arr = v.split(/[\s\n\t\,\，]+/);
			arr = arr.map(function(v){return v.replace(/^\s*\s*_g/g,"");});
			arr = arr.filter(function(v){return v != "";});
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
		_g(id).html(s);
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
			add(dataHobby,_g(ninputHobbies)[0].value);
			console.log(dataHobby);
			render(dataHobby,nhobbies);
		}
	}
	function init(){
		_g(ninputTag).eventProx('input','keydown',addTag);
		_g(ntag).eventProx('span','click',deleteTag);
		_g("#cfm").eventProx('button','click',addTag);
		_g(nhobbies).eventProx('span','click',deleteTag);

	}
	init();
}(undefined,window));


// 阻止表单自动提交
_g("#form21")[0].onkeydown = function(e){
	return (e.keyCode || e.which)===13?false:true;
}

