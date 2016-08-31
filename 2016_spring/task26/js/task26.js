
function Planet ( name , node ) {
	this.name = name;
	this.dom = node;
	this.energe = 100;
	this.position = 0;
}

Planet.prototype = {
	constructor : Planet,

	run : function(){
		Planet.costEnerge();
	},
	stop : function(){
		Planet.recoverEnerge();
	},

}

Planet.costEnerge = function( energe ){

}

Planet.recoverEnerge = function( energe ){

}