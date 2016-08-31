// 基本功能函数
function array_delete ( a , v ){
	var index = a.indexOf( v );
	return a.splice( index , 1 );
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

// 构造函数
function AirShip ( cost , recover ) {
	this.cost = cost;
	this.recover = recover;
	// 获取Id
	this.id = AirShip._ids_[0];
	this.name = "AirShip" + this.id;
	this.commond = "stop";
	// 初始能量值
	this.energe = 100;
	// 位置是角度值从0-360deg
	this.position = 0;
	// 从id列表中删除发出去的id
	AirShip.useId( this.id );

	AirShip.add( _g( "#task26>.planet" )[0] , this.name , this.energe );

	this.node = _g( "." + this.name )[0];
	this.nText = _g( "." + this.name + ">span" )[0];
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
		// 第n秒计算一次剩余能量
		var n = 1;
		animate();
		function animate(){
			var elapsed = ( new Date() ).getTime() - start;
			console.log( "elapsed:" + elapsed );

			if( self.energe > 0 && self.commond === "run" ){
				// 经过整数秒执行一次cosntEnerge()
				if ( Math.floor( elapsed/1000 ) === n ){
					self.costEnerge();
					self.recoverEnerge();
					n++;
				}
					console.log( "energe:"+ self.energe );

				self.node.style.transform = "rotateZ(" + self.position++ + "deg)";
				console.log( self.position );
				

				setTimeout( animate , 50 );
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
					console.log( self.energe );
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

		deleteObj( this );
	},

}


AirShip._ids_ = [ 1 , 2 , 3 , 4 , 5 , 6 ];

AirShip.useId = function( id ){
	this._ids_ = array_delete( this._ids_ , id );
};

AirShip.add = function( parent , name , str ){
	var ship = document.createElement( "div" );
	ship.className = " point ship " + name;
	ship.innerHTML = "<span>" + str + "%</span>";
	parent.appendChild( ship );
}

var planet1 = new AirShip( 11 , 1 );

