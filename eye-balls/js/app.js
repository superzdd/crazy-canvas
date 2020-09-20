let rem = new Rem();
rem.getWindowSize();

let appData = {
	pLeft: null,
	pRight: null,
	isWink: false,
	mouseMove: false,
	timeoutMove: null,
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
			appView.renderPoint(event, appData.pLeft, appView.$lb);
			appView.renderPoint(event, appData.pRight, appView.$rb);
			appView.renderEyelid(event, appData.pLeft, appView.$lel);
			appView.renderEyelid(event, appData.pRight, appView.$rel);

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
		const r = 20;

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
		const moveRangeY = 2; // px
		const threshold = 200; // px

		let dx = event.pageX - lp.x;
		let dy = event.pageY - lp.y;

		dx = dx / threshold * moveRangeX;
		if (dx > moveRangeX) {
			dx = moveRangeX;
		} else if (dx < -1 * moveRangeX) {
			dx = -1 * moveRangeX;
		}

		dy = dy / threshold * moveRangeY;
		if (dy > moveRangeY) {
			dy = moveRangeY;
		} else if (dy < -1 * moveRangeY) {
			dy = -1 * moveRangeY;
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
			y: (y + width / 2)
		}
	},
	render: function() {
		requestAnimationFrame(appView.render);
		appView.renderWink();
	},
	renderWink: function() {
		if (appData.isWink || appData.mouseMove) {
			return;
		}

		let num = Math.round(Math.random() * 1000);
		if (num < 2) {
			appData.isWink = true;
			appView.$lel.addClass('ani-wink');
			appView.$rel.addClass('ani-wink');

			setTimeout(() => {
				appData.isWink = false;
				appView.$lel.removeClass('ani-wink');
				appView.$rel.removeClass('ani-wink');
			}, 600);
		}
	}
};



$(document).ready(function() {
	appView.init();
});
