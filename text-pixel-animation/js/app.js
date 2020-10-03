function getRandom(min, max) {
	let ret = Math.ceil(((Math.random() * (max - min)) + min) * 100) / 100;
	return ret;
}

function getColor() {
	let r = getRandom(0, 255);
	let g = getRandom(0, 255);
	let b = getRandom(0, 255);

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
	this.org_x = born.x; // 初始圆心横坐标
	this.org_y = born.y; // 初始圆心纵坐标
	this.org_x_percent = born.x / winSize.width;
	this.org_y_percent = born.y / winSize.height;
	this.rad = rad; // 半径
	this.d_x = 0; // 水平方向运动距离
	this.d_y = 0; // 垂直方向运动距离
	this.dest = dest;
	this.s_x = 0; // 水平方向运动速度
	this.s_y = 0; // 垂直方向运动速度
	this.winSize = winSize;
	this.life = 10000;
	this.born = Date.now();
	this.needDestory = false;
	this.color = getColor();
	this.ended = false;
	this.isReverse = false; // 正在从终点返回起点
	this.init = function() {
		const duration = 2 * 60; // 60fps
		let offset_x = this.dest.x - this.org_x;
		let offset_y = this.dest.y - this.org_y;
		this.s_x = offset_x / duration;
		this.s_y = offset_y / duration;
	}

	this.refresh = function(dest) {
		this.dest = dest;
		const duration = 2 * 60; // 60fps
		let offset_x = dest.x - this.org_x;
		let offset_y = dest.y - this.org_y;
		this.s_x = offset_x / duration;
		this.s_y = offset_y / duration;
	}

	/**
	 * 小球逐帧运动
	 * @param {object} winSize 屏幕尺寸
	 * @param {int} winSize.width 屏幕宽度
	 * @param {int} winSize.height 屏幕高度
	 */
	this.render = function(speed) {
		if (this.needDestory || Date.now() - this.born > this.life) {
			this.needDestory = true;
		}

		if (this.ended) {
			return {
				x: this.org_x + this.d_x,
				y: this.org_y + this.d_y
			};
		}

		if (!speed) {
			try {
				speed = lerp_easeInOutCubic(Math.round(Math.abs((this.org_x + this.d_x) / this.dest.x * 100)) / 100, 0.5, 2);
			} catch (ex) {
				speed = 1;
			}
		}

		this.d_x += speed * this.s_x;
		this.d_y += speed * this.s_y;

		// 碰撞检测
		// 如果球触碰到了屏幕边缘，对应方向速度取反
		// 获取当前圆心坐标
		let act_x = this.org_x + this.d_x;
		let act_y = this.org_y + this.d_y;
		let winSize = this.winSize;

		if (!this.ended && !this.isReverse && this.reachEnd(act_x, act_y)) {
			this.fixEnd(act_x, act_y);
			this.ended = true;
			this.endedTime = Date.now();
		} else if (!this.ended && this.isReverse && this.reachOrg(act_x, act_y)) {
			// this.fixOrg(act_x,act_y);
			this.ended = true;
			this.endedTime = Date.now();
		}

		return {
			x: act_x,
			y: act_y,
			speed: speed,
		};
	};

	this.fixEnd = function(act_x, act_y) {
		this.d_x = this.dest.x - this.org_x;
		this.d_y = this.dest.y - this.org_y;
	}

	this.fixOrg = function(act_x, act_y) {
		this.d_x = this.org_x - this.dest.x;
		this.d_y = this.org_y - this.dest.y;
	}

	this.reachEnd = function(act_x, act_y) {
		return ((this.s_x >= 0 && (act_x + 0.5) >= this.dest.x) || (this.s_x <= 0 && (act_x - 0.5) <= this.dest
			.x)) && ((this.s_y >=
			0 && (act_y + 0.5) >= this.dest.y) || (this.s_y <= 0 && (act_y - 0.5) <= this.dest.y))
	};

	this.reachOrg = function(act_x, act_y) {
		return ((this.s_x > 0 && act_x >= this.org_x) || (this.s_x <= 0 && act_x <= this.org_x)) &&
			((this.s_y >
				0 && act_y >= this.org_y) || (this.s_y <= 0 && act_y <= this.org_y))

		// return false;
	};

	this.updateWinSize = function(winSize) {
		this.winSize = winSize;
		this.org_x = winSize.width * this.org_x_percent;
		this.org_y = winSize.height * this.org_x_percent;
	};

	this.reverse = function(r) {
		this.ended = false;
		if (!this.isReverse) {
			this.s_x *= -1;
			this.s_y *= -1;
		}
		this.isReverse = r;
	}

	this.forceEnded = function() {
		this.ended = true;
	}

	let b = this;
	b.init();
};

let appData = {
	screenWidth: 500,
	screenHeight: 500,
	xOffset: 250,
	yOffset: 250,
	inc: 0.01,
	count: 0,
	frameCount: 0,
	listTexts: [],
	listTextIdx: 0,
	listDots: [],
	maxDotsCount: 300,
	dotsEndedDuration: 2000, // 点点到达终点后的静止时间
	dotsEndedTime: null, // 点点静止时间
	dotsInReverseAnimation: false,
	init: function() {
		this.xOffset = Math.ceil(this.screenWidth / 2);
		this.yOffset = Math.ceil(this.screenHeight / 2);
	},
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
		textSize(100);
		fill(255);
		text(a, screenWidth / 2, screenHeight / 2);
	},
	recordText: function() {
		let arr = [];
		loadPixels();
		for (let i = 0; i < pixels.length; i += 4) {
			if (pixels[i] == 255) {
				arr.push(i / 4);
			}
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
		if (arr.length >= maxDotsCount) {
			step = arr.length / maxDotsCount;
		}

		for (let i = 0; i < maxDotsCount; i++) {
			const no = Math.floor(i * step);
			const r = 5;
			const born = {
				x: getRandom(0, screenWidth),
				y: getRandom(0, screenHeight)
			};
			const dest = {
				x: (arr[no] % screenWidth),
				y: (arr[no] / screenWidth)
			};
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

		let step = 1;
		if (arr.length >= maxDotsCount) {
			step = arr.length / maxDotsCount;
		}

		for (let i = 0; i < maxDotsCount; i++) {
			const no = Math.floor(i * step);
			const r = 5;
			const dest = {
				x: (arr[no] % screenWidth),
				y: (arr[no] / screenWidth)
			};
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
	appView.drawText('闪现');
	listTexts.push(appView.recordText());
	appView.drawText('惩击');
	listTexts.push(appView.recordText());
	appView.drawText('治疗');
	listTexts.push(appView.recordText());
	appView.drawText('眩晕');
	listTexts.push(appView.recordText());
	appView.drawText('狂暴');
	listTexts.push(appView.recordText());
	appData.listDots = appView.initAllDots(listTexts[listTextIdx]);
	stroke(255);
}

function draw() {
	background(0);

	let endedCount = 0;
	let isReverse = false;
	var speedAll = null;
	for (let dot of appData.listDots) {
		let {
			x,
			y,
			speed
		} = dot.render(speedAll);

		speedAll = speed;

		stroke(...dot.color);
		strokeWeight(dot.rad);
		point(x, y);
		endedCount += dot.ended ? 1 : 0;
		isReverse = dot.isReverse || isReverse;
	}

	if (endedCount / appData.listDots.length > 0.95) {
		const now = Date.now();
		if (!appData.dotsEndedTime) {
			appData.dotsEndedTime = now;
		}

		for (let dot of appData.listDots) {
			dot.forceEnded();
		}

		if (now - appData.dotsEndedTime >= appData.dotsEndedDuration) {
			if (isReverse) {
				appData.listTextIdx += 1;
				if (appData.listTextIdx >= appData.listTexts.length) {
					appData.listTextIdx = 0;
				}

				let arr = appData.listTexts[appData.listTextIdx];
				appView.refreshAllDots(arr);
			}

			appData.dotsEndedTime = null;
			for (let dot of appData.listDots) {
				dot.reverse(!isReverse);
			}
		}
	}

}
