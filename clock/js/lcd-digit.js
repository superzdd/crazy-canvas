/**
 * 液晶管数字
 */
var LCDDight = function() {
	this.barWidth = 0;
	this.barHeight = 0;
	this.numMargin = 3; // px
	this.init = function() {
		let {
			innerWidth: w,
			innerHeight: h
		} = window;
		let screenHeight = parseInt(document.documentElement.style.fontSize.replace('px', '')) * 8; // 液晶屏幕高度：8rem 固定高度
		// document.documentElement.style['--screen-h'] = '8rem';
		document.documentElement.style.setProperty('--screen-h', '8rem');
		this.barHeight = Math.floor(screenHeight / 18);
		this.barWidth = this.barHeight * 4;
	}
};

window._lcdDigit = new LCDDight();
_lcdDigit.init();

/**
 * 返回生成液晶管数字的html
 */
var LCDDigitHtml = function() {
	return `<div class="num">
				<div class="bar top"></div>
				<div class="bar up left"></div>
				<div class="bar up right"></div>
				<div class="bar middle"></div>
				<div class="bar down left"></div>
				<div class="bar down right"></div>
				<div class="bar bottom"></div>
			</div>`;
}
