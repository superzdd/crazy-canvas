/*
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
let ball = function(x = 0, y = 0, rad, s_x = 1, s_y = 1, $ball, winSize) {
	this.org_x = x; // 初始圆心横坐标
	this.org_y = y; // 初始圆心纵坐标
	this.org_x_percent = x / winSize.width;
	this.org_y_percent = y / winSize.height;
	this.rad = rad; // 半径
	this.d_x = 0; // 水平方向运动距离
	this.d_y = 0; // 垂直方向运动距离
	this.s_x = s_x; // 水平方向运动速度
	this.s_y = s_y; // 垂直方向运动速度
	this.$ball = $ball;
	this.winSize = winSize;
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
		if (this.needDestory || Date.now() - this.born > this.life) {
			this.needDestory = true;
			$ball.remove();
		}

		this.d_x += this.s_x;
		this.d_y += this.s_y;

		// 碰撞检测
		// 如果球触碰到了屏幕边缘，对应方向速度取反
		// 获取当前圆心坐标
		let act_x = this.org_x + this.d_x;
		let act_y = this.org_y + this.d_y;
		let winSize = this.winSize;

		if (act_x - this.rad <= 0 || act_x + this.rad >= winSize.width) {
			this.s_x *= -1;
		}

		if (act_y - this.rad <= 0 || act_y + this.rad >= winSize.height) {
			this.s_y *= -1;
		}

		this.$ball.css({
			transform: `translateX(${this.d_x}px) translateY(${this.d_y}px)`,
		});
	};

	this.updateWinSize = function(winSize) {
		this.winSize = winSize;
		this.org_x = winSize.width * this.org_x_percent;
		this.org_y = winSize.height * this.org_x_percent;
	};
};


let rem = new Rem();
rem.getWindowSize();

let appData = {
	lastRenderTime: 0,
	renderInterval: 1000 / 120,
	radius: 10
};

let appView = {
	ballList: [],
	$white: $('.white-cover'),
	dragEnable: false,
	lastMovePos: {
		x: -100,
		y: -100
	},
	init: function() {
		$('body').css("--ball-dia", `${(appData.radius||10)*2}px`);

		appView.$white.on('touchstart mousedown', () => {
			appView.dragEnable = true;
		});

		appView.$white.on('touchmove mousemove', (e) => {
			if (appView.dragEnable) {
				const {
					clientX,
					clientY
				} = e;
				appView.createNewBall(clientX, clientY);
				let {
					x,
					y
				} = appView.lastMovePos;

				const disX = Math.abs(x - clientX);
				const disY = Math.abs(y - clientY);
				const radius = appData.radius;
				if (x >= 0 && y >= 0 && (disX > radius || disY > radius)) {
					let steps, stepx, stepy;
					if (disX > disY) {
						steps = Math.abs(Math.floor((clientX - x) / radius));
					} else {
						steps = Math.abs(Math.floor((clientY - y) / radius));
					}

					stepx = (x - clientX) / steps + 1;
					stepy = (y - clientY) / steps + 1;

					let count = 1;
					while (count <= steps) {
						appView.createNewBall(clientX + count * stepx, clientY + count * stepy);
						count++;
					}
				}

				appView.lastMovePos = {
					x: clientX,
					y: clientY
				};
			}
		});

		appView.$white.on('touchend touchcancel mouseup', (e) => {
			appView.dragEnable = false;
			appView.lastMovePos = {
				x: -100,
				y: -100
			};
		});
		
		window.setInterval(()=>{
			if(!appView.dragEnable && appView.ballList.length>200){
				while(appView.ballList.length>200){
					let $b = appView.ballList.pop();
					$b.remove();
				}
			}
		},2000)
	},
	createNewBall: function(x, y) {
		const {
			radius
		} = appData;
		const diameter = radius * 2;
		let id = `b${Date.now()}`;
		const animationClass = "ani-disappear";
		let dom =
			`<div class="ball ${animationClass}" id="${id}" style="left:${x-radius}px;top:${y-radius}px"></div>`;

		let $ball = null;
		if (appView.ballList.length > 0) {
			$ball = appView.ballList.pop();
			$ball.removeClass(animationClass).addClass(animationClass).css('opacity', 1);
			$ball.css({
				left: `${x-radius}px`,
				top: `${y-radius}px`
			})
		} else {
			appView.$white.append(dom);
			$ball = $(`#${id}`)
			$ball.on('animationend', () => {
				$ball.removeClass(animationClass).css('opacity', 0);
				appView.ballList.push($ball);
			});
		}

		console.log(appView.ballList.length);
	},
};

$(document).ready(function() {
	appView.init();
});
