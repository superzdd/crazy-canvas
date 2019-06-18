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
	line: 20,
	column: 20,
	frame: 1000 / 30,
	lastRenderTime: 0,
	pointOffset: 50, // 初始坐标偏移量最大值
	dodgeThreshold: 200, // 躲闪阈值，最大值
	dodgeRatio: 0.3, // 躲闪幅度，值越大躲闪幅度越大。整体躲闪程度呈线性递减，即距离越近躲闪越大，距离越远躲闪越小
}

// 鼠标坐标，x,y为在canvas中的相对坐标
let mousePosition = {
	x: 0,
	y: 0,
}

/**
 * 初始化canvas对象
 */
let initCanvas = function() {
	let rem = new Rem();
	let windowSizeInfo = rem.getWindowSize();
	let ratio = window.devicePixelRatio;

	canvasInfo.stage = new createjs.Stage("app");
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

// 网格中所有顶点
let points = [];

// 网格中所有的三角形
let triangles = [];

let point = function(x, y) {
	this.x = x;
	this.y = y;
	this.org_x = x;
	this.org_y = y;
	this.render = function() {
		const {
			x,
			y
		} = mousePosition; // 获取鼠标坐标
		let dx = this.x - x;
		let dy = this.y - y;

		if (Math.abs(dx) <= 0.001) {
			dx = 0.001 * (dx > 0 ? 1 : -1)
		}

		if (Math.abs(dy) <= 0.001) {
			dy = 0.001 * (dy > 0 ? 1 : -1)
		}

		const distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < paintInfo.dodgeThreshold) {
			// 计算偏移距离
			const dodgeDis = (paintInfo.dodgeThreshold - distance) * paintInfo.dodgeRatio;

			if (this.x != 0 && this.x != canvasInfo.width) {
				this.x = this.org_x + dodgeDis * dx / distance;
			}

			if (this.y != 0 && this.y != canvasInfo.height) {
				this.y = this.org_y + dodgeDis * dy / distance;
			}

		}
	}
}

let triangle = function(p1, p2, p3) {
	this.point1 = p1;
	this.point2 = p2;
	this.point3 = p3;
	this.hue = 0; // 色调 标准色是蓝色
	this.saturation = 80; // 饱和度
	this.lightness = 0;
	this.maxLightness = 90;
	this.render = function() {
		let s = new createjs.Shape();
		let color = createjs.Graphics.getHSL(this.generate_hue(), this.saturation, this.generate_lightness());
		s.graphics.beginStroke(color)
		s.graphics.beginFill(color);
		s.graphics.moveTo(this.point1.x, this.point1.y).lineTo(this.point2.x, this.point2.y).lineTo(this.point3.x,
			this.point3.y).lineTo(
			this.point1.x, this.point1.y);
		s.graphics.endFill();
		s.graphics.endStroke();
		return s;
	};
	this.generate_hue = function() {
		if (this.hue) {
			return this.hue;
		}

		this.hue = Math.random() * 20 + 220
		return this.hue;
	};
	this.generate_lightness = function() {
		if (this.lightness) {
			return this.lightness;
		}

		let x = (this.point1.x + this.point2.x + this.point3.x) / 3;
		let y = (this.point1.y + this.point2.y + this.point3.y) / 3;

		let distance = Math.sqrt((x - canvasInfo.centerX) * (x - canvasInfo.centerX) + (y - canvasInfo.centerY) * (y -
			canvasInfo.centerY));

		this.lightness = (canvasInfo.distanceToCenter - distance) / canvasInfo.distanceToCenter * this.maxLightness;
		return this.lightness;
	};
}

/**
 * 初始化所有顶点
 */
let initPoints = function() {
	// 顶点是用于构成三角形的元素，每个三角形需要三个顶点
	// 顶点本身不需要画到画布上，因为只要有三角形就足够了，所以最后只需添加到points数组里就行

	// 创造n行m列的矩阵
	let line = paintInfo.line;
	let column = paintInfo.column;

	let offset_line = canvasInfo.height / (line - 1);
	let offset_column = canvasInfo.width / (column - 1);

	for (let i = 0; i < line; i++) {
		for (let j = 0; j < column; j++) {
			let x = j * offset_column;
			let y = i * offset_line;

			// 边缘坐标要紧贴到屏幕边缘，避免小数误差造成的影响
			if (i == (line - 1)) {
				y = canvasInfo.height;
			} else if (i == 0) {
				y = 0;
			} else {
				y = y + (Math.random() * 2 - 1) * paintInfo.pointOffset;
			}

			if (j == (column - 1)) {
				x = canvasInfo.width;
			} else if (j == 0) {
				x = 0;
			} else {
				x = x + (Math.random() * 2 - 1) * paintInfo.pointOffset;
			}

			let p = new point(x, y);
			p.render();

			points.push(p);
		}
	}
}

/**
 * 初始化所有三角形
 */
let initTriangles = function() {
	let pts = points;
	let column = paintInfo.column;
	let stage = canvasInfo.stage;

	let g = new createjs.Graphics();
	g.setStrokeStyle(1);
	g.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
	g.beginFill(createjs.Graphics.getRGB(255, 0, 0));
	g.drawCircle(0, 0, 3);

	for (let l = 0; l < pts.length - column; l++) {
		if (l % column == (column - 1)) {
			continue;
		}

		let p1 = pts[l];
		let p2 = pts[l + 1];
		let p3 = pts[l + column];
		let p4 = pts[l + column + 1];

		let tri1 = new triangle(p1, p2, p4);
		let tri2 = new triangle(p1, p4, p3);

		triangles.push(tri1);
		triangles.push(tri2);

		stage.addChild(tri1.render());
		stage.addChild(tri2.render());
	}

	stage.update();
}

let stageMouseMoveHandler = function(e) {
	let x = e.stageX;
	let y = e.stageY;

	mousePosition.x = x;
	mousePosition.y = y;
}

let renderMouseMove = function() {
	canvasInfo.stage.addEventListener('stagemousemove', stageMouseMoveHandler);
}

let render = function() {
	let currentTime = Date.now();
	if (currentTime - paintInfo.lastRenderTime < paintInfo.frame) {
		requestAnimationFrame(render);
		return;
	}

	let stage = canvasInfo.stage;

	paintInfo.lastRenderTime = currentTime;
	stage.removeAllChildren();

	points.forEach(p => {
		p.render();
	});

	triangles.forEach((t) => {
		stage.addChild(t.render());
	});

	stage.update();

	requestAnimationFrame(render);
}

$(document).ready(function() {
	initCanvas();
	initPoints();
	initTriangles();
	render();
	renderMouseMove();
});
