let rem = new Rem();
rem.getWindowSize();

let appData = {
  lastRenderTime: 0,
  renderInterval: 1000 / 120,
};

let appView = {
  alphabets: [],
  init: function () {
    let alphabets = $('.text--front').children();
    // console.log(`children count: ${alphabets.length}`);
    console.log(alphabets);
    let dur = 0.3;
    for (let i = 0; i < alphabets.length; i++) {
      let $alpha = $(alphabets[i]);
      $alpha.attr('letter', $alpha.text());
      setTimeout(() => {
        $alpha.addClass('fold');
        $alpha.one('animationend', () => {
          $alpha.removeClass('fold');
        });
      }, 1000 + dur * 1000 * 2 * i);
    }
  },
};

$(document).ready(function () {
  appView.init();
});
