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
      for (let i = 0; i < 20; i++) {
        (function (e) {
          view.newWave(e);
        })(e);
      }
    });
  },
  svgPoint(x, y) {
    let matrix = view.$svg[0].getScreenCTM().inverse();
    let svgPoint = view.$svg[0].createSVGPoint();
    svgPoint.x = x;
    svgPoint.y = y;

    return svgPoint.matrixTransform(matrix);
  },
  newWave(e) {
    let svgPoint = view.svgPoint(e.clientX, e.clientY);
    let $newRipple = view.$ripple.clone();
    let $ani = $newRipple.find('animate');
    $newRipple.endAniNum = 0;
    $newRipple.timeout = null;
    $newRipple.myOnEnd = function () {
      if (++$newRipple.endAniNum >= $ani.length) {
        console.log($newRipple.endAniNum, $ani.length);
        $newRipple.remove();
      } else {
        if ($newRipple.timeout) {
          clearTimeout($newRipple.timeout);
        }

        $newRipple.timeout = null;
        setTimeout(function () {
          $newRipple.remove();
        }, 100);
      }
    };
    view.$ripples.append($newRipple);
    $newRipple.attr('transform', `translate(${svgPoint.x},${svgPoint.y})`);

    $ani.each(function (i) {
      $ani[i].onend = $newRipple.myOnEnd;
      $ani[i].beginElement();
    });
  },
};

$(document).ready(function () {
  view.init();
});

$(window).resize(function () {
  rem.makeRem();
});
