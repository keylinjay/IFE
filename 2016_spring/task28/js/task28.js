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

function _g ( str ) {
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

function eventProx( node , type , className , fn , args ){
	node.addEventListener( type , function(){
		var event = arguments[0] || window.event;
		var target = event.target;
		if ( hasClass( target , className ) ){
			fn.call( target , args );
		}
	},false);
}

// log函数用来在页面输出日志
function log ( str ){
	var counter = log.counter++;
	var s = "<span>" + ( counter < 10 ? "0" + counter : counter ) + ":</span>" + str;
	var node = _g( ".log" )[0];
	node.innerHTML = "<p>" + s + "</p>" + node.innerHTML;
}
log.counter = 1;

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



// 构造函数
function AirShip ( cost , recover , speed , radius  ) {
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
	AirShip.add( _g( "#task28>.planet" )[0] , this.name , this.radius , this.energe );
	// 绑定dom对象
	this.node = _g( "." + this.name )[0];
	this.nText = _g( "." + this.name + ">span" )[0];

	// 注册mediator
	BUS.add( this );
	log( "成功创造了飞船，编号为：" + this.id );
	this.send();
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
	run : function(){
		
		var self = this;

		var fps = 20;

		var cost =  self.cost*fps/1000;
		var recover =  self.recover*fps/1000;
		// 如果run状态，直接返回
		if ( self.running ){
			console.log( "running" );
			return false;
		}

		var animate = setInterval( function (){
			self.running = true;
			if( self.energe > 0 && self.commond === "run" ){
				self.costEnerge( cost-recover );
				self.radDistance += self.radSpeed/( 1000/fps );
				// console.log( "radDistance:" + self.radDistance );
				
				// console.log( "energe:"+ self.energe );
				self.node.style.transform = "rotateZ(" + self.radDistance + "deg)";
				self.nText.innerText = Math.floor( self.energe ) + "%";
				self.nText.style.width = Math.floor( self.energe )/100*50 + "px";
			}else {
				self.commond = "stop";
			}

			if ( self.commond === "stop" ){
				self.recoverEnerge( recover );
				self.nText.innerText = Math.floor( self.energe ) + "%";
				self.nText.style.width = Math.floor( self.energe )/100*50 + "px";
				if ( self.energe === 100 ){
					self.running = false;
					clearInterval( animate );
				}
			}

			if( self.commond === "destroy" ){
				clearInterval( animate );
			}
			
		} , 1000/fps );
	},
	stop : function(){
		this.commond = "stop";

	},
	destroy : function() {
		this.commond = "destroy";
		// 回收id
		AirShip._ids_.unshift( this.id );

		BUS.remove( this );

		this.node.parentElement.removeChild( this.node );

		
	},
	init : function () {
		if ( this.commond === "run" ){
			this.run();
		}
		if ( this.commond === "stop" ){
			this.stop();
		}
		if ( this.commond === "destroy" ){
			this.destroy();
		}
	},
	recive : function (	msg ) {
		var ocmd = this.Adapter( msg );
		console.log( ocmd );
		if ( ocmd.id === this.id ){
			this.commond = ocmd.commond;
			this.init();
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
			console.log( state );
			BUS.recive( state );
		},1000);
	},
}


AirShip._ids_ = [ "0001" , "0002" , "0003" , "0004" , "0005" , "0006" ];

AirShip.useId = function( id ){
	this._ids_ = array_delete( this._ids_ , id );
	// console.log(this._ids_);
};

AirShip.add = function( parent , name , radius ,str ){
	var ship = document.createElement( "div" );
	ship.className = " point ship " + name;
	ship.innerHTML = "<span style =top:-" + radius +"px>" + str + "%</span>";
	parent.appendChild( ship );
}


// 定义BUS传输介质
var BUS = {
	failRate: 0.1,
	spreadSpeed : 300,
	member : [],
	msg : "",
	add : function( o ){
		this.member.push( o );
	},
	remove : function( o ){
		array_delete( this.member , o );
	},
	deal : function( id , commond ){
		var ocmd = {
			id : id,
			commond : commond,
		}
		this.msg = JSON.stringify(ocmd);
	},
	send : function( id , commond ){
		this.Adapter( id , commond );
		console.log( "发送信息：" + this.msg );
		var self = this;
		var t = setInterval( function(){

			if ( Math.random() > self.failRate ? true : false ){
				clearInterval( t );
				log( "发送成功。" );
				for( var i = 0 ; i < self.member.length ; i++ ){
					self.member[i].recive( self.msg );
				}
			}else{
				log( "发送失败，尝试重新发送。" );
			}
		}, this.spreadSpeed );
	},
	Adapter : function( cmd ){
		this.msg = encodeInfo( cmd );
	},
	recive : function ( state ){
		DC.recive( state );
	},
};
// 定义数据处理中心，接受BUS传来的数据并转为对象储存起来
var DC = {
	state : {},
	Adapter : function( state ){
		return decodeInfo( state );
	},
	recive : function ( state ){
		var o = this.Adapter( state );
		this.state[ o.id ] = o;
		// console.log( this.state );
	},
}
// 定义行星对象，用来生成相应的HTML
var Planet = {
	ships : [],
	selectShip : {
		cost : 5,
		recover : 4,
		speed : 30,
	},
	setShip : function(){
		var cost;
		var speed;
		var recover;
		var nodecost =  _g( "input[name='cost']" );
		var noderecover = _g( "input[name='recover']" );
		var i;
		for( i = 0 ; i < nodecost.length ; i++ ){
			if ( nodecost[i].checked ){
				var value = nodecost[i].value;
				var p = value.indexOf( "," );
				speed = +value.substring( 0 , p );
				cost = +value.substring( p+1 );
			}
		}
		for( i = 0 ; i < noderecover.length ; i++ ){
			if (noderecover[i].checked ){
				recover = +noderecover[i].value;
			}
		}
		this.selectShip.cost = cost;
		this.selectShip.recover = recover;
		this.selectShip.speed = speed;
	},
	creatShip : function(){

		this.setShip();
		var ship =  new AirShip( this.selectShip.cost , this.selectShip.recover , this.selectShip.speed );
		this.ships.push( ship );
	},
	control : function(){
		var html = "";
		var btnHtml = "<button class='run btn'>run</button> <button class='stop btn'>stop</button> <button class='destroy btn'>destroy</button>";
		for ( var p in DC.state ){
			html += "<div class='Ship'" + p +">对" + p + "号飞船下达命令：" + btnHtml + "<span>剩余能源" + DC.state[p].energe + "%</span></div>"
			eventProx( _g(".control")[0] , "click" , "btn" , btnSend , p );
			log( DC.state[p].energe );
		}
		_g( ".control" )[0].innerHTML = html;
	},
	init : function(){
		eventProx( _g("#creat-ship")[0] , "click" , "btn" , function(){Planet.creatShip();} );
		var timer = setInterval( this.control , 1000 );
	},
}

// 按钮点击发送信息的事件函数
function btnSend ( id ){
	var commond;
	if ( hasClass( this , "run" ) ){
		commond = "run";
	}
	if ( hasClass( this , "stop" ) ){
		commond = "stop";
	}
	if ( hasClass( this , "destroy" ) ){
		commond = "destroy";
	}
	BUS.send( {id:id,commond:commond} );
	// Mediator.send( id , commond );
}

// console面板的拖动事件绑定
_g( ".bar" )[0].onmousedown = function (event){

	var node = _g( ".console" )[0];
	var width = node.clientWidth;
	var height = node.clientHeight;
	var dl = event.clientX - node.offsetLeft;
	console.log(dl);
	var dt = event.clientY - node.offsetTop;
	document.onmousemove = function(e){
		var left = e.clientX - dl;
		var top = e.clientY - dt;

		left = left < 0 ? 0 : left > (window.innerWidth - width) ? (window.innerWidth - width) : left;
		top = top < 0 ? 0 : top > (window.innerHeight - height) ? (window.innerHeight - height) : top;
		console.log(event.clientX);
		node.style.left = left + "px";
		node.style.top = top + "px";
	}
	_g( ".bar" )[0].onmouseup = function(e){
		document.onmousemove = null;
		// this.onmouseup = null;
	}
};

eventProx( _g( "#ship1" )[0] , "click" , "btn" , btnSend , "0001" );

eventProx( _g( "#ship2" )[0] , "click" , "btn" , btnSend , "0002" );

// _g( "#creat-ship" )[0].onclick = function(){new AirShip( 40 , 20 );};

Planet.init();


// Mediator.send( {id:"0001",commond:"run"} );