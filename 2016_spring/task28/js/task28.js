// 基本功能函数
function array_delete ( a , v ){
	var index = a.indexOf( v );
	a.splice( index , 1 );
	return a;
}

function deleteObj ( obj ) {
	for ( var p in obj ){
		if ( obj.hasOwnProperty( p ) ){
			delete obj[p];
		}
	}
	delete obj;
}

function _g ( str , contax ) {
	if ( contax ){
		return contax.querySelectorAll( str );
	}
	return document.querySelectorAll( str );
}

function hasClass( node , str ){
	var reg = new RegExp( "\\s*\\b(" + str + ")\\b" );
	return reg.test( node.className );
}

function addClass( node , str ){
	if ( !hasClass( node ,str ) ){
		node.className += " " + str;
	}
}

function removeClass( node ,str ){
	if ( hasClass( node , str ) ){
		var reg = new RegExp( "\\s*\\b(" + str + ")\\b" , "g" );
		node.className = node.className.replace( reg , "" );
	}
}
/*
	事件代理函数
	传入的参数 node：事件代理对象，type：事件类型，className：执行事件的类名，fn：处理函数，args：处理函数的参数(数组形式)

*/
function eventProx( node , type , className , fn , args ){
	node.addEventListener( type , function(){
		var event = arguments[0] || window.event;
		var target = event.target;
		var newArgs = [ event ];
		if ( args ){
			// 将event作为第一个参数
			newArgs = newArgs.concat( args );
		}
		if ( hasClass( target , className ) ){
			console.log( newArgs );
			fn.apply( event , newArgs );
		}
	},false);
}

// log函数用来在页面输出日志
var log = function ( data ){
	// console.log( data );
	var str = data;
	if ( typeof data === "object" ){
		str = JSON.stringify( data );
		console.log(str);
	}
	var counter = log._counter++;
	var s = "<span>" + ( counter < 10 ? "0" + counter : counter ) + ":</span>" + str;
	var node = _g( ".log" )[0];
	node.innerHTML = "<p>" + s + "</p>" + node.innerHTML;
}
log._counter = 1;

// 对信息进行编码解码的函数
function encodeInfo ( ocmd ){
	var id = ocmd.id;
	var commond = ocmd.commond;
	var energe = ocmd.energe || "";
	if ( commond === "run" ){
		commond = "0001";
	}
	if ( commond === "stop" ){
		commond = "0010";
	}
	if ( commond === "destroy"){
		commond = "1100";
	}
	return id + commond + energe;
}

function decodeInfo ( msg ){
	var id = msg.substring( 0 , 4 );
	var commond = msg.substring( 4 , 8 );
	var energe = msg.substring( 8 );
	if ( commond === "0001" ){
		commond = "run";
	}
	if( commond === "0010" ){
		commond = "stop";
	}
	if ( commond === "1100" ){
		commond = "destroy";
	}
	return {id:id,commond:commond,energe:energe};
}

// 拖拽函数
var drag = function ( event , elementToDrag ){
	var scroll = {x:document.documentElement.scrollLeft,y:document.documentElement.scrollTop};
	// 初始鼠标坐标位置，转换鼠标坐标为文档坐标
	var startX = event.clientX + scroll.x;
	var startY = event.clientY + scroll.y;
	// 待拖动元素的初始位置
	var origX = elementToDrag.offsetLeft;
	var origY = elementToDrag.offsetTop;
	var width = elementToDrag.clientWidth;
	var height = elementToDrag.clientHeight;
	// 鼠标距离待拖动元素左上角的距离
	var deltaX = startX - origX;
	var deltaY = startY - origY;
	// 注册mousedown事件时的 mousemove和mouseup事件
	if ( document.addEventListener ){
		document.addEventListener( 'mousemove' , moveHandler , true );
		document.addEventListener( 'mouseup' , upHandler , true );
	}else if ( document.attachEvent ){
		// 处理ie浏览器
	}
	// 不让其他元素看到他
	if ( event.stopPropagation ){
		event.stopPropagation();
	}else {
		// 处理ie浏览器
	}
	// 阻止事件的默认操作
	if ( event.preventDefault ){
		event.preventDefault();
	}else {
		// 处理ie浏览器
	}
	// mousemove事件处理函数
	function moveHandler ( e ){
		if (!e) e = window.event;//IE模型
		var scroll = {x:document.documentElement.scrollLeft,y:document.documentElement.scrollTop};
		// 拖动后的元素位置,
		var dragX = e.clientX + scroll.x - deltaX;
		var dragY = e.clientY + scroll.y - deltaY;

		if ( dragX < 0 ){
			dragX = 0;
		}else if ( dragX > (window.innerWidth - width) ){
			dragX = window.innerWidth - width;
		}
		if ( dragY < 0 ){
			dragY = 0;
		}else if ( dragY > (window.innerHeight - height) ){
			dragY = window.innerHeight - height;
		}
		elementToDrag.style.left = dragX + "px";
		elementToDrag.style.top = dragY + "px";
		elementToDrag.style.right = 'auto';
		elementToDrag.style.bottom = 'auto';
		// 不让其他元素看到他,阻止事件传播
		if ( event.stopPropagation ){
			event.stopPropagation();
		}else {
			// 处理ie浏览器
		}
	}
	// mouseup事件
	function upHandler ( e ){
		if (!e) e = window.event;//IE模型
		// 注销事件
		if ( document.removeEventListener ){
			document.removeEventListener( 'mousemove' , moveHandler , true );
			document.removeEventListener( 'mouseup' , upHandler , true );
		}else if ( document.attachEvent ){
			// 处理ie浏览器

		}
		// 不让其他元素看到他,阻止事件传播
		if ( event.stopPropagation ){
			event.stopPropagation();
		}else {
			// 处理ie浏览器
		}
	}
}

// 飞船构造函数
function AirShip ( cost , recover , speed , radius  ) {
	if ( !AirShip._ids_[0] ){
		log( '飞船数量已达上限' );
		return;
	}
	this.cost = cost;
	this.recover = recover;
	this.commond = "stop";
	this.radDistance = 0;
	this.running = false;
	// 获取Id
	this.id = AirShip._ids_[0];
	console.log( "id:" + this.id );
	this.name = "AirShip" + this.id;
	
	this.radius = (radius && ( radius > 60 ) ) ? radius : ( 40+25*( +this.id ) );
	this.speed = speed || 100;
	this.radSpeed = this.speed/this.radius * ( 180/Math.PI );
	
	// 初始能量值
	this.energe = 100;
	
	// 从id列表中删除发出去的id
	AirShip.useId( this.id );
	// 初始化dom
	
	// 绑定dom对象
	this.node = AirShip.add( _g( "#task28>.planet" )[0] , this.name , this.radius , this.energe );
	this.nText = _g( "span" , this.node )[0];

	// 注册mediator
	
	log( "成功创造了飞船，编号为：" + this.id );

	// 开始动画
	this.animate = this.startAnimate();
	// 发送自身的状态
	
	this.send();

	// 监听planet的命令
	BUS2.listen('planet', doCommond );

	var self = this;
	function doCommond (data){
		console.log('listen succuss');
		// console.log(self.id);
		if ( self.id === data.id ){
			self.commond = data.commond;
			self.init();
		}
	}
}

AirShip.prototype = {
	constructor : AirShip,
	costEnerge : function( v ){
		if ( this.energe > v ){
			
			this.energe -= v;
		}else {
			this.energe = 0;
		}
		
	},
	recoverEnerge : function( v ){
		if ( this.energe < ( 100 - v ) ){

			this.energe += v;
		}else {
			this.energe = 100;
		}

	},
	startAnimate : function(){
		var self = this;

		var fps = 20;

		var cost =  self.cost*fps/1000;
		var recover =  self.recover*fps/1000;
		// 如果run状态，直接返回
		// if ( self.running ){
			// console.log( "running" );
		// 	return false;
		// }

		var timer = setInterval( function (){
			self.running = true;
			if( self.energe > 0 && self.commond === "run" ){
				self.costEnerge( cost-recover );
				self.radDistance += self.radSpeed/( 1000/fps );
				// console.log( "radDistance:" + self.radDistance );
				
				// console.log( "energe:"+ self.energe );
				self.node.style.transform = "rotateZ(" + self.radDistance + "deg)";
				self.nText.innerText = Math.floor( self.energe ) + "%";
				self.nText.style.width = Math.floor( self.energe )/100*50 + "px";
			}

			if ( self.energe === 0 ){
				self.commond = "stop";
			}

			if ( self.commond === "stop" ){
				self.recoverEnerge( recover );
				self.nText.innerText = Math.floor( self.energe ) + "%";
				self.nText.style.width = Math.floor( self.energe )/100*50 + "px";
				// if ( self.energe === 100 ){
				// 	self.running = false;
				// 	clearInterval( timer );
				// }
			}
			// console.log( "I'm still running!!" );
			// log( self.commond );
			if( self.commond === "destroy" ){
				// 回收id
				console.log("anim-destroy");
				AirShip._ids_.unshift( self.id );

				// BUS.remove( self );
				console.log( self.node );
				self.node.parentElement.removeChild( self.node );
				_g( ".ship" + self.id )[0].parentElement.removeChild( _g( ".ship" + self.id )[0] );
				clearInterval( timer );
			}
			
		} , 1000/fps );
		return timer;
	},
	run : function(){
		this.commond = "run";
		
	},
	stop : function(){
		this.commond = "stop";

	},
	destroy : function() {
		this.commond = "destroy";
		
	},
	init : function () {
		if ( this.commond === "run" ){
			this.run();
		}
		if ( this.commond === "stop" ){
			this.stop();
		}
		if ( this.commond === "destroy" ){
			// console.log( " start destroy" );
			this.destroy();
		}
	},
	
	Adapter : function( cmd ){
		if ( typeof cmd === "string" ){
			return decodeInfo( cmd );
		}else {
			return encodeInfo ( cmd );
		}
	},
	send : function () {
		var state;
		var self = this;
		var timer = setInterval ( function(){
			state = self.Adapter( {id:self.id , commond:self.commond , energe:Math.floor(self.energe)});
			// console.log( state );
			// BUS.recive( state );
			BUS2.send( 'state',state );
			if ( self.commond === "destroy" ){
				clearInterval( timer );
			}
		},1000);
	},
}


AirShip._ids_ = [ "0001" , "0002" , "0003" , "0004" ];

AirShip.useId = function( id ){
	this._ids_ = array_delete( this._ids_ , id );
	// console.log(this._ids_);
};

AirShip.add = function( parent , name , radius ,str ){
	var ship = document.createElement( "div" );
	ship.className = " point ship " + name;
	ship.innerHTML = "<span style =top:-" + radius +"px>" + str + "%</span>";
	parent.appendChild( ship );
	console.log( parent );
	return ship;
}


// 定义BUS传输介质
// var BUS = {
// 	failRate: 0.1,
// 	spreadSpeed : 300,
// 	member : [],
// 	msg : "",
// 	add : function( o ){
// 		this.member.push( o );
// 	},
// 	remove : function( o ){
// 		array_delete( this.member , o );
// 	},
// 	deal : function( id , commond ){
// 		var ocmd = {
// 			id : id,
// 			commond : commond,
// 		}
// 		this.msg = JSON.stringify(ocmd);
// 	},
// 	send : function( ocmd ){
// 		this.Adapter( ocmd );
// 		console.log( "发送信息：" + this.msg );
// 		var self = this;
// 		var t = setInterval( function(){

// 			if ( Math.random() > self.failRate ? true : false ){
// 				clearInterval( t );
// 				log( "发送成功。" );
// 				for( var i = 0 ; i < self.member.length ; i++ ){
// 					self.member[i].recive( self.msg );
// 				}
// 			}else{
// 				log( "发送失败，尝试重新发送。" );
// 			}
// 		}, this.spreadSpeed );
// 	},
// 	Adapter : function( cmd ){
// 		this.msg = encodeInfo( cmd );
// 	},
// 	recive : function ( state ){
// 		DC.recive( state );
// 	},
// };

// 定义升级的BUS2
var BUS2 = (function(){
	var failRate = 0.1,
		spreadSpeed = 300,
		clientList = {};
	var listen = function ( key , fn ){
		if ( !clientList[key] ){
			clientList[key] = [];
		}
		clientList[key].push( fn );
		console.log( clientList );
	};
	var send = function (){
		var args = [].slice.apply( arguments );
		var key = [].shift.apply( args );
		var fns = clientList[key];
		log( '发送消息：' );
		log( args[0] );
		if ( fns ){
			for ( var i = 0,len = fns.length; i < len ; i++ ){
				fns[i].apply( null , args );
			}
		}
	};
	return {
		listen:listen,
		send:send
	};
})();

// 定义数据处理中心，接受BUS传来的数据并转为对象储存起来
var DC = (function(){
	var state = {};
	var Adapter = function(data){
		return decodeInfo( data );
	};
	BUS2.listen('state', function(data){
		var o = Adapter( data );
		state[ o.id ] = o;
		if ( o.commond === 'destroy' ){
			console.log( 'destroied' );
			state[ o.id ] = null;
		}
		// console.log( state );
	});
	return {state:state};
})(); 

// 定义行星对象，用来生成相应的HTML
var Planet = {
	ships : {},
	selectShip : {
		cost : 5,
		recover : 4,
		speed : 30,
	},
	setShip : function(){
		var cost;
		var speed;
		var recover;
		var powerSys;
		var energeSys;
		var nodecost =  _g( "input[name='cost']" );
		var noderecover = _g( "input[name='recover']" );
		var i;
		for( i = 0 ; i < nodecost.length ; i++ ){
			if ( nodecost[i].checked ){
				var value = nodecost[i].value;
				var p = value.indexOf( "," );
				speed = +value.substring( 0 , p );
				cost = +value.substring( p+1 );
				if ( value === "30,5" ){
					powerSys = "前进号";
				}else if ( value === "50,7" ){
					powerSys = "奔腾号";
				}else if ( value === "80,9" ){
					powerSys = "超越号";
				}
			}
		}
		for( i = 0 ; i < noderecover.length ; i++ ){
			if (noderecover[i].checked ){

				recover = +noderecover[i].value;
				if ( recover === 2 ){
					energeSys = "劲量型";
				}else if ( recover === 3 ){
					energeSys = "光能型";
				}else if ( recover === 4 ){
					energeSys = "永久型";
				}

			}
		}
		this.selectShip.cost = cost;
		this.selectShip.recover = recover;
		this.selectShip.speed = speed;
		this.selectShip.powerSys = powerSys;
		this.selectShip.energeSys = energeSys;
	},
	creatShip : function(){
		var ship;
		var node;
		
		this.setShip();
		ship =  new AirShip( this.selectShip.cost , this.selectShip.recover , this.selectShip.speed );
		if ( !ship.id ){
			console.log('没有新的飞船');
			return;
		}
		this.ships[ship.id]={
			powerSys:this.selectShip.powerSys,
			energeSys:this.selectShip.energeSys,
		};
		// console.log( this.ships );

		node = document.createElement( "div" );
		node.className = "ship" + ship.id;
		node.innerHTML = "<span>对" + ship.id + "号飞船下达命令:</span><button class='run btn'>起飞吧</button> <button class='stop btn'>停下来</button> <button class='destroy btn'>拉出去续了</button>";
		eventProx( node , "click" , "btn" , btnSend , [ship.id] );
		_g( ".control" )[0].appendChild( node );
		
		function btnSend ( e , id ){
			var commond;
			if ( hasClass( e.target , "run" ) ){
				commond = "run";
			}
			if ( hasClass( e.target , "stop" ) ){
				commond = "stop";
			}
			if ( hasClass( e.target , "destroy" ) ){
				commond = "destroy";
				// _g( ".control" )[0].removeChild( this.parentElement );
			}
			// BUS.send( {id:id,commond:commond} );
			console.log('btnsend succuss');
			BUS2.send( 'planet' , {id:id,commond:commond} );
			// Mediator.send( id , commond );
		}
	},
	showState : function(){
		var node = _g( ".shipsState>table" )[0];
		var html = "<thead><tr><td>飞船</td><td>动力系统</td><td>能源系统</td><td>当前飞行状态</td><td>剩余能耗</td></tr></thead><tbody>";
		var energe;
		var commond;
		var state;
		var powerSys;
		var energeSys;
		for ( var p in DC.state ){
			if ( DC.state[p] ){
				energe = DC.state[p].energe;
				commond = DC.state[p].commond;
				// console.log( this );
				powerSys = Planet.ships[p].powerSys;
				energeSys = Planet.ships[p].energeSys;
				if ( commond === "run" 	){
					state = "飞行中";
				}else if ( commond === "stop" ){
					state = "停止飞行";
				}else {
					state = "已经自爆";
				}
				html += "<tr><td>" + p + "号<td>" + powerSys + "</td><td>" + energeSys + "</td><td>" + state + "</td><td>" + energe + "%</td></tr>";
			}
		}
		html += "</tbody>";
		// console.log( html );
		node.innerHTML = html;
		
	},
	init : function(){
		eventProx( _g("#creat-ship")[0] , "click" , "btn" , function(e){Planet.creatShip();} );
		var timer = setInterval( Planet.showState , 500 );
	},
}

// 按钮点击发送信息的事件函数


// console面板的拖动事件绑定
_g('.bar')[0].onmousedown = function(e){
	drag( e , _g('.console')[0] );
}
// _g( ".bar" )[0].onmousedown = function (event){
// 	var self = this;
// 	var node = _g( ".console" )[0];
// 	var width = node.clientWidth;
// 	var height = node.clientHeight;
// 	var dl = event.clientX - node.offsetLeft;
// 	console.log(dl);
// 	var dt = event.clientY - node.offsetTop;
// 	document.onmousemove = function(e){
// 		var left = e.clientX - dl;
// 		var top = e.clientY - dt;

// 		left = left < 0 ? 0 : left > (window.innerWidth - width) ? (window.innerWidth - width) : left;
// 		top = top < 0 ? 0 : top > (window.innerHeight - height) ? (window.innerHeight - height) : top;
// 		console.log(event.clientX);
// 		node.style.left = left + "px";
// 		node.style.top = top + "px";
// 	}
// 	_g( ".bar" )[0].onmouseup = function(e){
// 		document.onmousemove = null;
// 		this.onmouseup = null;
// 	}
// };
// _g( ".bar" )[0].onmousedown = function (event){
// 	var self = this;
// 	var node = _g( ".console" )[0];
// 	var width = node.clientWidth;
// 	var height = node.clientHeight;
// 	var dl = event.clientX - node.offsetLeft;
// 	// console.log(dl);
// 	var dt = event.clientY - node.offsetTop;
// 	document.addEventListener( 'mousemove' , moveHandler , true );
// 	document.addEventListener( 'mouseup' , upHandler , true );
// 	event.stopPropagation();
// 	event.preventDefault();

// 	function moveHandler(e){
// 		var left = e.clientX - dl;
// 		var top = e.clientY - dt;

// 		left = left < 0 ? 0 : left > (window.innerWidth - width) ? (window.innerWidth - width) : left;
// 		top = top < 0 ? 0 : top > (window.innerHeight - height) ? (window.innerHeight - height) : top;
// 		console.log(event.clientX);
// 		node.style.left = left + "px";
// 		node.style.top = top + "px";
// 		e.stopPropagation();
// 	}
// 	function upHandler(e){
// 		document.removeEventListener( 'mousemove' , moveHandler ,true );
// 		document.removeEventListener( 'mouseup' , upHandler , true );
// 		e.stopPropagation();
// 	}
// };

// eventProx( _g( "#ship1" )[0] , "click" , "btn" , btnSend , "0001" );

// eventProx( _g( "#ship2" )[0] , "click" , "btn" , btnSend , "0002" );

// _g( "#creat-ship" )[0].onclick = function(){new AirShip( 40 , 20 );};

Planet.init();


// Mediator.send( {id:"0001",commond:"run"} );