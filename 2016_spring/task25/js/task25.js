(function(){
	

	"use strict"
	var tree = document.getElementById('task25');

	var root = tree.getElementsByClassName( 'root' )[0];

	var btn = tree.getElementsByTagName('button');

	var breadthBtn = btn[0],
		deepBtn = btn[1],
		addBtn = btn[2],
		deleteBtn = btn[3];

	var search = document.getElementById('search');

	var branchContent = document.getElementById('branchContent');

	var addWindow = document.querySelectorAll( "#task25>.window" )[0];

	var nlist = [];

	var result = [];

	var timer = 100 ;

	var run = false ;

	var breadthIndex = 0;

	var selected;

	var triggerNode = root;

	var defaultOrderFn = breadthOrder;

	function hasClass ( node , str ) {
		var reg = new RegExp( "\\s*" + str + "\\s*" );
		return reg.test( node.className );
	}

	function addClass ( node , str ) {
		if( !hasClass( node , str ) ){
			node.className += " " + str;
		}
	}

	function removeClass ( node , str ) {
		var reg = new RegExp( "\\s*" + str , "g" );
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
				// console.log(node);
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

	function bindNlist () {
		breadthIndex = 0;
		nlist = [];
		defaultOrderFn( root );
	}
	// 判断是否有子元素
	function hasChildren ( node ){
		return hasClass( node.lastElementChild , "node" );
	}

	function thisNode ( node ){
		// 优先返回root节点
		if ( hasClass( node , "root" ) ){
			return node;
		}
		// 返回还有node的节点
		if ( hasClass( node , "node" ) ){
			return node;
		}

		return thisNode( node.parentElement );
	}

	function render () {
		
		var i;
		var len = nlist.length;
		var node;
		result = [];

		for( i = 0; i < len ; i++ ){

			removeClass( nlist[i] , "find" );

			if( hasChildren( nlist[i] ) ){
				addClass( nlist[i] , "row" );
			}else{
				removeClass( nlist[i] , "row" );
			}

			if( nlist[i].getElementsByTagName( "h1" )[0].getElementsByClassName( "content" )[0] ){

				var nodeText = nlist[i].getElementsByTagName( "h1" )[0].getElementsByClassName( "content" )[0].innerText.replace( /^\s+\s+$/g , "");
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
				console.log( nlist );
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
				if( nlist[i].getElementsByTagName( "h1" )[0].getElementsByClassName( "content" )[0] ){

					var nodeText = nlist[i].getElementsByTagName( "h1" )[0].getElementsByClassName( "content" )[0].innerText.replace( /^\s+\s+$/g , "");
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
	function eventProx ( node , eventType , targetClassName , fn , args ) {
		node.addEventListener( eventType , function(){
			var event = arguments[0] || window.event;
			var target = event.target;
			if( hasClass( target , targetClassName ) ){
				fn.apply( target , args );
			}
		} , false );
	}

	function toHtml ( str ) {
		var html = "<h1><span class='content'>" + str + "</span><span class='add'></span><span class='remove'></span></h1>";
		var i =1;
		var nodeStr;
		while ( arguments[i] ){
			nodeStr = arguments[i];
			html += "<div class='node'>" + nodeStr + "</div>";
			i++;
		}
		return html;
	}

	function addTree (str) {
		if ( !root ) {
			root = document.createElement( "div" );
			root.className = "root node";
			root.innerHTML = toHtml.apply( undefined , arguments );
			tree.appendChild( root );
			bindNlist();
			render();
			triggerNode = root;
		}
	}

	function showWindow () {
		triggerNode = thisNode( this );
		removeClass( addWindow , "hidden" );
	}

	function hiddenWindow() {
		addClass( addWindow , "hidden" );
		branchContent.value = "";
	}

	function select () {
		var node = thisNode( this );
		// 点击时显示选择状态
		if( selected !== node ){

			if( selected !== undefined ){

				removeClass( selected , "select" );
			}

			addClass( node , "select" );
			selected = node;
		}
		// 点击时切换打开与关闭
		if( hasChildren(node) ){
			toggleClass( node , "closeBranch" );
		}
	}

	function addBranch ( str ) {
		console.log( str );
		var value = str || branchContent.value;
		// trim处理
		value = value.replace( /^\s*\s*$/g , "" );
		// 如果是空值就返回假值
		if ( !value ){
			return false;
		}
		// 如果不是空值
		var node = triggerNode;
		var branch = document.createElement( "div" );
		branch.className = "node";
		branch.innerHTML = toHtml( value );
		node.appendChild( branch );

		bindNlist();
		render();
		removeClass( node , "closeBranch" );

		hiddenWindow();
	}

	function deleteBranch () {
		var node = thisNode( this );
		if( node ){
			node.parentElement.removeChild( node );
		}
		bindNlist();
		render();
	}



	function init(){
		if ( !root ){
	 
			addTree( "我的电脑" , 
				toHtml( "c盘" ) , 
				toHtml( "d盘" , 
					toHtml( "软件" ) ,
					toHtml( "照片" ) ,
					toHtml( "隐藏文件夹" ,
						toHtml( "小电影" ) ) ) ,
				toHtml( "e盘" ,
					toHtml( "小电影" ,
						toHtml( "葫芦娃" ) ),
					toHtml( "大电影" ),
					toHtml( "电视剧" ),
					toHtml( "迅雷下载" ) )
				);
		}

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
		
		eventProx( addWindow , "click" , "confirm" , addBranch );

		eventProx( addWindow , "click" , "cancel" , hiddenWindow );

		eventProx( root , "click" , "content" , select );

		eventProx( root , "click" , "add" , showWindow );

		eventProx( root , "click" , "remove" , deleteBranch );


		bindNlist();
		render();
	}


	init();

}());
