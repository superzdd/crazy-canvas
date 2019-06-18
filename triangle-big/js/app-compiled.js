'use strict';

var $canvas = $('#app');
var rem = new Rem();
var ratio = window.devicePixelRatio;
var windowSizeInfo = rem.getWindowSize();

var canvasInfo = {
	stage: null,
	width: 0,
	height: 0,
	centerX: 0, // 画布中心点x
	centerY: 0, // 画布中心点y
	distanceToCenter: 0 // 左上角到中心点的距离
};

var paintInfo = {
	line: 20,
	column: 20,
	frame: 1000 / 30,
	lastRenderTime: 0
};

var mousePosition = {
	x: 0,
	y: 0
};

var points = [];

var point = function point(x, y) {
	this.x = x;
	this.y = y;
	this.org_x = x;
	this.org_y = y;
	this.refresh = function () {
		var x = mousePosition.x;
		var y = mousePosition.y;
		var dx = void 0,
		    dy = void 0,
		    d = void 0,
		    offsetX = void 0,
		    offsetY = void 0,
		    dodgeDis = void 0;
		var dodgeThreshold = 200;
		var dodgeRatio = 0.3;
		dx = this.x - x;
		dy = this.y - y;
		dy == 0 ? dy = 0.001 : dy;
		dx == 0 ? dx = 0.001 : dx;
		d = Math.sqrt(dx * dx + dy * dy);
		if (d < dodgeThreshold) {
			dodgeDis = (dodgeThreshold - d) * dodgeRatio;
			offsetX = dodgeDis * dx / d;
			offsetY = dodgeDis * dy / d;

			if (this.x != 0 && this.x != canvasInfo.width) {
				this.x = this.org_x + offsetX;
			}

			if (this.y != 0 && this.y != canvasInfo.height) {
				this.y = this.org_y + offsetY;
			}
		}
	};
};

var triangles = [];

var triangle = function triangle(p1, p2, p3) {
	this.point1 = p1;
	this.point2 = p2;
	this.point3 = p3;
	this.hue = 0; // 色调 标准色是蓝色
	this.saturation = 80; // 饱和度
	this.lightness = 0;
	this.maxLightness = 90;
	this.render = function () {
		var s = new createjs.Shape();
		var color = createjs.Graphics.getHSL(this.generate_hue(), this.saturation, this.generate_lightness());
		s.graphics.beginStroke(color);
		s.graphics.beginFill(color);
		s.graphics.moveTo(this.point1.x, this.point1.y).lineTo(this.point2.x, this.point2.y).lineTo(this.point3.x, this.point3.y).lineTo(this.point1.x, this.point1.y);
		s.graphics.endFill();
		s.graphics.endStroke();
		return s;
	};
	this.generate_hue = function () {
		if (this.hue) {
			return this.hue;
		}

		this.hue = Math.random() * 20 + 220;
		return this.hue;
	};
	this.generate_lightness = function () {
		if (this.lightness) {
			return this.lightness;
		}

		var x = (this.point1.x + this.point2.x + this.point3.x) / 3;
		var y = (this.point1.y + this.point2.y + this.point3.y) / 3;

		var distance = Math.sqrt((x - canvasInfo.centerX) * (x - canvasInfo.centerX) + (y - canvasInfo.centerY) * (y - canvasInfo.centerY));

		this.lightness = (canvasInfo.distanceToCenter - distance) / canvasInfo.distanceToCenter * this.maxLightness;
		return this.lightness;
	};
};

var initCanvas = function initCanvas() {
	$canvas.attr('width', windowSizeInfo.width * ratio);
	$canvas.attr('height', windowSizeInfo.height * ratio);
	$canvas.css({
		width: windowSizeInfo.width,
		height: windowSizeInfo.height
	});
	canvasInfo.stage = new createjs.Stage("app");
	createjs.Touch.enable(canvasInfo.stage);
	canvasInfo.width = windowSizeInfo.width * ratio;
	canvasInfo.height = windowSizeInfo.height * ratio;
	canvasInfo.centerX = canvasInfo.width / 2;
	canvasInfo.centerY = canvasInfo.height / 2;
	canvasInfo.distanceToCenter = Math.sqrt(canvasInfo.centerX * canvasInfo.centerX + canvasInfo.centerY * canvasInfo.centerY);
};

var initTriangles = function initTriangles() {
	var pts = points;
	var column = paintInfo.column;
	var stage = canvasInfo.stage;

	var g = new createjs.Graphics();
	g.setStrokeStyle(1);
	g.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
	g.beginFill(createjs.Graphics.getRGB(255, 0, 0));
	g.drawCircle(0, 0, 3);

	for (var l = 0; l < pts.length - column; l++) {
		if (l % column == column - 1) {
			continue;
		}

		var p1 = pts[l];
		var p2 = pts[l + 1];
		var p3 = pts[l + column];
		var p4 = pts[l + column + 1];

		var tri1 = new triangle(p1, p2, p4);
		var tri2 = new triangle(p1, p4, p3);

		triangles.push(tri1);
		triangles.push(tri2);

		stage.addChild(tri1.render());
		stage.addChild(tri2.render());
	}

	stage.update();
};

var initPoints = function initPoints() {

	// 创造n行m列的矩阵
	var line = paintInfo.line;
	var column = paintInfo.column;

	var offset_line = canvasInfo.height / (line - 1);
	var offset_column = canvasInfo.width / (column - 1);
	// console.log('one time');
	for (var i = 0; i < line; i++) {
		for (var j = 0; j < column; j++) {
			var x = j * offset_column;
			var y = i * offset_line;

			// 边缘坐标紧贴不动
			if (i == line - 1) {
				y = canvasInfo.height;
			} else if (i == 0) {
				y = 0;
			} else {
				y = y + (Math.random() * 2 - 1) * 50;
			}

			if (j == column - 1) {
				x = canvasInfo.width;
			} else if (j == 0) {
				x = 0;
			} else {
				x = x + (Math.random() * 2 - 1) * 50;
			}

			var p = new point(x, y);
			p.refresh();

			points.push(p);
		}
	}
};

var stageMouseMoveHandler = function stageMouseMoveHandler(e) {
	var x = e.stageX;
	var y = e.stageY;

	mousePosition.x = x;
	mousePosition.y = y;
};

var renderMouseMove = function renderMouseMove() {
	canvasInfo.stage.addEventListener('stagemousemove', stageMouseMoveHandler);
};

var render = function render() {
	var currentTime = Date.now();
	if (currentTime - paintInfo.lastRenderTime < paintInfo.frame) {
		requestAnimationFrame(render);
		return;
	}

	var stage = canvasInfo.stage;

	paintInfo.lastRenderTime = currentTime;
	stage.removeAllChildren();

	points.forEach(function (p) {
		p.refresh();
	});

	triangles.forEach(function (t) {
		stage.addChild(t.render());
	});

	stage.update();

	requestAnimationFrame(render);
};

$(document).ready(function () {
	initCanvas();
	initPoints();
	initTriangles();
	renderMouseMove();
	render();
});
