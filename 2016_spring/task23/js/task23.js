
var root = document.getElementById('task23').firstElementChild;

var btn = document.getElementsByTagName('button');

var prebtn = btn[0],
	middlebtn = btn[1],
	postbtn = btn[2];

var search = document.getElementById('search');

var nlist = [];

var timer = 300 ;

var run = false ;

var breadthIndex = 0;
// 广度遍历
function breadthOrder (node) {
	if( node !== null ){
		var nextNode = node.nextElementSibling;
		nlist.push( node );
		breadthOrder( node.nextElementSibling );
		node = nlist[breadthIndex++];
		breadthOrder( node.firstElementChild );
	}
}
// 深度遍历
function deepOrder (node) {
	if( node !== null ){
		nlist.push( node );
		deepOrder( node.firstElementChild );
		deepOrder( node.nextElementSibling );
		// 下面注释的方法也是可行的
		// for( var i = 0 , len = node.children.length ; i < len ; i++ ){
		// 	deepOrder( node.children[i] );
		// }
	}
}


function render () {
	var i = 0 ;
	var len = nlist.length ;

	run = true ;

	var t = setInterval(function(){
		// 遍历完成后取消计时器
		if( i === len ){
			run = false ;
			clearInterval( t ) ;
		}
		// 去掉上一个添加的类名
		if( nlist[i-1] ){
			nlist[i-1].className = nlist[i-1].className.replace( /\s*select/g , "" ) ;
		}
		// 给当前元素添加类名
		if( nlist[i] ){
			// 重置类名
			nlist[i].className = "select" ;

			// 取得文本节点的文本并比较查询的值
			if( nlist[i].firstChild.nodeType === 3){

				var nodeText = nlist[i].firstChild.nodeValue.replace( /^\s+\s+$/g , "");
				// 去掉回车符和空格
				nodeText = nodeText.replace( /[\n\s]/g , "");

				var searchValue = search.value.replace( /^\s+\s+$/g , "");

				// 如果等于查询的值则标记find类名
				if(  nodeText === searchValue ){
					// 添加find类名
					nlist[i].className += " find";
				}
			}
		}
		// 指向下一个元素
		i++ ;
	},timer);
}


prebtn.onclick = function(){
	if( run ){ return false ;}
	nlist = [] ;
	breadthOrder( root ) ;
	console.log(nlist);
	render() ;
};
middlebtn.onclick = function(){
	if( run ){ return false ;}
	nlist = [] ;
	deepOrder( root ) ;
	console.log(nlist);
	render() ;
}
