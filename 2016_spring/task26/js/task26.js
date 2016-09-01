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
			fn.apply( target , args );
		}
	},false);
}
// 构造函数
function AirShip ( cost , recover , radius , speed  ) {
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
	AirShip.add( _g( "#task26>.planet" )[0] , this.name , this.radius , this.energe );
	// 绑定dom对象
	this.node = _g( "." + this.name )[0];
	this.nText = _g( "." + this.name + ">span" )[0];

	// 注册mediator
	Mediator.add( this );
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

		console.log( self.commond );
		// 如果run状态，直接返回
		if ( self.running ){
			console.log( "running" );
			return false;
		}

		var animate = setInterval( function (){
			self.running = true;
			if( self.energe > 0 && self.commond === "run" ){
				self.costEnerge( this.cost*1000/fps );
				self.recoverEnerge( this.recover*1000/fps );
				self.radDistance += self.radSpeed/( 1000/fps );
				// console.log( "radDistance:" + self.radDistance );
				
				// console.log( "energe:"+ self.energe );
				self.node.style.transform = "rotateZ(" + self.radDistance + "deg)";
				self.nText.innerText = self.energe + "%";
			}

			if ( self.commond === "stop" ){
				self.recoverEnerge( this.recover*1000/fps );
				if ( self.energe === 100 ){
					self.running = false;
					clearInterval( animate );
				}
			}
			
		} , 1000/fps );
	},
	stop : function(){
		this.commond = "stop";

	},
	destroy : function() {
		// 回收id
		AirShip._ids_.unshift( this.id );

		Mediator.remove( this );

		this.node.parentElement.removeChild( this.node );

		deleteObj( this );
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
	recive : function ( ) {
		var ocmd = JSON.parse( Mediator.msg );
		if ( ocmd.id === this.id ){
			this.commond = ocmd.commond;
			this.init();
		}
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

// 定义Mediator
var Mediator = {
	failRate: 0.3,
	member : [],
	msg : "",
	add : function( o ){
		this.member.push( o );
	},
	remove : function( o ){
		array_delete( this.member , o );
	},
	send : function( o ){
		this.msg = JSON.stringify(o);
		if ( Math.random() > this.failRate ? true : false )
		for( var i = 0 ; i < this.member.length ; i++ ){
			this.member[i].recive();
		}
	}
};

function send ( str ) {
	var ocmd = {
		id : str,
		commond : "",
	}
	if ( hasClass( this , "run" ) ){
		ocmd.commond = "run";
	}
	if ( hasClass( this , "stop" ) ){
		ocmd.commond = "stop";
	}
	if ( hasClass( this , "destroy" ) ){
		ocmd.commond = "destroy";
	}
	// console.log( ocmd );
	Mediator.send( ocmd );
}

eventProx( _g( "#ship1" )[0] , "click" , "btn" , send , ["0001"] );

eventProx( _g( "#ship2" )[0] , "click" , "btn" , send , ["0002"] );

_g( "#creat-ship" )[0].onclick = function(){new AirShip( 11 , 1 );};



// Mediator.send( {id:"0001",commond:"run"} );