var FORMULA_TYPE = {
	NUM: 0,
	OP: 1,
}

var CALC_BTNS = {
	NUM_0: '0',
	NUM_1: '1',
	NUM_2: '2',
	NUM_3: '3',
	NUM_4: '4',
	NUM_5: '5',
	NUM_6: '6',
	NUM_7: '7',
	NUM_8: '8',
	NUM_9: '9',
	NUM_DOT: '.',
	NUM_00: '00',
	OP_DEL: 'del',
	OP_AC: 'ac',
	OP_ADD: '+',
	OP_MINUS: '-',
	OP_MULTI: '*',
	OP_DIV: '/',
	OP_ANS: 'ans',
	OP_RES: '=',

}

var SCREEN_TEXT = {
	LONG: 'LONG',
	L: 'L',
	ERROR: 'ERROR',
	E: 'E',
}

/**
 * 计算器按钮对象
 * 记录按下的按钮，并提供该按钮的一些判断方法
 */
var CalcClick = function(btn) {
	this.btn = '';
	if (btn) {
		this.btn = btn;
	}

	this.set = function(btn) {
		this.btn = btn;
	}

	this.get = function() {
		return this.btn;
	}

	this.isAC = function() {
		return this.btn == CALC_BTNS.OP_AC;
	}

	this.isRES = function() {
		return this.btn == CALC_BTNS.OP_RES;
	}

	this.isNumber = function() {
		switch (this.btn) {
			case CALC_BTNS.NUM_0:
			case CALC_BTNS.NUM_00:
			case CALC_BTNS.NUM_1:
			case CALC_BTNS.NUM_2:
			case CALC_BTNS.NUM_3:
			case CALC_BTNS.NUM_4:
			case CALC_BTNS.NUM_5:
			case CALC_BTNS.NUM_6:
			case CALC_BTNS.NUM_7:
			case CALC_BTNS.NUM_8:
			case CALC_BTNS.NUM_9:
			case CALC_BTNS.NUM_DOT:
				return true;
		}

		return false;
	}

	this.isNotNumber = function() {
		return !this.isNumber();
	}
}

var REPLACE_FLAG = 'RF'; // 用于算式中的括号计算替换标识符

var AN = new AccNumber();

// 计算器入口：执行公式计算
function calculate(formula) {
	console.log(`===calculate: ${formula}`);
	// 先把公式拆分成数组
	// 再计算括号里的内容，如果括号里还有括号，继续往里计算
	// 先乘除，后加减

	let array = [];
	if (Array.isArray(formula)) {
		array = [].concat(formula);
	} else {
		array = getFormulaArr(formula);
	}

	while (array.indexOf('(') >= 0) {
		let {
			newArray,
			bracketArray,
			leftIndex
		} = getBracketArray(array);

		let ret = calculate(bracketArray);

		newArray[leftIndex] = ret;
		array = newArray;
	}

	for (let i = 0; i < array.length; i++) {
		let u = array[i];
		if (u == '*' || u == '/') {
			array = shrinkByOp(array, u);
			i = 0;
		}
	}

	for (let i = 0; i < array.length; i++) {
		let u = array[i];
		if (u == '+' || u == '-') {
			array = shrinkByOp(array, u);
			i = 0;
		}
	}
	console.log(`===calculate: ${formula}, result is ${array[0]}`);
	return array[0];
}

// 计算器内部方法：提取带括号的部分
function getBracketArray(array) {
	// console.log(`====getBracketArray: array: ${JSON.stringify(array)}`);
	let leftCount = 0;
	let rightCount = 0;
	let leftIndex = -1; // 左括号的坐标，如果最后找不到，会主动抛出异常
	let rightIndex = -1; // 右括号的坐标，如果最后找不到，会主动抛出异常

	for (let i = 0; i < array.length; i++) {
		let unit = array[i];

		if (unit == '(') {
			++leftCount;
			if (leftIndex == -1) {
				leftIndex = i;
			}
		}

		if (unit == ')') {
			++rightCount;
			if (rightCount == leftCount) {
				rightIndex = i;
				break;
			}
		}
	}

	if (leftIndex == -1) {
		throw 'getBracketArray, can not find left bracket';
	}

	if (rightIndex == -1) {
		throw 'getBracketArray, can not find right bracket';
	}

	// 得到带括号的算式，要把左右括号去掉
	let bracketArray = array.slice(leftIndex + 1, rightIndex);

	// 得到新的完整数组，原先括号的部分被替换为标识符
	let newArray = array.slice(0, leftIndex).concat([REPLACE_FLAG])
	if (rightIndex <= array.length) {
		newArray.concat(array.slice(rightIndex + 1));
	}

	// console.log(`====getBracketArray: array: ${JSON.stringify({
	// 	newArray,
	// 	bracketArray,
	// 	leftIndex
	// })}`);

	return {
		newArray,
		bracketArray,
		leftIndex
	}
}

function shrinkByOp(array, op) {
	// console.log(`====shrinkByOp: array: ${JSON.stringify(array)}, op: ${op}`);
	if (array.indexOf(op) < 0) {
		return array;
	}

	let i = array.indexOf(op);
	let n1 = 0;
	let n2 = 0;
	if (i == 0) {
		n2 = array[1];
	} else {
		n1 = array[i - 1];
		n2 = array[i + 1];
	}
	let ret = twoResult(n1, n2, op);

	if (i == 0) {
		array = [ret].concat(array.slice(2));
	} else {
		array = array.slice(0, i - 1).concat(ret).concat(array.slice(i + 2));
	}

	return array;
}

function getFormulaArr(formula) {
	// console.log(`====getFormulaArr: formula: ${formula}`);
	if (!formula) return [0];
	let ret = [];
	let retLen = 0;
	let retLastType = null;
	let arr = formula.split('');
	for (let i = 0; i < arr.length; i++) {
		let u = arr[i];

		if (isNaN(u) && u != '.') {
			ret.push(u);
			++retLen;
			retLastType = FORMULA_TYPE.OP;
		} else {
			if (retLastType != null && retLastType == FORMULA_TYPE.NUM) {
				ret[retLen - 1] += u;
			} else {
				ret.push(u);
				++retLen;
			}
			retLastType = FORMULA_TYPE.NUM;
		}
	}

	return ret;
}

function twoResult(n1, n2, op) {
	// console.log(`====twoResult: n1: ${n1},n2: ${n2},op: ${op}`);
	let a = parseFloat(n1);
	let b = parseFloat(n2);
	switch (op) {
		case '+':
			return AN.add(a, b);
		case '-':
			return AN.minus(a, b);
		case '*':
			return AN.multi(a, b);
		case '/':
			return AN.div(a, b);
	}
}

/**
 * 单元测试
 */

var testList = [
	// ['1+2', 3],
	['1.1+2', 3.1],
	// ['1+2-3', 0],
	// ['1+2-3+4', 4],
	// ['2431+5672-32+54', 8125],
	// ['1+2-3*4', -9],
	// ['1+2-3*4/5', 0.6],
	// ['(1+2)', 3],
	// ['1-(2+3)', -4],
	// ['1-(2+3*5-(2/9))', -15.77777778],
	// ['1-(2+3*5-(2/(-9)))', -16.22222222222222],
	// ['1-(2+3*5-(2/9)', 'getBracketArray, can not find right bracket'],
]

testList.forEach((e) => {
	let result = calculate(e[0]);
	console.log(`*** result = ${e[1]} ? ${result == e[1]} ***`);
})
