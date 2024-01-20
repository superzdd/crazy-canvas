// 原生canvas api

let $canvas = $('#app');

// 画布基本信息
let canvasInfo = {
    instance: null,
    ctx: null,
    stage: null, // createjs的canvas实例对象
    width: 0, // 画布的宽度，指的是画布的逻辑宽度，即屏幕宽度像素数量 * ratio（每像素包含的实际像素）
    height: 0, // 画布的高度，指的是画布的逻辑高度，即屏幕高度像素数量 * ratio（每像素包含的实际像素）
    centerX: 0, // 画布中心点x
    centerY: 0, // 画布中心点y
    distanceToCenter: 0, // 左上角到中心点的距离
    noLoopFlag: false,
};

// 构建绘画的基本信息
let paintInfo = {
    frame: 1000 / 60,
    lastRenderTime: 0,
    noiseData: null,
    a: 10, // 波浪的振幅
    r: 80 * window.devicePixelRatio, // 圆的半径
    t: 2, // 波浪1个周期的长度，值为n个半径，比如2就是2个半径
    x1: 1,
    x2: 1.5,
    x3: 2,
    circleStrokeLineWidth: 40,
    loadingPercent: 0.01,
};

/**
 * 初始化canvas对象
 */
let initCanvas = function () {
    let rem = new Rem();
    let windowSizeInfo = rem.getWindowSize();
    let ratio = window.devicePixelRatio;

    canvasInfo.ctx = $canvas[0].getContext('2d');
    canvasInfo.width = windowSizeInfo.width * ratio;
    canvasInfo.height = windowSizeInfo.height * ratio;
    canvasInfo.centerX = canvasInfo.width / 2;
    canvasInfo.centerY = canvasInfo.height / 2;
    canvasInfo.distanceToCenter = Math.sqrt(
        canvasInfo.centerX * canvasInfo.centerX +
            canvasInfo.centerY * canvasInfo.centerY
    );

    initSaveCtx();
    $canvas.attr('width', canvasInfo.width);
    $canvas.attr('height', canvasInfo.height);
    $canvas.css({
        width: windowSizeInfo.width,
        height: windowSizeInfo.height,
    });
};

let initSaveCtx = () => {
    let { ctx } = canvasInfo;

    ctx.lineWidth = 0.1;
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.save();
};

let restore = () => {
    // 注意 restore的用法非常有讲究
    // restore其实是pop了上一次save的状态，所以当一次restore执行成功后，如果再对ctx进行任何修改，restore就不会起作用了
    // 所以每一次restore之后，最好还是再做一次save为好。。。相当于restore没什么用
    let { ctx } = canvasInfo;
    ctx.restore();
    initSaveCtx();
    // console.log(`restore success, ctx lineWidth is ${ctx.lineWidth}`);
};

let clear = () => {
    let { ctx } = canvasInfo;
    ctx.clearRect(0, 0, canvasInfo.width, canvasInfo.height);
};

let rect = function (
    x = 0,
    y = 0,
    w = canvasInfo.width,
    h = canvasInfo.height,
    color = '#000000'
) {
    let { ctx } = canvasInfo;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
};

let render = function () {
    clear();
    rect();
    wave1();
    wave2();
    // wave3();

    roundClip2();
    strokeCircle('rgba(0,0,128,1)', paintInfo.loadingPercent * 360);

    text(Math.floor(paintInfo.loadingPercent * 100) + '%');

    if (!canvasInfo.noLoopFlag) {
        requestAnimationFrame(render);
    }

    if (paintInfo.loadingPercent < 0.7) {
        paintInfo.loadingPercent += 0.01;
    } else {
        // noLoop();
    }
};

let noLoop = function () {
    canvasInfo.noLoopFlag = true;
};

const sinWave = function (c = 0, color = 'rgba(0,0,255,0.5)', p = 0.5) {
    const { a, t, r } = paintInfo;
    // y = a*sin(w*x+c)
    // a 振幅
    // w 波浪宽度计算量
    // c 横向偏移量
    // 计算w w = 2pi/tr
    const w = (2 * Math.PI) / (t * r);

    // x,y坐标在画布上的偏移量
    const dx = canvasInfo.width / 2 - r;
    const dy = canvasInfo.height / 2 + r;

    const { ctx } = canvasInfo;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    let path = new Path2D();
    path.moveTo(dx, dy);
    for (let x = 0; x <= 2 * r; x += 0.01) {
        let y = a * Math.sin(w * x + c);

        let sx = dx + x;
        let sy = dy - y - p * r * 2;
        if (sy > dy) {
            sy = dy;
        } else if (sy < dy - 2 * r) {
            sy = dy - 2 * r;
        }

        // console.log({ sx, sy });

        path.lineTo(sx, sy);
    }

    path.lineTo(dx + 2 * r, dy);
    path.closePath();
    // roundClip();
    ctx.fill(path);
    restore();
};

const wave1 = () => {
    paintInfo.x1 += 0.2;
    if (paintInfo.x1 >= 300) {
        paintInfo.x1 = 1;
    }
    sinWave(paintInfo.x1, 'rgba(0,0,128,1)', paintInfo.loadingPercent);
};

const wave2 = () => {
    paintInfo.x2 -= 0.15;
    if (paintInfo.x2 <= -300) {
        paintInfo.x2 = 1.5;
    }
    sinWave(paintInfo.x2, 'rgba(135,206,235,0.5)', paintInfo.loadingPercent);
};

const wave3 = () => {
    paintInfo.x3 += 0.1;
    if (paintInfo.x3 >= 300) {
        paintInfo.x3 = 22;
    }
    sinWave(paintInfo.x3, 'rgba(0,0,64,1)', paintInfo.loadingPercent);
};

let roundClip = () => {
    let pc = new Path2D();
    pc.arc(canvasInfo.width / 2, canvasInfo.height / 2, paintInfo.r, 0, 360);
    clip(pc);
};

let roundClip2 = () => {
    const { a, t, r } = paintInfo;
    // x,y坐标在画布上的便宜两
    const dx = canvasInfo.width / 2 - r;
    const dy = canvasInfo.height / 2 + r;
    // let maskColor = 'rgba(255,255,255,1)';
    let maskColor = 'rgba(0,0,0,1)';
    pologyon(maskLeftTop(), maskColor);
    pologyon(maskRightTop(), maskColor);
    pologyon(maskLeftBottom(), maskColor);
    pologyon(maskRightBottom(), maskColor);
    restore();
};

let maskLeftTop = () => {
    const { a, t, r } = paintInfo;
    // x,y坐标在画布上的便宜两
    const dx = canvasInfo.width / 2 - r;
    const dy = canvasInfo.height / 2 + r;

    let p1 = makePoint(dx + r, dy - 2 * r);
    let p2 = makePoint(dx, dy - 2 * r);
    let p3 = makePoint(dx, dy - r);
    return makeQuaterCircle(p1, p2, p3);
};

let maskRightTop = () => {
    const { a, t, r } = paintInfo;
    // x,y坐标在画布上的便宜两
    const dx = canvasInfo.width / 2 - r;
    const dy = canvasInfo.height / 2 + r;

    let p1 = { x: dx + r, y: dy - 2 * r };
    let p2 = { x: dx + 2 * r, y: dy - 2 * r };
    let p3 = { x: dx + 2 * r, y: dy - r };

    return makeQuaterCircle(p1, p2, p3);
};

let maskLeftBottom = () => {
    const { r } = paintInfo;
    // x,y坐标在画布上的便宜两
    const dx = canvasInfo.width / 2 - r;
    const dy = canvasInfo.height / 2 + r;

    let p1 = makePoint(dx, dy - r);
    let p2 = makePoint(dx, dy);
    let p3 = makePoint(dx + r, dy);

    return makeQuaterCircle(p1, p2, p3);
};

let maskRightBottom = () => {
    const { r } = paintInfo;
    // x,y坐标在画布上的便宜两
    const dx = canvasInfo.width / 2 - r;
    const dy = canvasInfo.height / 2 + r;

    let p1 = makePoint(dx + r, dy);
    let p2 = makePoint(dx + 2 * r, dy);
    let p3 = makePoint(dx + 2 * r, dy - r);

    return makeQuaterCircle(p1, p2, p3);
};

let makePoint = (x, y) => {
    return { x, y };
};

let makeQuaterCircle = (p1, p2, p3) => {
    const { r } = paintInfo;
    let p = new Path2D();
    p.moveTo(p1.x, p1.y);
    p.lineTo(p2.x, p2.y);
    p.lineTo(p3.x, p3.y);
    p.arcTo(p2.x, p2.y, p1.x, p1.y, r);
    return p;
};

let clip = (path) => {
    const { ctx } = canvasInfo;
    ctx.clip(path);
    // restore();
};

let pologyon = (path, color) => {
    const { ctx } = canvasInfo;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    // console.log(`pologyon lineWidth is ${ctx.lineWidth}`);
    ctx.lineWidth = 1;
    ctx.fill(path);
    ctx.stroke(path);
    restore();
};

// degree 角度0~360读，0度在12点方向
let strokeCircle = (color, degree) => {
    const { r, circleStrokeLineWidth } = paintInfo;
    // 角度换算 canvas画arc时，角度是弧度制，并且0度角在3点方向
    const startAngle = -0.5 * Math.PI;
    const endAngle = (Math.PI * (degree - 90)) / 180;

    const { ctx } = canvasInfo;
    ctx.lineWidth = circleStrokeLineWidth;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(
        canvasInfo.width / 2,
        canvasInfo.height / 2,
        r + (circleStrokeLineWidth / 2) * 1.1,
        startAngle,
        endAngle
    );
    ctx.stroke();
    restore();
};

let text = (text, color = 'rgba(255,255,255,1)') => {
    let fontSize = 48;
    const { ctx } = canvasInfo;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvasInfo.width / 2, canvasInfo.height / 2);

    restore();
};

$(document).ready(function () {
    initCanvas();
    render();
});
