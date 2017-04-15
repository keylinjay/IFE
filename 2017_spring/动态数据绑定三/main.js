

var Observer = function (obj){
	this.data = obj;
	this.listener = [];
	
	this.convertf(obj);
}
// 定义对象转换的方法。
Observer.prototype.convertf = function (obj){
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
Observer.prototype.$watch = function (key, fn){
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
Observer.prototype.$trigger = function (listener, key, args, fn){
	
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

var data = {
	arr: [9, 2, 3, 4, 5],
	name: 'xiao gang',
	age: 24,
	address: {
		city: 'beijing'
	}
};

var app1 = new Observer(data);
app1.$watch('age', function(age){
	console.log('我年纪变了，现在已经是：' + age + '岁了');
});

var app2 = new Observer({
	name: {
		o:{
			o: {
				name: '123'
			}
		},
		firstName: 'shaofeng',
		lastName: 'liang'
	},
	age: 25
});

app2.$watch('name', function(newName){
	console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。');
});

app2.data.name.firstName = 'hahaha';
app2.data.name.o.o.name = '123456';