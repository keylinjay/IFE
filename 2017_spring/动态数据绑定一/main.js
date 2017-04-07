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
var Observer = function (obj){
	this.data = convertf(obj);
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