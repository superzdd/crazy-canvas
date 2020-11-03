function getRandom(min, max) {
	let ret = Math.ceil(((Math.random() * (max - min)) + min) * 100) / 100;
	return ret;
}

function getColor() {
	let r = getRandom(0, 255);
	let g = getRandom(0, 255);
	let b = getRandom(0, 255);

	r = 255;
	g = 0;
	b = 0;

	// return `rgb(${r},${g},${b})`;
	return [r, g, b];
}

function easeInOutCubic(nor) {
	if ((nor /= 0.5) < 1)
		return 0.5 * Math.pow(nor, 3);
	else
		return 0.5 * (Math.pow((nor - 2), 3) + 2);
}

function lerp_easeInOutCubic(normal, min, max) {
	normal = easeInOutCubic(normal);
	return min + (max - min) * normal;
}

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
let ball = function(born, dest, rad = 5, winSize) {
	this.rad = rad; // 半径
	this.life = 10000;
	this.org_born = {
		x: born.x,
		y: born.y
	};

	this.org_dest = {
		x: dest.x,
		y: dest.y
	};

	this.born = Object.assign({}, born);
	this.dest = Object.assign({}, dest);
	this.act = {
		x: born.x,
		y: born.y
	};
	this.speed = {
		x: 0,
		y: 0
	};
	this.needDestory = false;
	this.color = getColor();
	this.ended = false;
	this.isReverse = false; // 正在从终点返回起点
	this.init = function() {
		this.refresh(this.dest);
	}

	this.refresh = function(dest) {
		this.ended = false;
		this.dest = Object.assign({}, dest);
		const duration = 1 * 60; // 60fps
		this.speed = {
			x: ((dest.x - this.act.x) / duration),
			y: ((dest.y - this.act.y) / duration)
		}
		console.log(
			`refresh success, born: ${JSON.stringify(this.born)}, dest: ${JSON.stringify(this.dest)}, speed: ${JSON.stringify(this.speed)}`
		);
	}

	/**
	 * 小球逐帧运动
	 * @param {object} winSize 屏幕尺寸
	 * @param {int} winSize.width 屏幕宽度
	 * @param {int} winSize.height 屏幕高度
	 */
	this.render = function() {
		if (this.ended) {
			return this.isReverse ? this.born : this.dest;
		}

		if (!this.ended && !this.isReverse && this.reachEnd()) {
			this.fixEnd();
			this.ended = true;
			this.endedTime = Date.now();
		} else if (!this.ended && this.isReverse && this.reachOrg()) {
			this.fixOrg();
			this.ended = true;
			this.endedTime = Date.now();
		} else {
			this.act.x = this.act.x + this.speed.x;
			this.act.y = this.act.y + this.speed.y;
		}

		return this.act;
	};

	this.fixEnd = function() {
		this.act = this.dest;
	}

	this.fixOrg = function() {
		this.act = this.dest;
	}

	this.reachEnd = function() {
		const {
			x,
			y
		} = this.act;
		const {
			x: s_x,
			y: s_y
		} = this.speed;
		const {
			x: d_x,
			y: d_y
		} = this.dest;

		return ((s_x >= 0 && x >= d_x) || (s_x <= 0 && x <= d_x)) &&
			((s_y >= 0 && y >= d_y) || (s_y <= 0 && y <= d_y))
	};

	this.reachOrg = function(act_x, act_y) {
		const {
			x,
			y
		} = this.act;
		const {
			x: s_x,
			y: s_y
		} = this.speed;
		const {
			x: b_x,
			y: b_y
		} = this.born;

		return ((s_x >= 0 && x >= b_x) || (s_x <= 0 && x <= b_x)) &&
			((s_y >= 0 && y >= b_y) || (s_y <= 0 && y <= b_y))
	};

	this.reverse = function(r) {
		if (r) {
			this.refresh(this.born);
		} else {
			this.refresh(this.org_dest);
		}
		console.log(`reverse success ${JSON.stringify(this.speed)}`);
		this.isReverse = r;
	}

	this.forceEnded = function() {
		this.ended = true;
	}

	let b = this;
	b.init();
};

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

let appData = {
	screenWidth: Math.floor(rem.width * 0.9),
	screenHeight: Math.floor(rem.height * 0.9),
	xOffset: 0,
	yOffset: 0,
	inc: 0.01,
	count: 0,
	frameCount: 0,
	listTexts: [],
	listTextIdx: 0,
	listDots: [],
	maxDotsCount: 200,
	dotsEndedDuration: 2000, // 点点到达终点后的静止时间
	dotsEndedTime: null, // 点点静止时间
	dotsInReverseAnimation: false,
	init: function() {
		this.xOffset = Math.ceil(this.screenWidth / 2);
		this.yOffset = Math.ceil(this.screenHeight / 2);
	},
	texts: ['一', '三', '五']
}

let appView = {
	init: function() {
		appData.init();
	},
	drawText: function(a) {
		const {
			screenWidth,
			screenHeight
		} = appData;
		background(0);
		textSize(500);
		textAlign(CENTER, CENTER);
		fill(255);
		text(a, screenWidth / 2, screenHeight / 2);
	},
	recordText: function() {
		let arr = [];
		loadPixels();
		const {
			screenWidth: width,
			screenHeight: height
		} = appData;

		let step = 10;

		for (let y = 0; y < height; y += step) {
			for (let x = 0; x < width; x += step) {
				let i = y * width * 4 + x * 4;
				if (pixels[i] == 255 && pixels[i + 1] == 255 && pixels[i + 2] == 255) {
					arr.push({
						x,
						y
					});
				}
			}
		}

		console.log(`前十个点位置:`);
		for (let i = 0; i < 10; i++) {
			console.log(arr[i]);
		}
		return arr;
	},
	initAllDots: function(arr) {
		const {
			screenWidth,
			screenHeight,
			maxDotsCount
		} = appData;

		let retList = [];
		let step = 1;

		for (let i = 0; i < maxDotsCount; i++) {
			const r = 5;
			const born = {
				x: getRandom(0, screenWidth),
				y: getRandom(0, screenHeight)
			};


			let dest = null;
			if (i < arr.length) {
				dest = arr[i];
			} else {
				dest = born;
			}

			// console.log(`no: ${i}, dest: ${JSON.stringify(dest)}, width: ${screenWidth}`);

			const winSize = {
				width: screenWidth,
				height: screenHeight
			};
			retList.push(new ball(born, dest, r, winSize));
		}

		return retList;
	},
	refreshAllDots: function(arr) {
		const {
			screenWidth,
			screenHeight,
			maxDotsCount,
			listDots
		} = appData;

		for (let i = 0; i < maxDotsCount; i++) {
			let dest = null;
			if (i >= arr.length) {
				dest = listDots[i].org_dest;
			} else {
				dest = arr[i];
			}

			listDots[i].ended = false;
			listDots[i].isReverse = false; // 正在从终点返回起点
			listDots[i].refresh(dest);
		}
	}
}

function setup() {
	appView.init();

	const {
		screenWidth,
		screenHeight,
		listTexts,
		listTextIdx
	} = appData;
	createCanvas(screenWidth, screenHeight);
	pixelDensity(1);
	background(0);
	strokeWeight(0);

	let maxDots = 0;
	for (let i = 0; i < appData.texts.length; i++) {
		appView.drawText(appData.texts[i]);
		const list = appView.recordText();
		maxDots = Math.max(list.length, maxDots);
		listTexts.push(list);
	}
	appData.maxDotsCount = maxDots;
	appData.listDots = appView.initAllDots(listTexts[listTextIdx]);
}

function draw() {
	background(0);
	strokeWeight(0);
	let endedCount = 0;
	let isReverse = false;
	for (let dot of appData.listDots) {
		let {
			x,
			y,
			speed
		} = dot.render();

		stroke(...dot.color);
		strokeWeight(dot.rad);
		point(x, y);
		endedCount += dot.ended ? 1 : 0;
		isReverse = dot.isReverse || isReverse;
	}


	if (endedCount === appData.listDots.length) {
		const now = Date.now();
		if (!appData.dotsEndedTime) {
			appData.dotsEndedTime = now;
		}

		if (now - appData.dotsEndedTime >= appData.dotsEndedDuration) {
			if (isReverse) {
				appData.listTextIdx += 1;
				if (appData.listTextIdx >= appData.listTexts.length) {
					appData.listTextIdx = 0;
				}

				let arr = appData.listTexts[appData.listTextIdx];
				appView.refreshAllDots(arr);
			} else {
				for (let dot of appData.listDots) {
					dot.reverse(!isReverse);
				}
			}

			appData.dotsEndedTime = null;


		}
	}

}
