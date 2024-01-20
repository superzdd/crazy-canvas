/**
 * 小球类，实现小球的逐帧运动
 * @param {int} x 圆心的x坐标(px) 圆心坐标(0,0)为屏幕左上角
 * @param {int} y 圆心的y坐标(px) 圆心坐标(0,0)为屏幕左上角
 * @param {int} rad 半径
 * @param {int} s_x 水平方向移动速度(px/帧)
 * @param {int} s_y 垂直方向移动速度(px/帧)
 * @param {object} winSize 屏幕尺寸
 * @param {int} winSize.width 屏幕宽度
 * @param {int} winSize.height 屏幕高度
 */
let ball = function (x = 0, y = 0, rad, s_x = 1, s_y = 1, $ball, winSize) {
  this.org_x = x; // 初始圆心横坐标
  this.org_y = y; // 初始圆心纵坐标
  this.org_x_percent = x / winSize.width;
  this.org_y_percent = y / winSize.height;
  this.rad = rad; // 半径
  this.d_x = 0; // 水平方向运动距离
  this.d_y = 0; // 垂直方向运动距离
  this.s_x = s_x; // 水平方向运动速度
  this.s_y = s_y; // 垂直方向运动速度
  this.$ball = $ball;
  this.winSize = winSize;
  this.life = 10000;
  this.born = Date.now();
  this.needDestory = false;

  /**
   * 小球逐帧运动
   * @param {object} winSize 屏幕尺寸
   * @param {int} winSize.width 屏幕宽度
   * @param {int} winSize.height 屏幕高度
   */
  this.render = function () {
    if (this.needDestory || Date.now() - this.born > this.life) {
      this.needDestory = true;
      $ball.remove();
    }

    this.d_x += this.s_x;
    this.d_y += this.s_y;

    // 碰撞检测
    // 如果球触碰到了屏幕边缘，对应方向速度取反
    // 获取当前圆心坐标
    let act_x = this.org_x + this.d_x;
    let act_y = this.org_y + this.d_y;
    let winSize = this.winSize;

    if (act_x - this.rad <= 0 || act_x + this.rad >= winSize.width) {
      this.s_x *= -1;
    }

    if (act_y - this.rad <= 0 || act_y + this.rad >= winSize.height) {
      this.s_y *= -1;
    }

    this.$ball.css({
      transform: `translateX(${this.d_x}px) translateY(${this.d_y}px)`,
    });
  };

  this.updateWinSize = function (winSize) {
    this.winSize = winSize;
    this.org_x = winSize.width * this.org_x_percent;
    this.org_y = winSize.height * this.org_x_percent;
  };
};

let rem = new Rem();
rem.getWindowSize();

let appData = {
  lastRenderTime: 0,
  renderInterval: 1000 / 120,
};

let appView = {
  ballList: [],
  init: function () {
    let b = new ball(rem.width / 2, rem.height / 2, 50, 10, 10, $('#ball-org'), rem);
    appView.ballList.push(b);

    appView.startRender();

    $(window).resize(function () {
      rem.getWindowSize();
      appView.updateBalls();
    });

    $(document).click(function (e) {
      appView.createNewBall(e);
    });
  },
  createNewBall: function (e) {
    const radius = 50;
    const diameter = radius * 2;
    let x = e.clientX;
    let y = e.clientY;
    let s_x = 20 - Math.random() * 40;
    if (x <= radius) {
      if (s_x < 0) {
        s_x = s_x * -1;
      }
      x = radius;
    } else if (x >= rem.width - radius) {
      if (s_x > 0) {
        s_x = s_x * -1;
      }
      x = rem.width - radius;
    }

    let s_y = 20 - Math.random() * 40;
    if (y <= radius) {
      if (s_y < 0) {
        s_y = s_y * -1;
      }
      y = radius;
    } else if (y >= rem.height - radius) {
      if (s_y > 0) {
        s_y = s_y * -1;
      }
      y = rem.height - radius;
    }
    let id = `b${Date.now()}`;
    let dom = `<div class="ball" id="${id}" style="left:${x - 50}px;top:${
      y - 50
    }px;background-color:rgb(${appView.random255()},${appView.random255()},${appView.random255()})"></div>`;
    $('body').append(dom);

    let b = new ball(x, y, 50, s_x, s_y, $('#' + id), rem);
    appView.ballList.push(b);

    console.log({
      x,
      y,
      s_x,
      s_y,
    });
  },
  startRender: function () {
    let now = Date.now();
    if (now - appData.lastRenderTime >= appData.renderInterval) {
      appData.lastRenderTime = now;
      for (let i = 0; i < appView.ballList.length; i++) {
        let ball = appView.ballList[i];
        if (ball.needDestory) {
          appView.ballList.splice(i, 1);
          i--;
          continue;
        } else {
          ball.render();
        }
      }
    }
    requestAnimationFrame(appView.startRender);
  },
  updateBalls: function (winSize) {
    for (let i = 0; i < appView.ballList.length; i++) {
      appView.ballList[i].updateWinSize(rem);
    }
  },
  random255: function () {
    return Math.floor(Math.random() * 256);
  },
};

$(document).ready(function () {
  appView.init();
});
