/**
 * aqiData.储存用户输入的空气指数数据
 */
;(function(w,u){
	function trim (str) {
		return str.replace(/^(\s*)|(\s*)$/g,"");
	}
	var aqi={
		Data:{},
		addData:function(c,v){
			var city = trim(c),
				value = trim(v);
			// 数据验证
			if(!city){
				alert("城市不能为空");
				return false;
			}
			if(!value){
				alert("空气质量不能为空");
				return false;
			}
			if(!/[a-zA-Z\u4e00-\u9fa5]+/.test(city)){
				alert("城市不是字母和字符");
				return false;
			}
			if(!/\d+/.test(value)){
				alert("空气质量不是数字");
				return false;
			}
			if(this.Data.hasOwnProperty(city)){
				if(!confirm("已经存在"+city+"是否更新该城市空气质量")){
					return false;
				}
			}
			this.Data[c]=v;
			console.log("添加数据");
		},
		renderList:function(table){
			var html="";
			for(var p in this.Data){
				console.log(this.Data.hasOwnProperty(p));
				var a=1;
				if(this.Data.hasOwnProperty(p)){
					html +=	"<tr><td>"+p+"</td><td>"+this.Data[p]+
							"</td><td><button>删除</button></td></tr>";
				}
				a++;
				if(a>5){break;}
			}
			table.innerHTML=html;
			console.log(a);
		},
		delData:function(p){
			delete this.Data[p];
		}
	};
	function faddBtn (c,v,t) {
		console.log(c.value);
		aqi.addData(c.value,v.value);
		console.log(aqi.Data);
		aqi.renderList(t);
		console.log("添加成功");
	}
	function fdelBtn (p,t) {
		aqi.delData(p);
		aqi.renderList(t);
	}
	function init () {
		var city = document.getElementById('aqi-city-input'),
			value = document.getElementById('aqi-value-input'),
			table = document.getElementById('aqi-table-body'),
			addBtn = document.getElementById('add-btn'),
			aDelBtn = table.getElementsByTagName('button');
			
		addBtn.addEventListener('click',function(){faddBtn(city,value,table);},false);
		table.addEventListener('click',function(){
			var target = event.target;
			if(target && target.tagName === 'button'.toUpperCase()){
				var pro = target.parentElement.parentElement.children[0].innerText;
				fdelBtn(pro,table);
			}
		},false);
	}
	init();
}(window));