let rem = new Rem();
rem.getWindowSize();

let appData = {
	currentTime: null,
	currentCalcStr: '',
	currentNum: '',
	currentAns: '', // 记录当前运算结果
};

let appView = {
	$dateWrapper: $('.date-wrapper'),
	$h1: $('.h1'),
	$h2: $('.h2'),
	$m1: $('.m1'),
	$m2: $('.m2'),
	$s1: $('.s1'),
	$s2: $('.s2'),
	$days: $('.days'),
	$num: $('.num'),
	$cdot: $('.cdot'),
	$op: $('.op'),
	$ac: $('.ac'),
	$screenNums: null,
	$screenCalculator: $('.screen-calculator'),
	calculatorNumCount: 0, // 液晶屏上数字的数量，每次页面初始化时会赋值
	$formula: $('.formula'),
	numClasses: {
		h1: '',
		h2: '',
		m1: '',
		m2: '',
		s1: '',
		s2: '',
	},
	lastClick: new CalcClick(),
	init: function() {
		appData.currentTime = new Date();
		appView.initNums();
		appView.render();
		setInterval(() => {
			appData.currentTime = new Date();
			appView.render();
		}, 1000);

		appView.$num.click(appView.numClickHandler);
		appView.$cdot.click(appView.numClickHandler);
		appView.$op.click(appView.opClickHandler);
		appView.$ac.click(appView.acClickHandler);
	},
	initNums: function() {
		let screenWidth = appView.$screenCalculator.width();
		let {
			barWidth,
			barHeight,
			numMargin
		} = _lcdDigit;
		console.log({
			screenWidth,
			barWidth,
			barHeight
		});

		let count = Math.floor(screenWidth / (barWidth + numMargin * 2 + barHeight * 2 + 5)); // 5是配置了一个安全距离
		appView.calculatorNumCount = count;
		let $calculatorNumContainer = $('.screen-calculator .num-wrapper');
		for (let i = 0; i < count; i++) {
			let $num = $(LCDDigitHtml());
			$calculatorNumContainer.append($num);
		}

		setTimeout(() => {
			appView.$screenNums = $('.screen-calculator .num-wrapper .num');
		}, 1);
	},
	numClickHandler(e) {
		console.log(`===numClickHandler, ${e.target.innerText}`);
		var num = e.target.innerText;

		if (appView.lastClick.isAC() || appView.lastClick.isRES()) {
			appData.currentCalcStr = num;
		} else {
			appData.currentCalcStr += num;
		}

		if (appView.lastClick.isNotNumber()) {
			appData.currentNum = num;
		} else {
			appData.currentNum += num;
		}

		appView.lastClick.set(num);
		appView.renderScreenCalculator();
	},
	opClickHandler(e) {
		console.log(`===opClickHandler, ${e.target.innerText}`);
		var op = e.target.innerText.toLowerCase();

		// 切换操作符
		switch (op) {
			case '×':
				op = CALC_BTNS.OP_MULTI;
				break;
			case '÷':
				op = CALC_BTNS.OP_DIV;
				break;
			default:
				break;
		}

		switch (op) {
			case CALC_BTNS.OP_ADD:
			case CALC_BTNS.OP_MINUS:
			case CALC_BTNS.OP_MULTI:
			case CALC_BTNS.OP_DIV:
				if (appView.lastClick.isAC() || appView.lastClick.isRES()) {
					appData.currentCalcStr = appData.currentAns + op;
				} else if (!appView.lastClick.isNotNumber()) {
					appData.currentCalcStr += op;
				}
				break;
			case CALC_BTNS.OP_RES:
				let result = calculate(appData.currentCalcStr);
				appData.currentNum = '' + result;
				appData.currentAns = '' + result;
				break;
			case CALC_BTNS.OP_ANS:
				appData.currentNum = appData.currentAns;
				break;
		}

		appView.lastClick.set(op);
		appView.renderScreenCalculator();
	},
	acClickHandler(e) {
		console.log(`===acClickHandler, ${e.target.innerText}`);
		var op = e.target.innerText.toLowerCase();

		switch (op) {
			case CALC_BTNS.OP_AC:
				appData.currentNum = '';
				appData.currentCalcStr = '';
				break;
			case CALC_BTNS.OP_DEL:
				let {
					calc,
					num
				} = appView.opDEL(appData.currentCalcStr, appData.currentNum, appView.lastClick);
				appData.currentNum = num;
				appData.currentCalcStr = calc;
				break;
		}

		appView.lastClick.set(op);
		appView.renderScreenCalculator();
	},
	/**
	 * 执行删除按钮逻辑
	 */
	opDEL(calc, num, lastInput) {
		// 删除按钮只会在上次输入是数字的时候才会有效
		if (lastInput.isNotNumber()) {
			return {
				calc,
				num
			};
		}

		if (calc.length > 0 && num.length > 0) {
			calc = calc.substr(0, calc.length - 2);
			num = num.substr(0, num.length - 2);
		}

		return {
			calc,
			num
		};
	},
	renderCalculator() {
		let str = appData.currentCalcStr;
	},
	render() {
		appView.renderScreenDay();
		// appView.renderScreenCalculator();
	},
	renderScreenDay() {
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
	renderScreenCalculator() {
		// 渲染公式
		if (!appData.currentCalcStr) {
			appView.$formula.text('');
		}
		console.log(`===renderScreenCalculator formula: ${appData.currentCalcStr}`);
		appView.$formula.text(appData.currentCalcStr);

		// 渲染下方液晶数字
		console.log(`===renderScreenCalculator num: ${appData.currentNum}`);
		let strNum = appData.currentNum;
		let {
			$screenNums: $numsArr
		} = appView;

		// 初始化液晶点阵
		for (let i = 0; i <= $numsArr.length; i++) {
			let $unit = $($numsArr[i]);
			$unit.removeClass();
			$unit.addClass(`num`);
		}

		if (strNum.length < 1) {
			return;
		}

		// 开始渲染数字
		// 是否为ERROR
		// 数字长度是否大于液晶屏长度？如果过长，要截取

		// 截取
		strNum = appView.subStrScreenNumber(strNum, appView.calculatorNumCount);
		console.log(`===renderScreenCalculator render num: ${strNum}`);

		let addDotFlag = false;
		for (let i = 0, j = strNum.length - 1; i < $numsArr.length; i++, j--) {
			let $unit = $($numsArr[i]);
			let num = strNum[j];

			if (!num && num != CALC_BTNS.NUM_DOT) {
				break;
			}

			if (num == CALC_BTNS.NUM_DOT) {
				addDotFlag = true;
				--i;
				continue;
			}

			let numClass = appView.generateClass(num);
			$unit.removeClass();
			$unit.addClass(`num ${numClass}`);
			if (addDotFlag) {
				addDotFlag = false;
				$unit.addClass(`num--dot`);
			}
		}
	},
	generateClass(num) {
		if (num.length != 1) {
			return '';
		}
		let transname = '';
		let n = num.toLowerCase();
		switch (n) {
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
			case '-':
				transname = 'minus';
				break;
			case 'e':
			case 'r':
			case 'o':
			case 'l':
			case 'n':
			case 'g':
				transname = n;
				break;
		}

		return `num num--${transname}`;
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
		console.log(`===renderDay ${idx}`);
		// Sunday - Saturday : 0 - 6
		appView.$dateWrapper.text(['SUN','MON','TUE','WED','THU','FRI','SAT'][idx]);

		// appView.$days.children().each(function(i) {
		// 	if (idx === i) {
		// 		$(this).removeClass().addClass('highlight');
		// 	} else {
		// 		$(this).removeClass();
		// 	}
		// });
	},
	/**
	 * 屏幕数字截取
	 * @param {String} strNum
	 * @param {Number} maxLength
	 */
	subStrScreenNumber(strNum, maxLength) {
		// 如果整数部分长度大于屏幕长度，返回LONG
		// 如果LONG都显示不下，返回L
		// 否则截取小数部分(fixed)，并返回

		let strLength = strNum.replace('.', '').length;
		if (strLength <= maxLength) {
			return strNum;
		}

		let intLen = (parseFloat(strNum) / 10).toFixed(0).length + 1;

		if (intLen > maxLength) {
			return maxLength >= SCREEN_TEXT.LONG.length ? SCREEN_TEXT.LONG : SCREEN_TEXT.L;
		}

		return parseFloat(strNum).toFixed(maxLength - intLen);
	},
};

$(document).ready(function() {
	appView.init();
});
