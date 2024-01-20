let rem = new Rem();
rem.makeRem750();

$(document).ready(function () {
  var mySwiper = new Swiper('.swiper-container', {
    direction: 'vertical',
    mousewheel: true,
    pagination: {
      el: '.swiper-pagination',
    },
  });

  $.ajax({
    type: 'get',
    url: './README1.md',
    dataType: 'html',
    success: function (res) {
      $('#sm1').append(marked(res));
    },
  });

  $.ajax({
    type: 'get',
    url: './README2.md',
    dataType: 'html',
    success: function (res) {
      $('#sm2').append(marked(res));
    },
  });

  $.ajax({
    type: 'get',
    url: './README3.md',
    dataType: 'html',
    success: function (res) {
      $('#sm3').append(marked(res));
    },
  });

  $.ajax({
    type: 'get',
    url: './README4.md',
    dataType: 'html',
    success: function (res) {
      $('#sm4').append(marked(res));
    },
  });

  const $clipPathSelect = $('#sel-blend');
  const $blendVideo = $('#blend-video');
  const $blendText = $('#blend-text');
  const $blendCover = $('#blend-cover');
  const cssMixBlendMode = 'mix-blend-mode';

  $clipPathSelect.on('change', function (evt, ex1) {
    console.log('change');
    console.log(ex1);
    let cssValue = ex1 || evt.target.value;
    console.log(cssValue);
    $blendVideo.css(cssMixBlendMode, cssValue);
    $blendText.css(cssMixBlendMode, cssValue);
    $blendCover.css(cssMixBlendMode, cssValue);
  });

  $clipPathSelect.trigger('change', 'screen');
});
