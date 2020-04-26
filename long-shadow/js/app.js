let rem = new Rem();
rem.getWindowSize();

let appData = {
	lastRenderTime: 0,
	renderInterval: 1000 / 120,
	shadow: {
		length: 15,
		color: '#2274b2',
		offset: {
			x: 1,
			y: 1,
		}
	},
	center: {
		x: 0,
		y: 0
	},
	mouseMoveHandlerEnable: true,
}

let appView = {
	init: function() {
		appData.center.x = rem.width / 2;
		appData.center.y = rem.height / 2;

		$(document).mousemove(appView.mouseMoveHandler);
	},
	mouseMoveHandler: function(e) {
		if (!appData.mouseMoveHandlerEnable) {
			return;
		}

		appData.mouseMoveHandlerEnable = false;
		setTimeout(() => {
			appData.mouseMoveHandlerEnable = true;
		}, 16);

		const mX = e.clientX;
		const mY = e.clientY;
		const center = appData.center;

		let deltaX = mX - center.x;
		let deltaY = mY - center.y;

		if (deltaX == 0 && deltaY == 0) {
			appData.shadow.offset.x = 0;
			appData.shadow.offset.x = 0;
			return;
		}

		let d = ((mX - center.x) ** 2 + (mY - center.y) ** 2) ** 0.5;
		appData.shadow.length = Math.max(d, 15);
		appData.shadow.length = Math.min(appData.shadow.length, 35);
		appData.shadow.offset.x = (mX - center.x) / (d);
		appData.shadow.offset.y = (mY - center.y) / (d);

		appView.render();
	},
	render: function() {
		const shadow = appData.shadow;
		let shadowStr = '';
		let step = Math.min(1,shadow.length / 100);
		for (let i = 1; i <= 100; i++) {
			shadowStr += `${step*appData.shadow.offset.x*i}px ${step*appData.shadow.offset.y*i}px ${step}px ${shadow.color},`;
			// shadowStr += `${step*appData.shadow.offset.x*i*(-1)}px ${step*appData.shadow.offset.y*i}px ${step}px ${shadow.color},`;
			// shadowStr += `${step*appData.shadow.offset.x*i}px ${step*appData.shadow.offset.y*i*(-1)}px ${step}px ${shadow.color},`;
			// shadowStr += `${step*appData.shadow.offset.x*i*(-1)}px ${step*appData.shadow.offset.y*i*(-1)}px ${step}px ${shadow.color},`;
		}

		shadowStr = shadowStr.substring(0, shadowStr.length - 1);

		// 修改一个 Dom 节点上的 CSS 变量
		document.body.style.setProperty("--shadow-str", shadowStr);
	}
}

$(document).ready(function() {
	appView.init();
})
