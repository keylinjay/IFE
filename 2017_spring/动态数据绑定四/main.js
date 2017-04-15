

var Vue = function (obj){
	this.data = obj.data;
	this.el = obj.el;
	this.listener = [];
	
	this.convertf(obj.data);
}
var proto = Vue.prototype;
// 定义对象转换的方法。
proto.convertf = function (obj){
	var listener = this.listener,
		trigger = this.$trigger;
	function convertf (obj) {
		function subConvertf (key, val){	
			Object.defineProperty(obj, key, {	
				enumerable: true,
				configurable: true,
				get: function (){
					console.log('你访问了' + key + ":" +val);
					return val;
				},
				set: function (newval){
					console.log('你设置了' + key);
					console.log('新的' + key + ' = ' + newval);

					if (typeof newval === 'object'){
						convertf(newval);
					}
					if (newval === val) return;
					val = newval;
					var parentPath = obj._parent_path_;
					console.log ('parantPath is:' + parentPath);
					trigger(listener, parentPath + '.' + key, [val]);
				}
			});
		}

		for (var key in obj){
			if (obj.hasOwnProperty(key)){
				if (typeof obj[key] === "object"){
					obj[key]._parent_path_ = (function(){
						if(!obj._parent_path_){
							obj._parent_path_ = 'top';
						}
						var newpath = obj._parent_path_ + '.' + key;
						console.log(newpath);
						return newpath;
					}());
					convertf(obj[key]);
				}
				
				subConvertf(key, obj[key]);
			}
		}
		
		return obj;
	}

	convertf(obj);
}
// 定义添加监听事件的方法；
proto.$watch = function (key, fn){
	var listener = this.listener,
		key = 'top.' + key,
		index = this.listener.indexOf(key);
	if (index === -1){
		listener.push(key);
		listener[key] = [fn];

	}else{
		if (listener[key].indexOf(fn) === -1){
			listener[key].push(fn);
		}
	}
}
proto.$trigger = function (listener, key, args, fn){
	
	if (fn){
		triggerFn(key, fn);
	}else{

		bubble(key);
	}
	function triggerFn (key, fn){
		if (listener.indexOf(key) === -1) return;
		if (listener[key].indexOf(fn) !== -1){
			fn.apply(fn, args);
		}
	}
	function triggerAll (key){
		if (listener.indexOf(key) === -1) return;
		listener[key].forEach(
			function(fn){
				fn.apply(fn, args);
			});
	}
	function bubble (key){
		var arkey = key.split('.');
		iter(arkey);
		function iter(arkey){
			if(arkey.length !== 0){
				var newkey = arkey.join(".");
				//console.log('newkey is:' + newkey);
				triggerAll(newkey);
				arkey.pop();

				iter(arkey);
			}
		}
	}

}
proto.getNode = function (){
	return document.querySelectorAll(this.el);
}
proto.renderDom = function (){
	var data = this.data;
	function lookup(key, obj){
		var arkey = key.split('.');
		return iter(arkey, obj);

		function iter (arkey, obj){
			if(arkey.length === 0){
				console.log('res is:' + obj);
				return obj;
			}else{
				var newobj = obj[arkey[0]];
				if (!newobj) return false;
				arkey.shift();
				//递归要有返回值，否则会返回undefined。带有返回值的函数都要这么做。注意和lisp的区别。
				return iter(arkey, newobj);
			}
		}
	}

	function replaceVal (content){
		var reg = /{{(.*)}}/;
		if (reg.exec(content)){
			var key = reg.exec(content)[1];
			var res = content.replace(reg, lookup(key, data));
			return replaceVal(res);
		}else{
			return content;
		}
	}

	function renderDom (node){
		node.innerHTML = replaceVal(node.innerHTML);
	}

	this.getNode().forEach(function(node){
		renderDom(node);
	});
}


var app = new Vue({
	el: '#app',
	data: {
		user: {
			name: 'youngwind',
			age: 25
		}
	}
});

app.renderDom();