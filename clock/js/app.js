let rem = new Rem();
rem.getWindowSize();

let appData = {
	currentTime: null,
	currentCalcStr: '',
};

let appView = {
	$h1: $('#h1'),
	$h2: $('#h2'),
	$m1: $('#m1'),
	$m2: $('#m2'),
	$s1: $('#s1'),
	$s2: $('#s2'),
	$days: $('.days'),
	$num: $('.num'),
	numClasses: {
		h1: '',
		h2: '',
		m1: '',
		m2: '',
		s1: '',
		s2: '',
	},
	init: function() {
		appData.currentTime = new Date();
		appView.render();
		setInterval(() => {
			appData.currentTime = new Date();
			appView.render();
		}, 1000);

		appView.$num.click(function(e) {
			appView.numClickHandler(e);
		})
	},
	numClickHandler(e) {
		console.log('===numClickHandler');
		console.log(e.target.innerText);
		var num = e.target.innerText;
		appData.currentCalcStr += num;
	},
	renderCalculator(){
		let str = appData.currentCalcStr;
	},
	render() {
		const ct = appData.currentTime;
		const h = ct.getHours();
		const m = ct.getMinutes();
		const s = ct.getSeconds();
		const day = ct.getDay();
		// console.log({h,m,s});

		const {
			getDigit,
			setNumClass,
			generateClass,
			renderDay
		} = appView;
		const c_h1 = generateClass(getDigit(h, 1));
		const c_h2 = generateClass(getDigit(h, 0));
		const c_m1 = generateClass(getDigit(m, 1));
		const c_m2 = generateClass(getDigit(m, 0));
		const c_s1 = generateClass(getDigit(s, 1));
		const c_s2 = generateClass(getDigit(s, 0));

		setNumClass('h1', c_h1);
		setNumClass('h2', c_h2);
		setNumClass('m1', c_m1);
		setNumClass('m2', c_m2);
		setNumClass('s1', c_s1);
		setNumClass('s2', c_s2);
		renderDay(day);
	},
	generateClass(num) {
		if (num.length != 1 || isNaN(num)) {
			return '';
		}
		let transname = '';
		switch (num) {
			case '0':
				transname = 'zero';
				break;
			case '1':
				transname = 'one';
				break;
			case '2':
				transname = 'two';
				break;
			case '3':
				transname = 'three';
				break;
			case '4':
				transname = 'four';
				break;
			case '5':
				transname = 'five';
				break;
			case '6':
				transname = 'six';
				break;
			case '7':
				transname = 'seven';
				break;
			case '8':
				transname = 'eight';
				break;
			case '9':
				transname = 'nine';
				break;
		}

		return 'num--' + transname;
	},
	/**
	 * 获取数字某一位上的值
	 * @param {Object} num
	 * @param {number} index 0个位 1十位，以此类推
	 */
	getDigit(num, index) {
		let strNum = '' + num;
		if ((index + 1) > strNum.length) {
			return '0';
		}

		return strNum[strNum.length - index - 1];
	},
	setNumClass(num, cls) {
		appView['$' + num].removeClass(appView.numClasses[num]).addClass(cls);
		appView.numClasses[num] = cls;
	},
	renderDay(idx) {
		// Sunday - Saturday : 0 - 6
		if (idx === 0) {
			idx = 6;
		} else {
			idx -= 1;
		}

		appView.$days.children().each(function(i) {
			if (idx === i) {
				$(this).removeClass().addClass('highlight');
			} else {
				$(this).removeClass();
			}
		});
	}
};

$(document).ready(function() {
	appView.init();
});
