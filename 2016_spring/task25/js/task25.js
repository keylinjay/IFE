
var root = document.getElementById('task25').getElementsByClassName( 'root' )[0];

var btn = document.getElementsByTagName('button');

var breadthBtn = btn[0],
	deepBtn = btn[1],
	addBtn = btn[2],
	deleteBtn = btn[3];

var search = document.getElementById('search');

var branchContent = document.getElementById('branchContent');

var nlist = [];

var result = [];

var timer = 100 ;

var run = false ;

var breadthIndex = 0;

var selected;

function hasClass ( node , str ) {
	var reg = new RegExp( "\s*" + str + "\s*" );
	return reg.test( node.className );
}

function addClass ( node , str ) {
	if( !hasClass( node , str ) ){
		node.className += " " + str;
	}
}

function removeClass ( node , str ) {
	var reg = new RegExp( "\s*" + str + "\s*" , "g" );
	if( hasClass( node , str ) ){
		node.className = node.className.replace( reg , "" );
	}
}

function toggleClass ( node , str ){
	if( hasClass( node , str ) ){
		removeClass( node , str );
	}else {
		
		addClass( node , str );
	}
}
// 广度遍历
function breadthOrder (node) {

	if( node !== null ){
			console.log(node);
		if( hasClass( node , "node" ) ){
			nlist.push( node );
		}
		breadthOrder( node.nextElementSibling );
		// 因为node已经重新赋值，所以要重新判断node不为空或undefined
		node = nlist[breadthIndex++];
		// node不为空或undefined执行递归
		if( node ){

			breadthOrder( node.firstElementChild );
		}

	}
}
// 深度遍历
function deepOrder (node) {
	if( node !== null ){
		if( hasClass( node , "node" ) ){

			nlist.push( node );
		}
		deepOrder( node.firstElementChild );
		deepOrder( node.nextElementSibling );
		// 下面注释的方法也是可行的
		// for( var i = 0 , len = node.children.length ; i < len ; i++ ){
		// 	deepOrder( node.children[i] );
		// }
	}
}

function hasChildren ( node ){
	return hasClass( node.lastElementChild , "node" );
}

function render () {
	var i;
	var len = nlist.length;
	var node;
	result = [];
	for( i = 0; i < len ; i++ ){

		removeClass( nlist[i] , "find" );

		if( hasChildren( nlist[i] ) ){
			console.log( nlist[i] );
			addClass( nlist[i] , "row" );
		}

		if( nlist[i].getElementsByTagName( "h1" )[0] ){

			var nodeText = nlist[i].getElementsByTagName( "h1" )[0].innerText.replace( /^\s+\s+$/g , "");
			// 去掉回车符和空格
			nodeText = nodeText.replace( /[\n\s]/g , "");

			var searchValue = search.value.replace( /^\s+\s+$/g , "");

			// 如果等于查询的值则标记find类名
			if(  nodeText === searchValue ){
				// 添加find类名
				nlist[i].className += " find";
				// 将搜索结果放入数组result中
				result.push( nlist[i] );
				// 将搜索结果的父级都标记为显示
				node = nlist[i].parentElement;
				while( !hasClass( node , "root" ) ){
					removeClass( node , "closeBranch" );
					node = node.parentElement;
				}
				// 去掉根元素的类名
				removeClass( nlist[0] , "closeBranch" );
			}
		}
	}

}

function intervalRender () {
	var i = 0 ;
	var len = nlist.length ;

	run = true ;

	var t = setInterval(function(){
		// 遍历完成后取消计时器
		if( i === len ){
			run = false ;
			render();
			clearInterval( t ) ;
		}
		// 去掉上一个添加的类名
		if( nlist[i-1] ){
			removeClass( nlist[i-1] , "select" );
		}
		// 给当前元素添加类名
		if( nlist[i] ){
			// 重置类名
			removeClass( nlist[i] , "light" );
			removeClass( nlist[i] , "closeBranch" );
			addClass( nlist[i] , "select" );
			// 取得文本节点的文本并比较查询的值
			if( nlist[i].getElementsByTagName( "h1" )[0] ){

				var nodeText = nlist[i].getElementsByTagName( "h1" )[0].innerText.replace( /^\s+\s+$/g , "");
				// 去掉回车符和空格
				nodeText = nodeText.replace( /[\n\s]/g , "");

				var searchValue = search.value.replace( /^\s+\s+$/g , "");

				// 如果等于查询的值则标记find类名
				if(  nodeText === searchValue ){
					// 添加find类名
					nlist[i].className += " light";
				}
			}
		}
		// 指向下一个元素
		i++ ;
	},timer);
}
/**
 * 事件代理
 * @param  {node}   node          事件代理的node对象
 * @param  {string}   eventType     事件名称
 * @param  {string}   targetTagName 触发事件的node标签名
 * @param  {Function} fn            事件代理函数
 * @param  {Array}   args          事件代理函数的参数
 * @return {null}                 没有返回值
 */
function eventProx ( node , eventType , targetTagName , fn , args ) {
	node.addEventListener( eventType , function(){
		var event = arguments[0] || window.event;
		var target = event.target;
		if( target.tagName.toLowerCase() === targetTagName ){
			fn.apply( target , args );
		}
	} , false );
}

function select () {
	var node = this.parentElement;
	// 点击时显示选择状态
	if( selected !== node ){

		if( selected !== undefined ){

			removeClass( selected , "select" );
		}

		addClass( node , "select" );
		selected = node;
	}
	// 点击时切换打开与关闭
	if( node.firstElementChild ){
		toggleClass( node , "closeBranch" );
	}
}

function addBranch ( str ) {
	var branch = document.createElement( "div" );
	var html ="<h1>" + str + "<span class='add'></span><span class='remove'></span></h1>"
	branch.className = "node";
	branch.innerHTML = html;
	selected.appendChild( branch );
}

function deleteBranch () {
	if( selected ){

		selected.parentElement.removeChild( selected );
	}
}



function init(){
	breadthBtn.onclick = function(){
		if( run ){ return false ;}
		nlist = [];
		breadthIndex = 0;
		breadthOrder( root );
		console.log(nlist);
		intervalRender();

	};
	deepBtn.onclick = function(){
		if( run ){ return false;}
		nlist = [];
		deepOrder( root );
		console.log(nlist);
		intervalRender();

	};
	
	eventProx( root , "click" , "h1" , select );
	addBtn.onclick = function(){ 
		addBranch( branchContent.value ); 
		breadthOrder( root );
		render();
	};
	deleteBtn.onclick = deleteBranch;
	breadthOrder( root );
	render();
}


// selected = root;
// addBranch( "header1" );

init();






function Tree( node , root ){
	this.node = node;
	this.root = this.parent.root || root;
	this.selected = false;
}
Tree.prototype = {
	constructor : Tree,
	add : function ( str ) {},
	remove : function () {},
	select : function () {},
}