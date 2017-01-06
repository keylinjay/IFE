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
						if ( deep && ( typeof copy === "object" || (isArray = ( Array.isArray(copy) )) ) ){
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

// 通用的函数
/**
 * 继承
 * @param  {object} obj 继承的原型
 * @return {object}     继承后的对象
 */
function inherit(obj){
	if(Object.create){
		return Object.create(obj);
	}
	var F = function (){};
	F.prototype = obj.prototype;
	return new F();
}
/**
 * 复制
 * @return {扩展后的对象} 进行扩展
 */
function extend(){
	return _g.extend.apply(undefined , arguments);
}
/**
 * 定义类
 * @param  {function} constructor [description]构造函数 实例字段
 * @param  {Object} menthod     [description]原型方法 实例方法
 * @param  {obj} statics     [description]类字段 类方法
 * @return {function}             [description]添加了上述字段和方法的构造函数
 */
function definedClass(constructor,menthod,statics){
	if(menthod){
		extend( constructor.prototype , menthod );
	}
	if( statics ){
		extend( constructor , statics );
	}
	return constructor;
}

function definedSubClass(parentClass , constructor , menthod , statics ){
	constructor.prototype = inherit(parent);
	constructor.prototype.constructor = constructor;
	return definedClass( constructor , menthod , statics );
}


// 业务代码
(function(undefined,window){
	// 定义抽象方法
	function abstractmethod(){throw 'abstract method'};

	function Tag(name , data){
		this.name = name || "";

		this.data = data || [];

		this.id = "#" + this.name;
	}

	extend(Tag.prototype ,{
			contain:function(v){
				return this.data.indexOf(v) === -1 ? false : true ;
			},

			add: function(){
				var i;

				for(i = 0;i < arguments.length ; i++){

					// 去除重复的数据，并且允许数组直接添加,不允许空数据
					if( Array.isArray( arguments[i] ) ){
						this.add.apply( this , arguments[ i ] );
					}else if( !this.contain( arguments[i] ) && arguments[i] !== "" ){
						this.data.push( arguments[ i ] );
					}
				}

				if(this.data.length > 10){
					this.data = this.data.splice( -10 , 10 );
				}

				return this;
			},
			delete: function(v){
				var data = this.data;
				var p = data.indexOf( v );
				data.splice( p , 1 );

				return this;
			},
			toHtml: function(){
				var s = "";
				var len = this.data.length;
				var i;
				for(i = 0; i < len ; i++){
					s += "<span>" + this.data[ i ] + "</span>";
				}
				return s;
			},
			render: function(){
				_g( this.id + ">.show" )[0].innerHTML = this.toHtml();
			},

		});

	var tag = new Tag( "tag" );

	var hobby = new Tag( "hobby" );



	function addTag(){

		var input = _g( tag.id + " input" )[0];

		input.onkeydown = function(e){
			var event = e || window.event;
			var keyChar = event.keyCode;
			var value = input.value;
			if( keyChar === 13 || /[\s\,\，]$/.test( value ) ){
				// trim处理
				value.replace( /^[\s]*[\s]*$/g , "" );

				tag.add( value.replace(/[\s\,\，]$/g , "") );
				console.log(tag.data);
				input.value = "";

				tag.render();
			}
		};
	}

	function addHobby(){
		var text = _g( hobby.id + " textarea" )[0];
		var btn = _g( hobby.id + " button" )[0];
		btn.onclick = function(e){
			var value = text.value;

			var data = value.split( /[\s\t\n\r\,\，\.\。]+/ );

			for(var i = 0 , len = data.length ; i < len ; i++ ){
				// trim处理
				data[i] = data[i].replace( /^[\s]*[\s]*$/g , "" );
				// 如果有空数组则删除
				if( data[i] === "" ){
					data.splice( i , 1 );
					len = data.length;
					i--;
				}
			}

			hobby.add( data );

			hobby.render();

			return false;

		}
	}

	function removeTag(Tag){
		_g(".show").eventProx("span" , "click" , function(e,t){
			var value = t.innerText || t.Textcontent;
			Tag.delete(value);
			Tag.render();
		});
	}

	function init(){
		addTag();
		removeTag(tag);

		addHobby();
		removeTag(hobby);
	}

	init();
}(undefined,window));


// 阻止表单自动提交
_g("#form21")[0].onkeydown = function(e){
	return (e.keyCode || e.which)===13?false:true;
}

