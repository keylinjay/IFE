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
	
	// 获取Id
	this.id = AirShip._ids_[0];
	console.log( this.id );
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
	costEnerge : function(){
		this.energe -= this.cost;

		this.nText.innerText = this.energe + "%";
	},
	recoverEnerge : function(){
		this.energe += this.recover;

		this.nText.innerText = this.energe + "%";
	},
	run : function(){
		this.commond = "run";
		var self = this;
		var start = ( new Date() ).getTime();
		var fps = 20;
		// 第n秒计算一次剩余能量
		var n = 1;
		animate();
		function animate(){
			var elapsed = ( new Date() ).getTime() - start;
			// console.log( "elapsed:" + elapsed );
			

			if( self.energe > 0 && self.commond === "run" ){
				self.radDistance += self.radSpeed/( 1000/fps );
				// 经过整数秒执行一次cosntEnerge()
				if ( Math.floor( elapsed/1000 ) === n ){
					self.costEnerge();
					self.recoverEnerge();
					n++;
				}
					// console.log( "energe:"+ self.energe );

				self.node.style.transform = "rotateZ(" + self.radDistance + "deg)";
				// console.log( self.speed );
				

				setTimeout( animate , 1000/fps );
			}else {
				self.commond = "stop";
				if ( self.energe < 100 ){

					if ( self.energe < 0 ){
						self.energe = 0;
					}

					if ( self.energe > 100 ){
						self.energe = 100;
					}

					self.recoverEnerge();
					// console.log( self.energe );
					setTimeout( animate , 1000 );
				}
			}
			
		}
	},
	stop : function(){
		this.commond = "stop";

	},
	destroid : function() {
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
		if ( this.commond === "destroid" ){
			this.destroid();
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
	if ( hasClass( this , "destroid" ) ){
		ocmd.commond = "destroid";
	}
	console.log( ocmd );
	Mediator.send( ocmd );
}

eventProx( _g( "#ship1" )[0] , "click" , "btn" , send , ["0001"] );

eventProx( _g( "#ship2" )[0] , "click" , "btn" , send , ["0002"] );

_g( "#creat-ship" )[0].onclick = function(){new AirShip( 11 , 1 );};



// Mediator.send( {id:"0001",commond:"run"} );