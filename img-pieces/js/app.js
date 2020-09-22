let getRandom = function(min, max) {
	let ret = Math.ceil(((Math.random() * (max - min)) + min) * 100) / 100;
	// console.log(`get random min: ${min}, max: ${max}, result: ${ret}`);
	return ret;
}

let rem = new Rem();
rem.getWindowSize();

let appData = {
	lastRenderTime: 0,
	renderInterval: 1000 / 120,
	imgWrapperWidth: 850,
	piecesNum: 150,
	level: 5,
	piecesCenterPoint: null,
	timeoutMouseMoveHandler: null,
	timeoutMouseMoveStep: 1000 / 20,
};

let appView = {
	listPieces: [],
	$pieces: $('.pieces'),
	init: function() {
		appView.initPieces();

		setTimeout(() => {
			appView.initPiecesRotate();
		}, 1000);

		appView.$pieces.one('click', () => {
			$("body").off('mousemove', appView.bodyMoveHandler);

			appView.listPieces.forEach($ele => {
				setTimeout(() => {
					$ele.css({
						transform: `translateX(${appData.imgWrapperWidth}px) scaleX(0.01) scaleY(0.01)`,
						opacity: 0
					});
				}, getRandom(100, 500));
			});

			setTimeout(() => {
				appView.init();
			}, 1000);
		})
	},
	initPiecesRotate: function() {
		$("body").bind('mousemove', appView.bodyMoveHandler);
	},
	bodyMoveHandler: function(event) {
		if (appData.timeoutMouseMoveHandler != null) {
			return;
		}

		appData.timeoutMouseMoveHandler = setTimeout(() => {
			clearTimeout(appData.timeoutMouseMoveHandler);
			appData.timeoutMouseMoveHandler = null;
		}, appData.timeoutMouseMoveStep);

		appView.renderPieces(event);
	},
	/*
	 * 初始化所有碎片 
	 * */
	initPieces: function() {
		let pr = document.getElementsByClassName('pieces');
		let {
			x,
			y,
			width,
			height
		} = pr[0].getBoundingClientRect();
		appData.piecesCenterPoint = {
			x: (x + width / 2),
			y: (y + width / 2)
		}

		// 将所有图片平均分成n层,即第0，1，2...n-1层，层数标记为lv
		// lv的功能如下
		// lv越低，其离开图片中心就越远，也就是半径越大，反过来lv越高就越靠近中心点
		// lv越低，图片尺寸越小

		// lv的功能如下
		// lv越低，其离开图片中心就越近，也就是离图片中心的距离越小，反过来lv越高就越靠近中心点
		// lv越低，图片尺寸越大

		appView.listPieces = [];
		const {
			piecesNum,
			level,
			imgWrapperWidth
		} = appData;
		const stepPieces = Math.floor(piecesNum / level);
		const stepWidth = Math.round(imgWrapperWidth / 2 / level); // 设定每一层图片宽度的标准值

		for (let i = 0; i < level; i++) {
			// 设置半径和尺寸
			let w = stepWidth * (1 + (level - 1 - i) * 0.1);
			if (w < 10) {
				w = 10;
			}

			let maxR = imgWrapperWidth / 2 - stepWidth * (level - 1 - i);
			let minR = maxR - w;
			if (i == 0) {
				minR = 0;
			}

			console.log(`maxR: ${maxR}, minR: ${minR}`);

			for (let j = 0; j < stepPieces; j++) {
				let $piece = $(`<div class="piece" lv="${i}"></div>`);
				appView.setPieceStyle($piece, maxR, minR, w);
				appView.listPieces.push($piece);
			}
		}

		let $pieces = $('.pieces');
		$pieces.empty();
		for (let $item of appView.listPieces) {
			$pieces.append($item);
			// $item.addClass('heart');
			$item.addClass('fade-in');
			setTimeout(() => {
				$item.removeClass('fade-in');
			}, getRandom(100, 500))
		}
	},
	setPieceStyle: function($ele, maxR, minR, width) {
		const {
			imgWrapperWidth
		} = appData;

		// 设置尺寸
		const w = getRandom(width * 0.9, width * 1.1);
		$ele.css({
			width: w + 'px',
			height: w + 'px',
		});

		// 设置位置
		const r = getRandom(minR, maxR);
		const deg = getRandom(0, 2) * Math.PI;

		let leftPos = imgWrapperWidth / 2 + Math.cos(deg) * r - w / 2;
		let topPos = imgWrapperWidth / 2 - Math.sin(deg) * r - w / 2;

		$ele.css({
			left: leftPos,
			top: topPos,
			'background-position': `${-leftPos}px ${-topPos}px`,
		});
	},
	renderPieces: function(event) {
		const {
			pageX,
			pageY
		} = event;
		const {
			x,
			y
		} = appData.piecesCenterPoint;

		const {
			imgWrapperWidth
		} = appData;

		let dx = pageX - x;
		if (dx > imgWrapperWidth) {
			dx = imgWrapperWidth
		} else if (dx < -imgWrapperWidth) {
			dx = -imgWrapperWidth;
		}

		let dxPercent = Math.round(dx / imgWrapperWidth * 100) / 100;

		let dy = pageY - y;
		if (dy > imgWrapperWidth) {
			dy = imgWrapperWidth;
		} else if (dy < -imgWrapperWidth) {
			dy = -imgWrapperWidth;
		}

		let dyPercent = Math.round(dy / imgWrapperWidth * 100) / 100;

		appView.listPieces.forEach($ele => {
			let lv = appData.level - parseInt($ele.attr('lv'));
			$ele.css({
				transform: `translateX(${lv*dxPercent}rem) translateY(${lv*dyPercent}rem)`
			});
		})
	}
};

$(document).ready(function() {
	appView.init();
});
