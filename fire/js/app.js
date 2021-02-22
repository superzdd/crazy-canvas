let rem = new Rem();
rem.getWindowSize();

let appData = {};

let appView = {
	$born1: $('.born-1'),
	$born2: $('.born-2'),
	$born3: $('.born-3'),
	$born4: $('.born-4'),
	$born5: $('.born-5'),
	$burn: $('.burn'),
	ballList: [],
	init: function() {
		// appView.createFire(appView.$born1, 1);
		// appView.createFire(appView.$born2, 100);
		// appView.createFire(appView.$born3, 100);
		appView.createFire(appView.$born4, 50, 15);
		appView.createFire(appView.$born5, 30, 10, {
			right: true
		});
		for (let i = 1; i <= 28; i++) {
			let $con = $(`.b-${i}`);
			appView.createFire($con, 15, 8);
		}

		// appView.createFire(appView.$born5, 100);
	},
	createFire: function($container, count = 1, radiusBase = 10, option = {
		left: false,
		right: false,
		up: false
	}) {
		const {
			random
		} = appView;
		while (count > 0) {
			count--;
			const dur = 2;
			const transformOG = random();
			const r = random(radiusBase) + radiusBase;
			const x = random(100);
			const y = random(100);
			const left = `calc(${x}% - ${r/2}px)`;
			const top = `calc(${y}% - ${r/2}px)`;
			const born = random(dur);
			const ani = `blink-${Math.floor(random(2))+1}`

			let dom =
				`<div class="particle" style="width: ${Math.round(r*80)/100}px;height: ${r}px;left: ${left};top: ${top};animation: ${ani} ${dur}s linear ${born}s infinite;"></div>`;

			if (option.right) {
				dom =
					`<div class="particle particle--transparent" style="width: ${Math.round(r*80)/100}px;height: ${r}px;left: ${left};top: ${top};animation: boom-right ${dur}s linear ${born}s infinite;">
						<div class="particle particle--bright" style="width: 100%;height: 100%;left: 0;top: 0;animation: ${ani} ${dur}s linear ${born}s infinite;">
						</div>
					</div>`
			}

			$container.append(dom);
		}
	},
	random: function(max = 100) {
		return Math.floor(Math.random() * (max + 1) * 100) / 100;
	},
};

$(document).ready(function() {
	appView.init();
});
