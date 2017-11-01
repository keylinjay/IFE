

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
					//trigger(listener, key, [val]);
				}
			});
		}

		for (var key in obj){
			if (obj.hasOwnProperty(key)){
				if (typeof obj[key] === "object"){
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
	var index = listener.indexOf(key);
	if (index !== -1){
		if (fn){
			triggerFn(key, fn);
		}else{
			triggerAll(key);
		}
	}
	function triggerFn (key, fn){
		if (listener[key].indexOf(fn) !== -1){
			fn.apply(fn, args);
		}
	}
	function triggerAll (key){
		listener[key].forEach(
			function(fn){
				fn.apply(fn, args);
			});
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
var data1 = {
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