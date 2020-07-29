var rem = new Rem();
rem.makeRem();

let data = {
  lightOn: false,
};

let view = {
  $svg: $('svg'),
  $ripple: $('.ripple'),
  $ripples: $('#ripples'),
  init: function () {
    view.$svg.click(function (e) {
      let svgPoint = view.svgPoint(e.clientX, e.clientY);
      let $newRipple = view.$ripple.clone();
      let $ani = $newRipple.find('animate');
      $newRipple.endAniNum = 0;
      $newRipple.myOnEnd = function () {
        if (++$newRipple.endAniNum == $ani.length) {
          $newRipple.remove();
        }
      };
      view.$ripples.append($newRipple);
      $newRipple.attr('transform', `translate(${svgPoint.x},${svgPoint.y})`);

      $ani.each(function (i) {
        $ani[i].oneed = $newRipple.myOnEnd;
        $ani[i].beginElement();
      });
    });
  },
  svgPoint(x, y) {
    let matrix = view.$svg[0].getScreenCTM().inverse();
    let svgPoint = view.$svg[0].createSVGPoint();
    svgPoint.x = x;
    svgPoint.y = y;

    return svgPoint.matrixTransform(matrix);
  },
};

$(document).ready(function () {
  view.init();
});

$(window).resize(function () {
  rem.makeRem();
});
