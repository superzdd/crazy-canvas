let $canvas = $('#app');

// 画布基本信息
let canvasInfo = {
	stage: null, // createjs的canvas实例对象
	width: 0, // 画布的宽度，指的是画布的逻辑宽度，即屏幕宽度像素数量 * ratio（每像素包含的实际像素）
	height: 0, // 画布的高度，指的是画布的逻辑高度，即屏幕高度像素数量 * ratio（每像素包含的实际像素）
	centerX: 0, // 画布中心点x
	centerY: 0, // 画布中心点y
	distanceToCenter: 0 // 左上角到中心点的距离
}

// 构建整个三角形网格的基本信息
let paintInfo = {
	frame: 1000 / 60,
	lastRenderTime: 0,
	noiseInfo: {
		graphics: null,
		shape: null,
		width: 100
	}
}

// 鼠标坐标，x,y为在canvas中的相对坐标
let mousePosition = {
	x: 0,
	y: 0,
}

let noisePoints = [];

var canvas = document.getElementById('app');
var ctx = canvas.getContext('2d');

/**
 * 初始化canvas对象
 */
let initCanvas = function() {
	let rem = new Rem();
	let windowSizeInfo = rem.getWindowSize();
	let ratio = window.devicePixelRatio;

	// canvasInfo.stage = new createjs.Stage("app");
	createjs.Touch.enable(canvasInfo.stage); // 定义手机上可以使用手指触发mousemove等鼠标事件
	canvasInfo.width = windowSizeInfo.width * ratio;
	canvasInfo.height = windowSizeInfo.height * ratio;
	canvasInfo.centerX = canvasInfo.width / 2;
	canvasInfo.centerY = canvasInfo.height / 2;
	canvasInfo.distanceToCenter = Math.sqrt(canvasInfo.centerX * canvasInfo.centerX + canvasInfo.centerY * canvasInfo.centerY);

	$canvas.attr('width', canvasInfo.width);
	$canvas.attr('height', canvasInfo.height);
	$canvas.css({
		width: windowSizeInfo.width,
		height: windowSizeInfo.height
	});
}

let initPoints = function() {
	let width = canvasInfo.width;
	let height = canvasInfo.height;

	// let g = new createjs.Graphics();
	// let s = new createjs.Shape();

	// for (var x = 0; x < Math.ceil(width / paintInfo.noiseInfo.width); x++) {
	// 	for (var y = 0; y < Math.ceil(height / paintInfo.noiseInfo.width); y++) {
	// 		let p = new noisePoint(x, y, g);
	// 		noisePoints.push(p);
	// 	}
	// }

	var imgData = ctx.getImageData(0, 0, width, height);
	var data = imgData.data;
	for (let i = 0; i < data.length; i = i + 4) {
		let seed = Math.floor(Math.random() * 256);

		data[i] = data[i + 1] = data[i + 2] = seed;
		data[i + 3] = 255;
	}

	imgData.data = data;

	ctx.createImageData(imgData);
	// 	s.draw(ctx);
	// 
	// 	// s.cache(0,0,width,height);
	// 	paintInfo.noiseInfo.shape = s;
	// 	canvasInfo.stage.addChild(s);
}

/**
 * 黑白像素噪点
 */
let noisePoint = function(x, y, g) {
	this.x = x;
	this.y = y;
	this.g = g;
	this.render = function() {
		let seed = Math.floor(Math.random() * 256);
		let rectWidth = paintInfo.noiseInfo.width;

		g.setStrokeStyle(0);
		g.beginFill(createjs.Graphics.getRGB(seed, seed, seed));
		g.drawRect(this.x * rectWidth, this.y * rectWidth, rectWidth, rectWidth);
	};
}


let render = function() {
	let currentTime = Date.now();
	if (currentTime - paintInfo.lastRenderTime < paintInfo.frame) {
		requestAnimationFrame(render);
		return;
	}

	let stage = canvasInfo.stage;
	// stage.removeAllChildren();

	// noisePoints.forEach(e => {
	// 	e.render();
	// })
	// 
	// paintInfo.noiseInfo.shape.updateCache();
	let width = canvasInfo.width;
	let height = canvasInfo.height;
	var imgData = ctx.getImageData(0, 0, width, height);
	var data = imgData.data;
	for (let i = 0; i < data.length; i = i + 4) {
		let seed = Math.floor(Math.random() * 256);

		data[i] = data[i + 1] = data[i + 2] = seed;
		data[i + 3] = 255;
	}

	imgData.data = data;

	ctx.putImageData(imgData, 0, 0);
	// paintInfo.noiseInfo.shape.updateContext(ctx);
	// paintInfo.noiseInfo.shape.draw(ctx);
	// stage.update();

	requestAnimationFrame(render);
}

$(document).ready(function() {
	initCanvas();
	// initPoints();
	render();
});
