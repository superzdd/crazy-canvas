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
		// return Math.floor(Math.random() * 256);
		return 255;
	}

	this.id = id();
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
	this.life = 800;
	this.born = Date.now();
	this.needDestory = false;

	this.refresh = function(x = 0, y = 0, rad, s_x = 1, s_y = 1) {
		this.org_x = x; // 初始圆心横坐标
		this.org_y = y; // 初始圆心纵坐标
		this.org_x_percent = x / canvasInfo.width;
		this.org_y_percent = y / canvasInfo.height;
		this.rad = rad; // 半径
		this.d_x = 0; // 水平方向运动距离
		this.d_y = 0; // 垂直方向运动距离
		this.s_x = s_x; // 水平方向运动速度
		this.s_y = s_y; // 垂直方向运动速度
		this.born = Date.now();
		this.needDestory = false;
	}

	/**
	 * 小球逐帧运动
	 * @param {object} winSize 屏幕尺寸
	 * @param {int} winSize.width 屏幕宽度
	 * @param {int} winSize.height 屏幕高度
	 */
	this.render = function(now) {
		if (this.needDestory || (now - this.born > this.life)) {
			this.needDestory = true;
			return;
		}

		let deltaT = (now - this.born) / 1000;
		let act_x = this.org_x + this.s_x * deltaT;
		let act_y = this.org_y + this.s_y * deltaT + 0.5 * appData.g * deltaT * deltaT;

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
	distanceToCenter: 0, // 左上角到中心点的距离
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

	canvasInfo.width = windowSizeInfo.width * ratio * 0.9;
	canvasInfo.height = windowSizeInfo.height * ratio * 0.9;
	canvasInfo.centerX = canvasInfo.width / 2;
	canvasInfo.centerY = canvasInfo.height / 2;
	canvasInfo.distanceToCenter = Math.sqrt(canvasInfo.centerX * canvasInfo.centerX + canvasInfo.centerY * canvasInfo.centerY);

	$canvas.attr('width', canvasInfo.width);
	$canvas.attr('height', canvasInfo.height);

	let cssWidth = windowSizeInfo.width * 0.9;
	let cssHeight = windowSizeInfo.height * 0.9;

	$canvas.css({
		width: cssWidth,
		height: cssHeight,
		left: (windowSizeInfo.width - cssWidth) / 2,
		top: (windowSizeInfo.height - cssHeight) / 2,
	});
}

let id = function() {
	return Math.random().toString(36).substr(3) + Date.now().toString(36);
}

let rect = function(
	x = 0,
	y = 0,
	w = canvasInfo.width,
	h = canvasInfo.height,
	color = '#000000'
) {
	let {
		ctx
	} = canvasInfo;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
};

let line = function(p1, p2, lineWidth, alpha, color = [255, 255, 255]) {
	let {
		ctx
	} = canvasInfo;
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.stroke();
}

let distance = function(p1, p2) {
	return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

let appData = {
	lastRenderTime: 0,
	renderInterval: 1000 / 20,
	totalDots: 100, // 总共点的数量
	dotRadius: 2,
	progress: {
		defaultWidth: 1000,
		defaultStep: 1,
		width: 0,
		height: 80,
		left: 0,
		top: 0,
		val: 0,
		step: 1,
		bg: '#333333',
		minHue: 0,
		maxHue: 90,
		intLock100: null,
	},
	dotSpeedBasicX: 600, // 点基准速度 px/s
	dotSpeedBasicY: 500, // 点基准速度 px/s
	g: 1000, // 重力加速度 px/s2
}

let appView = {
	$canvas: $('#app'),
	ballList: [],
	restBallList: [],
	mouseBall: null,
	init: function() {
		initCanvas(appView.$canvas);

		// 初始化进度条
		appData.progress.width = Math.min(appData.progress.defaultWidth, canvasInfo.width);
		appData.progress.left = (canvasInfo.width - appData.progress.width) / 2;
		appData.progress.top = (canvasInfo.height - appData.progress.height) / 2;

		appView.startRender();

		appView.$canvas.on('mousemove', (e) => {
			const ratio = window.devicePixelRatio;
			let {
				offsetX,
				offsetY
			} = e;
		});

		$(window).resize(function() {
			rem.getWindowSize();
			updateCanvas(appView.$canvas);
			appView.updateBalls();
		});
	},
	createNewBall: function(x, y, step) {
		let increase = 80 * step;
		let s_x = (Math.random() * (appData.dotSpeedBasicX + increase) * -1).toFixed(2);
		let s_y = (Math.random() * (appData.dotSpeedBasicY + increase) * -1).toFixed(2);
		let rad = (appData.dotRadius * Math.random()).toFixed(2) + 1;

		let b = null;
		if (appView.restBallList.length > 0) {
			b = appView.restBallList.shift();
			b.refresh(x, y, rad, s_x, s_y);
		} else {
			b = new ball(x, y, rad, s_x, s_y);
		}
		appView.ballList.push(b);
		return b;
	},
	startRender: function() {
		let now = Date.now();
		if (now - appData.lastRenderTime >= appData.renderInterval) {
			const {
				ctx
			} = canvasInfo;
			appData.lastRenderTime = now;
			ctx.clearRect(0, 0, canvasInfo.width, canvasInfo.height);
			rect();

			let progress = appData.progress;
			rect(progress.left, progress.top, progress.width, progress.height, progress.bg);

			let currentProgress = progress.val / 100 * progress.width;

			let hue = progress.minHue + (progress.maxHue - progress.minHue) * progress.val / 100;
			let color = `hsla(${hue},100%,40%,1)`;
			ctx.fillStyle = color;
			ctx.fillRect(progress.left, progress.top, currentProgress, progress.height);

			var gradient = ctx.createLinearGradient(progress.left, progress.top, progress.left + progress.width, progress.top);
			gradient.addColorStop(0, "transparent");
			gradient.addColorStop(1, "rgba(0,0,0,0.7)");
			ctx.fillStyle = gradient;
			ctx.fillRect(progress.left, progress.top, currentProgress, progress.height);

			progress.val += progress.step;
			if (progress.val > 100) {
				progress.val = 100;
				if (!progress.intLock100) {
					let step = progress.step;
					progress.step = 0;
					progress.intLock100 = setTimeout(() => {
						progress.val = 0;
						progress.step = step * 2;
						if (progress.step > 8) {
							progress.step = progress.defaultStep;
						}
						clearTimeout(progress.intLock100);
						progress.intLock100 = null;
					}, 2000);
				}
			}

			ctx.font = '25px arial';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'left';
			ctx.fillText(`加载倍率：${progress.step}倍速`, progress.left, progress.top - 100);

			ctx.font = '50px arial';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.fillText(Math.round(progress.val) + '%', canvasInfo.width / 2, progress.top + progress.height + 100);

			const x = progress.left + currentProgress - 5;
			const y = progress.top;
			for (let i = 0; i < Math.round(5 * progress.step); i++) {
				let ball = appView.createNewBall(x, y, progress.step);
			}

			for (let i = 0; i < appView.ballList.length; i++) {
				let ball = appView.ballList[i];
				if (ball.needDestory) {
					appView.ballList.shift();
					appView.restBallList.push(ball);
					i--;
				} else {
					ball.color = color;
					ball.render(now);
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
