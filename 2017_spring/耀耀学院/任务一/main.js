// 定义元素选择函数
function $q (str, env){
    var parentEl = env || window.document;
    return parentEl.querySelectorAll(str);
}
$q.hasClass = (el, className)=>{
    // 正则表达式匹配一个单词及后面的空格。因为是用新建正则对象的方法定义，所以用两个斜杠，第一个表示转义。
    var RegClass = new RegExp('\\s*' + className + '\\s*', 'g');
    
    // 搜索结果里面是否含有指定的class
    if (RegClass.test(el.className)){
        return true;
    }else{
        return false;
    }
}
$q.addClass = (el, className)=>{
    if ($q.hasClass(el, className)){
        return;
    }else{
        el.className = el.className + " " + className;
    }
}
$q.removeClass = (el, className)=>{
    var RegClass = new RegExp('\\s*' + className + '\\s*', 'g');
    if ($q.hasClass(el, className)){
        el.className = el.className.replace(RegClass, " ");
    }
}
$q.toggleClass = (el, className)=>{
    if ($q.hasClass(el, className)){
        $q.removeClass(el, className);
    }else{
        $q.addClass(el, className);
    }
}
// 定义事件代理函数
function eventProx (el, className, eventName, handleFn, boolean){
    var iscapture = boolean ||  false;
    //判断浏览器是否支持addEventListener,并采取不同的处理流程
    if (window.addEventListener){
        el.addEventListener(eventName, (event)=>{
            // 获取事件对象
            var event = event || window.event;
            //定义触发事件的元素
            var target = event.target;
            //判断触发事件的元素是否是指定的元素。即它的className中是否含有我们指定的className
            if ($q.hasClass(target, className)){
                handleFn(event);
            }
        }, iscapture);
    }
}

// 下面开始业务逻辑代码
// 首先是数据结构的定义。我们定义一个数组。数组中的每个元素为一个包含代理元素和验证条件{el:el,Regconfirm:RegExp}。
var dataCenter = [];
var test1 = {
    el: $q('.test-1')[0],
    RegConfirm: /\w{4,16}/,
}
var test2 = {
    el: $q('.test-1')[1],
    RegConfirm: /\w{4,16}/,
}
var test3 = {
    el: $q('.test-1')[2],
    RegConfirm: /\w{4,16}/,
}

dataCenter.push(test1);
dataCenter.push(test2);
dataCenter.push(test3);

// 根据数据中心的数据为代理元素添加对应的事件
dataCenter.forEach((obj)=>{
    var proxEl = obj.el;
    console.log(proxEl);
    var className = 'btn';
    var eventName = 'click';
    var handleFn = (event)=>{
        var RegConfirm = obj.RegConfirm;
        var parentEl = event.target.parentNode;
        var confirmVal = $q('.confirm-value', parentEl)[0].value;
        var confirmTextEl = $q('.confirm-result', parentEl)[0];
        if (confirmVal === ''){
            confirmTextEl.innerText = '姓名不能为空';
            $q.removeClass(confirmTextEl, 'success');
            $q.addClass(confirmTextEl, 'error');
        }else if(RegConfirm.test(confirmVal)){
            confirmTextEl.innerText = '名称格式正确';
            $q.removeClass(confirmTextEl, 'error');
            $q.addClass(confirmTextEl, 'success');
        }else{
            confirmTextEl.innerText = '必填，长度4~16个字符';
        }
         
    };
    eventProx(proxEl, className, eventName, handleFn);
});