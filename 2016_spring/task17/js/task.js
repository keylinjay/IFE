/**
 * 数据格式演示
 * var aqiSourceData = {
 * 		"北京":{
 * 			"2016-01-01":10,
 * 			"2016-01-02":10,
 * 			"2016-01-03":10,
 * 			"2016-01-04":10
 * 		}
 * };
 */

/**
 * 将日期变成"2016-01-01"格式的字符串。
 * @param  {[Date]} dat [传入日期对象]
 * @return {[String]}     [返回日期格式的字符串]
 */
function getDateStr (dat) {
	 var y = dat.getFullYear(),
	 	 m = dat.getMonth(),
	 	 d = dat.getDate();
	 m = m < 10 ? "0" + m : m;
	 d = d < 10 ? "0" + d : d;
	 return y + '-' + m + '-' + d;
}
/**
 * 随机生成测试数据
 * @param  {num} seed 传入生成数据的幅度值
 * @return {object}      返回含有数据的对象
 */
function randomBuildData (seed) {
	 var returnData = {},
	  	 dat = new Date("2016-01-01"),
	  	 datStr = '';
	  for(var i = 0;i < 92;i++){
	  	datStr = getDateStr(dat);
	  	returnData[datStr] = Math.ceil(Math.random() * seed);
	  	dat.setDate(dat.getDate() + 1);
	  }
	  return returnData;
}
/**
 * 定义数据源
 * @type {Object}
 */
var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};
/**
 * 渲染图表的数据
 * @type {Object}
 */
var chartData = {};
/**
 * 当前页面的状态
 * @type {Object}
 */
var pageState = {
	"nowSelectCity": "北京",
	"nowGraTime": "day"
}

/**
 * 添加画布
 * @type {[node]}
 */
var dChartWrap = document.getElementsByClassName('aqi-chart-wrap')[0],
	dCanvasChart = document.getElementById('showChart'),
	dCanvasTip = document.getElementById('showTip');
dCanvasChart.width = dCanvasTip.width = dChartWrap.clientWidth;
dCanvasChart.height = dCanvasTip.height = dChartWrap.clientHeight;

/**
 * 定义2d绘图对象
 * @type {[CanvasRenderingContext2D]}
 */
var	ctx = dCanvasChart.getContext('2d');
	
/**
 * 定义渲染图形的坐标范围
 * @type {Object}
 */
var showRect={};
/**
 * 渲染图表
 * @return {[type]} [description]
 */
function renderChart () {
	var data = chartData[pageState.nowSelectCity][pageState.nowGraTime],
		l = Object.getOwnPropertyNames(data).length;
	showRect={};
	var	endY = dChartWrap.clientHeight,
		eachWidth = Math.floor(dCanvasChart.width/l),
		starX = Math.ceil((dCanvasChart.width - eachWidth*l)/2)+eachWidth/4;
	ctx.clearRect(0, 0, dCanvasChart.width, dCanvasChart.height);

	 for(var key in data){
	 	ctx.fillStyle = "#" + (Math.random()*0x1).toString(16).slice(-6);
	 	if(data.hasOwnProperty(key)){
	 		showRect[key]={
	 			'starX':starX+dCanvasChart.offsetParent.offsetLeft,
	 			'starY':endY-data[key]+dCanvasChart.offsetParent.offsetTop,
	 			'endX':starX+eachWidth/2+dCanvasChart.offsetParent.offsetLeft,
	 			'endY':endY+dCanvasChart.offsetParent.offsetTop
	 		}
	 		ctx.fillRect(starX,endY,eachWidth/2,-data[key]);
	 		starX += eachWidth;
	 	}
	 }
}

var tipData={
	'date':"",
	'value':""
};
function tipChange (d,v) {
	if(!(tipData['date']===d&&tipData['value']===v)){
		tipData['date']=d;
		tipData['value']=v;
		renderTip ();
	}
}
function renderTip () {
	var	ctxTips = dCanvasTip.getContext('2d');
	var starX,starY;
	ctxTips.clearRect(0, 0, dCanvasTip.width, dCanvasTip.height);
	ctxTips.fillStyle = '#333333';
	ctxTips.font = '20px Arial';
	starX=dCanvasTip.width/2-50;
	starY=100;
	ctxTips.fillText(tipData['date'],starX,starY-50);
	ctxTips.fillText(tipData['value'],starX,starY-20);
}

function cityChange (v) {
	if(pageState["nowSelectCity"] != v){
		pageState["nowSelectCity"] = v;
		renderChart();
	}
}

function graTimeChange (v) {
	if(pageState["nowGraTime"] !== v){
		pageState["nowGraTime"] = v;
		renderChart();
	}
}

function initGraTime () {
	var radio = document.getElementById('form-gra-time');
	radio.addEventListener('change',function () {
	 	var event =window.event,
	  		target = event.target;
	 	if(target.tagName.toLowerCase()==="input"){
			graTimeChange(target.value);
		}
	},false);
}

function initSelCity () {
	var select = document.getElementById('city-select');
	select.addEventListener('change',function () {
	 	var event =window.event,
	  		target = event.target;
	  	// 注意这里触发的是select
	 	if(target.tagName.toLowerCase()==="select"){
			cityChange(target.value);
		}
	},false);
}

function initShowTip () {
	dChartWrap.addEventListener('mousemove',function () {
		var event = arguments[0] || window.event,
		target = event.target,
		x = event.clientX,
		y = event.clientY,
		flag = 1;
		data = chartData[pageState.nowSelectCity][pageState.nowGraTime];
	  	for(var key in showRect){
	  		if(x>=showRect[key]['starX']&&x<=showRect[key]['endX']
	  			&&y>=showRect[key]['starY']&&y<=showRect[key]['endY']){
	  			tipChange(key,data[key]);
	  			flag =0;
	  		}
	  	}
	  	if(flag){tipChange("","");};
	} ,false);
}

function dataToDay (sourceData) {
	var Mdata = {},
		m;
		
	for(var  key in sourceData){
		// 月份是从0开始表示1月份的，所以要做+1处理
		m = +key.substr(5,2)+1;
		m = m<10?'0'+m:m;
		Mdata[key.replace(/\-\d{2}\-/,'-'+m+'-')]=sourceData[key];
	}
	return Mdata;
}

function dataToWeek (sourceData) {
	var Mdata = {},
		sum = 0,d = 0,w = 0,i=0,
		totleDay = Object.getOwnPropertyNames(sourceData).length;
	for(var  key in sourceData){
		i++;
		++d;
		sum += sourceData[key];
		if(d%7 === 0 || i===totleDay){
			w++;
			Mdata["第"+w+"周"] = Math.ceil(sum/d);
			d = 0;
			sum = 0;
		}
		
	}
	return Mdata;
}

function dataToMonth (sourceData) {
	var Mdata = {},
		sum = 0,d = 0,m=1;
	for(var  key in sourceData){
		// 月份是从0开始表示1月份的，所以要做+1处理
		if(+m === +key.substr(5,2)+1){
			++d;
			sum += sourceData[key];
		}else{
			Mdata[m+"月份"] = Math.ceil(sum/d);
			d=0;
			sum=sourceData[key];
			m++;
		}	
	}
	return Mdata;
}

function initAqiChartData () {
	for(var key in aqiSourceData){
		chartData[key]={
			'day' :dataToDay(aqiSourceData[key]),
			'week':dataToWeek(aqiSourceData[key]),
			'month':dataToMonth(aqiSourceData[key])
		}
	}
}

function init () {
	initGraTime();
	initSelCity();
	initAqiChartData();
	renderChart();
	initShowTip();
}

init();



