
var root = document.getElementById('task21');

var btn = document.getElementsByTagName('button');

var prebtn = btn[0],
	middlebtn = btn[1],
	postbtn = btn[2];

var search = document.getElementById('search');

var nlist = [];

var timer = 300 ;

var run = false ;

function preOrder (node) {
	if( node !== null ){
		nlist.push( node ) ;
		preOrder( node.firstElementChild ) ;
		preOrder( node.lastElementChild ) ;
	}
}

function middleOrder (node) {
	if( node !== null ){
		middleOrder( node.firstElementChild ) ;
		nlist.push( node ) ;
		middleOrder( node.lastElementChild ) ;
	}
}

function postOrder (node) {
	if( node !== null ){
		postOrder( node.firstElementChild );
		postOrder( node.lastElementChild );
		nlist.push( node );
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
			nlist[i-1].className = nlist[i-1].className.replace( /^\s*select/g , "" ) ;
		}
		// 给当前元素添加类名
		if( nlist[i] ){
			nlist[i].className = "select" ;

			// 取得文本节点的文本并比较查询的值
			if( nlist[i].firstChild.nodeType === 3){

				var nodeText = nlist[i].firstChild.nodeValue.replace( /^\s+\s+$/g , "");
				nodeText.replace( /[^\w\d]/g , "");

				var searchValue = search.value.replace( /^\s+\s+$/g , "");

				console.log(nodeText +":"+ searchValue);
				// 如果等于查询的值则标记find类名
				if(  nodeText === searchValue ){
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
	preOrder( root ) ;
	render() ;
};
middlebtn.onclick = function(){
	if( run ){ return false ;}
	nlist = [] ;
	middleOrder( root ) ;
	render() ;
}
postbtn.onclick = function(){
	if( run ){ return false ;}
	nlist = [] ;
	postOrder( root ) ;
	render() ;
}