let rem = new Rem();
rem.getWindowSize();

let appData = {
	pLeft: null,
	pRight: null,
	isWink: false,
	mouseMove: false,
	timeoutMove: null,
	eyeRadius: 20,
};

let appView = {
	alphabets: [],
	$lb: $('#lb'),
	$rb: $('#rb'),
	$lel: $('#lel'),
	$rel: $('#rel'),
	init: function() {
		appView.initPointPosition();

		$("body").mousemove(function(event) {
			var msg = "Handler for .mousemove() called at ";
			msg += event.pageX + ", " + event.pageY;
			appView.renderEyeBall(event);
			if (appData.timeoutMove) {
				clearTimeout(appData.timeoutMove);
			}
			appData.mouseMove = true;
			appData.timeoutMove = setTimeout(() => {
				appData.mouseMove = false
			}, 300);
		});

		appView.render();
	},
	initPointPosition: function() {
		appView.initPoint('pLeft', 'lb');
		appView.initPoint('pRight', 'rb');
		console.log(`pLeft`);
		console.log(appData.pLeft);
		console.log(`pRight`);
		console.log(appData.pRight);
	},
	// 渲染眼珠滚动
	// 两只眼睛转动的幅度应该一致，取幅度小
	// 如果鼠标落在两眼之间，幅度绝对值仍然一致，但方向相反
	renderEyeBall(evt) {
		const {
			pageX: x,
			pageY: y
		} = evt;
		const {
			x: l_x,
			y: l_y
		} = appData.pLeft;
		const {
			x: r_x,
			y: r_y,
		} = appData.pRight;
		const {
			getEyeDeg,
			renderPointByDeg,
		} = appView;

		const {
			eyeRadius
		} = appData;

		const ptInMiddle = x >= l_x && x <= r_x && y >= (l_y - eyeRadius) && y <= (l_y + eyeRadius); // 鼠标在两眼之间
		const ptAtBottom = y > l_y; // 鼠标在两眼的Y值下方
		const leftDeg = getEyeDeg(evt, appData.pLeft);
		const rightDeg = getEyeDeg(evt, appData.pRight);
		let finalDeg = {
			left: null,
			right: null
		}
		if (!ptInMiddle) {
			finalDeg.left = finalDeg.right = Math.min(leftDeg, rightDeg);
		} else {
			if (ptAtBottom) {
				let newLeftDeg = leftDeg;
				let newRightDeg = 180 - rightDeg;

				let newDeg = Math.min(newLeftDeg, newRightDeg);
				finalDeg.left = newDeg;
				finalDeg.right = 180 - newDeg;
			} else {
				let newLeftDeg = 360 - leftDeg;
				let newRightDeg = rightDeg - 180;

				let newDeg = Math.min(newLeftDeg, newRightDeg);
				finalDeg.left = 360 - newDeg;
				finalDeg.right = 180 + newDeg;
			}
		}

		renderPointByDeg(finalDeg.left, appView.$lb);
		renderPointByDeg(finalDeg.right, appView.$rb);
	},
	getEyeDeg(event, point) {
		/**
		 * 角度坐标系
		 *          270
		 *           | 
		 *           |
		 *     225   |     315
		 *           |
		 *           |
		 * ----------|----------- 0
		 *           |
		 *      135  |     45
		 *           | 
		 *           |
		 *          90
		 */

		const lp = point;

		let dx = event.pageX - lp.x;
		let dy = event.pageY - lp.y;

		let degree = 0;
		// 计算是否落在坐标轴上
		if (dx == 0 && dy == 0) {
			degree = 0;
		} else if (dx == 0) {
			// 落在y轴上
			if (dy < 0) {
				// Y轴正半轴
				degree = 270;
			} else {
				degree = 90;
			}
		} else if (dy == 0) {
			// 落在x轴上
			if (dx < 0) {
				// X轴负半轴
				degree = 180;
			} else {
				// X轴正半轴
				degree = 360;
			}
		} else {
			degree = Math.atan(Math.abs(dy) / Math.abs(dx));
			degree = degree * 180 / Math.PI;

			// 查看角度在第几象限，要不要加角度
			// 第四象限，不用加
			// 第三象限 用180减
			if (dx < 0 && dy > 0) {
				degree = 180 - degree;
			}
			// 第二象限 180加
			if (dx < 0 && dy < 0) {
				degree = 180 + degree;
			}
			// 第一象限 360减
			if (dx > 0 && dy < 0) {
				degree = 360 - degree;
			}
		}
		return degree;
	},
	renderPointByDeg(degree, $element) {
		let rdegree = degree * Math.PI / 180;
		const r = appData.eyeRadius;
		const b = 1.5 * r;

		let x = Math.cos(rdegree) * r;
		let y = b * Math.sqrt(1 - x * x / r / r);

		if (degree >= 180 || degree == 0) {
			y = -0.3 * y;

			$element.css('transform',
				` translateX(${x}px) translateY(${y}px)`);
		} else {
			// $element.css('transform',
			// 	` translateX(${Math.cos(rdegree)*r}px) translateY(${Math.sin(rdegree)*r}px)`);
			$element.css('transform',
				` translateX(${x}px) translateY(${y}px)`);
		}
	},
	renderPoint(event, point, $element) {
		const lp = point;

		let dx = event.pageX - lp.x;
		let dy = event.pageY - lp.y;

		let degree = 0;
		// 计算是否落在坐标轴上
		if (dx == 0 && dy == 0) {
			degree = 0;
		} else if (dx == 0) {
			// 落在y轴上
			if (dy < 0) {
				// Y轴正半轴
				degree = 270;
			} else {
				degree = 90;
			}
		} else if (dy == 0) {
			// 落在x轴上
			if (dx < 0) {
				// X轴负半轴
				degree = 180;
			} else {
				// X轴正半轴
				degree = 360;
			}
		} else {
			degree = Math.atan(Math.abs(dy) / Math.abs(dx));
			degree = degree * 180 / Math.PI;

			// 查看角度在第几象限，要不要加角度
			// 第四象限，不用加
			// 第三象限 用180减
			if (dx < 0 && dy > 0) {
				degree = 180 - degree;
			}
			// 第二象限 180加
			if (dx < 0 && dy < 0) {
				degree = 180 + degree;
			}
			// 第一象限 360减
			if (dx > 0 && dy < 0) {
				degree = 360 - degree;
			}
		}
		let rdegree = degree * Math.PI / 180;
		const r = appData.eyeRadius;

		if (degree >= 180 || degree == 0) {
			$element.css('transform',
				` translateX(${Math.cos(rdegree)*r}px) translateY(-1px)`);
		} else {
			$element.css('transform',
				` translateX(${Math.cos(rdegree)*r}px) translateY(${Math.sin(rdegree)*r}px)`);
		}
	},
	renderEyelid(event, point, $element) {
		const lp = point;
		const moveRangeX = 5; // px
		const moveRangeY = {
			down: 5,
			up: 15
		}; // px
		const threshold = 200; // px

		let dx = event.pageX - lp.x;
		let dy = event.pageY - lp.y;

		dx = dx / threshold * moveRangeX;
		if (dx > moveRangeX) {
			dx = moveRangeX;
		} else if (dx < -1 * moveRangeX) {
			dx = -1 * moveRangeX;
		}

		dy = dy / threshold;
		if (dy > 0) {
			if (dy > 1) {
				dy = moveRangeY.down;
			} else {
				dy *= moveRangeY.down;
			}
		} else if (dy < 0) {
			if (dy < -1) {
				dy = -1 * moveRangeY.up;
			} else {
				dy *= moveRangeY.up;
			}
		}

		$element.css('transform', `translateX(${dx}px) translateY(${dy}px)`);
	},
	initPoint(appPoint, id) {
		let pr = document.getElementById(id);
		let {
			x,
			y,
			width,
			height
		} = pr.getBoundingClientRect();
		appData[appPoint] = {
			x: (x + width / 2),
			y: (y + height / 2)
		}
	},
	render: function() {
		requestAnimationFrame(appView.renderWink);

	},
	renderWink: function() {
		if (appData.isWink || appData.mouseMove) {
			if (appData.mouseMove) {
				appView.$lel.removeClass('ani-wink');
				appView.$rel.removeClass('ani-wink');
			}

			requestAnimationFrame(appView.renderWink);
			return;
		}

		appData.isWink = true;
		setTimeout(() => {
			appView.$lb.css('transform',
				` translateX(0px) translateY(0px)`);
			appView.$rb.css('transform',
				` translateX(0px) translateY(0px)`);
			appView.$lel.addClass('ani-wink');
			appView.$rel.addClass('ani-wink');

			setTimeout(() => {
				appView.$lel.removeClass('ani-wink');
				appView.$rel.removeClass('ani-wink');
				setTimeout(() => {
					appData.isWink = false;
				}, 800)
			}, 600);
		}, 500)

		requestAnimationFrame(appView.renderWink);
	}
};



$(document).ready(function() {
	appView.init();
});
