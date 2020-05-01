/**
 * 小球类，实现小球的逐帧运动
 * @param {int} x 圆心的x坐标(px) 圆心坐标(0,0)为屏幕左上角
 * @param {int} y 圆心的y坐标(px) 圆心坐标(0,0)为屏幕左上角
 * @param {int} rad 半径
 * @param {int} s_x 水平方向移动速度(px/帧)
 * @param {int} s_y 垂直方向移动速度(px/帧)
 * @param {object} winSize 屏幕尺寸
 * @param {int} winSize.width 屏幕宽度
 * @param {int} winSize.height 屏幕高度
 */
let ball = function(x = 0, y = 0, rad, s_x = 1, s_y = 1) {
	let random255 = function() {
		return Math.floor(Math.random() * 256);
	}

	// 修正x和y,以防出生点位于屏幕内部，导致圆会在边缘里反复弹跳出不来的情况
	if (x < rad) {
		x = rad;
	} else if ((x + rad) > canvasInfo.width) {
		x = canvasInfo.width - rad;
	}

	if (y < rad) {
		y = rad;
	} else if ((y + rad) > canvasInfo.height) {
		y = canvasInfo.height - rad;
	}

	this.org_x = x; // 初始圆心横坐标
	this.org_y = y; // 初始圆心纵坐标
	this.org_x_percent = x / canvasInfo.width;
	this.org_y_percent = y / canvasInfo.height;
	this.rad = rad; // 半径
	this.d_x = 0; // 水平方向运动距离
	this.d_y = 0; // 垂直方向运动距离
	this.s_x = s_x; // 水平方向运动速度
	this.s_y = s_y; // 垂直方向运动速度
	this.color = `rgba(${random255()},${random255()},${random255()},0.5)`; //颜色
	this.life = 10000;
	this.born = Date.now();
	this.needDestory = false;

	/**
	 * 小球逐帧运动
	 * @param {object} winSize 屏幕尺寸
	 * @param {int} winSize.width 屏幕宽度
	 * @param {int} winSize.height 屏幕高度
	 */
	this.render = function() {
		// if (this.needDestory || (Date.now() - this.born > this.life)) {
		// 	this.needDestory = true;
		// 	$ball.remove();
		// }

		this.d_x += this.s_x;
		this.d_y += this.s_y;

		// 碰撞检测
		// 如果球触碰到了屏幕边缘，对应方向速度取反
		// 获取当前圆心坐标
		let act_x = this.org_x + this.d_x;
		let act_y = this.org_y + this.d_y;

		if ((act_x - this.rad <= 0) || (act_x + this.rad >= canvasInfo.width)) {
			this.s_x *= -1;
		}

		if ((act_y - this.rad <= 0) || (act_y + this.rad >= canvasInfo.height)) {
			this.s_y *= -1;
		}

		let ctx = canvasInfo.ctx;
		ctx.beginPath();
		ctx.arc(act_x, act_y, this.rad, 0, 2 * Math.PI, true);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	this.updateWinSize = function(winSize) {
		this.winSize = winSize;
		this.org_x = winSize.width * this.org_x_percent;
		this.org_y = winSize.height * this.org_x_percent;
	}
}

// 画布基本信息
let canvasInfo = {
	ctx: null, // canvas的实例对象
	stage: null, // createjs的canvas实例对象
	width: 0, // 画布的宽度，指的是画布的逻辑宽度，即屏幕宽度像素数量 * ratio（每像素包含的实际像素）
	height: 0, // 画布的高度，指的是画布的逻辑高度，即屏幕高度像素数量 * ratio（每像素包含的实际像素）
	centerX: 0, // 画布中心点x
	centerY: 0, // 画布中心点y
	distanceToCenter: 0 // 左上角到中心点的距离
}

let rem = new Rem();
rem.getWindowSize();

/**
 * 初始化canvas对象
 */
let initCanvas = function($canvas) {
	canvasInfo.ctx = $canvas[0].getContext('2d');
	updateCanvas($canvas);
}

let updateCanvas = function($canvas) {
	let rem = new Rem();
	let windowSizeInfo = rem.getWindowSize();
	let ratio = window.devicePixelRatio;

	canvasInfo.width = windowSizeInfo.width * ratio;
	canvasInfo.height = canvasInfo.width * 0.6;
	canvasInfo.centerX = canvasInfo.width / 2;
	canvasInfo.centerY = canvasInfo.height / 2;
	canvasInfo.distanceToCenter = Math.sqrt(canvasInfo.centerX * canvasInfo.centerX + canvasInfo.centerY * canvasInfo.centerY);

	$canvas.attr('width', canvasInfo.width);
	$canvas.attr('height', canvasInfo.height);

	let cssWidth = windowSizeInfo.width * 0.8;
	let cssHeight = cssWidth * 0.6;

	$canvas.css({
		width: cssWidth,
		height: cssHeight,
		left: (windowSizeInfo.width - cssWidth) / 2,
		top: (windowSizeInfo.height - cssHeight) / 2,
	});
}

let appData = {
	lastRenderTime: 0,
	renderInterval: 1000 / 120,
}

let appView = {
	$canvas: $('#app'),
	ballList: [],
	init: function() {
		initCanvas(appView.$canvas);

		for (let i = 0; i < 80; i++) {
			let clientX = Math.random() * canvasInfo.width * 0.8;
			let clientY = Math.random() * canvasInfo.height * 0.8;
			appView.createNewBall({
				clientX,
				clientY
			});
		}

		appView.startRender();

		$(window).resize(function() {
			rem.getWindowSize();
			updateCanvas(appView.$canvas);
			appView.updateBalls();
		});
	},
	createNewBall: function(e) {
		let x = e.clientX;
		let y = e.clientY;
		let s_x = 5 - Math.random() * 10;
		if (s_x <= 1 && s_x >= -1) {
			s_x = s_x > 0 ? 1 : -1;
		}
		let s_y = 5 - Math.random() * 10;
		if (s_y <= 1 && s_y >= -1) {
			s_y = s_y > 0 ? 1 : -1;
		}
		let b = new ball(x, y, Math.floor(Math.random() * 20) + 20, s_x, s_y);
		appView.ballList.push(b);
	},
	startRender: function() {
		let now = Date.now();
		if (now - appData.lastRenderTime >= appData.renderInterval) {
			appData.lastRenderTime = now;
			canvasInfo.ctx.clearRect(0, 0, canvasInfo.width, canvasInfo.height);
			for (let i = 0; i < appView.ballList.length; i++) {
				let ball = appView.ballList[i];
				if (ball.needDestory) {
					appView.ballList.splice(i, 1);
					i--;
					continue;
				} else {
					ball.render();
				}
			}
		}
		requestAnimationFrame(appView.startRender);
	},
	updateBalls: function(winSize) {
		for (let i = 0; i < appView.ballList.length; i++) {
			appView.ballList[i].updateWinSize(rem);
		}
	},
	updateCanvas: function() {
		let winSize = rem;
		appView.$canvas.css({
			width: winSize.width,
			height: winSize.height
		});
	}
}

$(document).ready(function() {
	appView.init();
})
