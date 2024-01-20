/**
 * AccNumber
 * 清除js浮点数精度问题
 */
var AccNumber = function() {}

AccNumber.prototype.isInteger = function(n) {
	return Math.floor(n) === n;
}

AccNumber.prototype.toInteger = function(n) {
	var r1;
	try {
		r1 = n.toString().split(".")[1].length;
	} catch (e) {
		r1 = 0;
	}

	return {
		integer: n * Math.pow(10, r1),
		times: r1
	}
}

AccNumber.prototype.add = function(n1, n2) {
	var intN1 = this.toInteger(n1);
	var intN2 = this.toInteger(n2);

	let m = Math.max(intN1.times, intN2.times);
	let times = Math.pow(10, m);

	return (n1 * times + n2 * times) / times;
}

AccNumber.prototype.minus = function(n1, n2) {
	var intN1 = this.toInteger(n1);
	var intN2 = this.toInteger(n2);

	let m = Math.max(intN1.times, intN2.times);
	let times = Math.pow(10, m);

	return (n1 * times - n2 * times) / times;
}

AccNumber.prototype.multi = function(n1, n2) {
	var intN1 = this.toInteger(n1);
	var intN2 = this.toInteger(n2);

	let times = Math.pow(10, intN1.times + intN2.times);

	return (intN1.integer * intN2.integer) / times;
}

AccNumber.prototype.div = function(n1, n2) {
	var intN1 = this.toInteger(n1);
	var intN2 = this.toInteger(n2);

	let times = Math.pow(10, intN2.times - intN1.times);

	return (intN1.integer / intN2.integer) * times;
}

// test
// var testList = [
// 	['add', 1,2,3],
// 	['add', 0.1,0.2,0.3],
// 	['minus', 1,2,-1],
// 	['minus', 0.1,0.2,-0.1],
// 	['multi', 1,2,2],
// 	['multi', 0.1,0.2,0.02],
// 	['div', 6,2,3],
// 	['div', 0.6,0.2,3],
// ]

// var an = new AccNumber();
// testList.forEach((ele)=>{
// 	let result = an[ele[0]](ele[1],ele[2]);
// 	console.log(`*** AccNumber ${JSON.stringify(ele)}, result is ${result}, ${result == ele[3]} ***`);
// })
