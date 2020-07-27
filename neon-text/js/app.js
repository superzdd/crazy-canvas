var rem = new Rem();
rem.makeRem();

let data = {
  lightOn: false,
};

let view = {
  $p: $('p'),
  init: function () {
    view.$p.click(function () {
      data.lightOn = !data.lightOn;
      if (data.lightOn) {
        view.$p.addClass('neon--on');
      } else {
        view.$p.removeClass('neon--on');
      }
    });
  },
};

$(document).ready(function () {
  view.init();
});

$(window).resize(function () {
  rem.makeRem();
});
