var rem = new Rem();
rem.makeRem();

let view = {
  init: function () {
    var $target = $('.img-container-4'),
      $filter_map = {};

    $('.filters').on('input', oninput);
    $('.filter').each(function () {
      init($(this));
    });

    function init($this) {
      $this.fName = $this.attr('filter');
      $this.fTextEle = $this.closest('label').find('span');
      $this.fValue = $this[0].value;
      $this.fUnit = $this.attr('unit');
      refreshValueStr($this);
      $filter_map[$this.fName] = $this;
    }
    function oninput(e) {
      var name, $filter;
      name = $(e.target).attr('filter');
      $filter = $filter_map[name];
      $filter.fValue = $filter[0].value;
      refreshValueStr($filter);
      setFilterProperty();
    }
    function refreshValueStr($filter) {
      if ($filter.fName != 'drop-shadow') {
        $filter.fValueStr = $filter.fName + '(' + $filter.fValue + $filter.fUnit + ')';
      } else {
        $filter.fValueStr =
          $filter.fName + '(' + $filter.fValue + $filter.fUnit + ' ' + $filter.fValue + $filter.fUnit + ' 6px black)';
      }
      $filter.fTextEle.text($filter.fValueStr);
    }
    function setFilterProperty() {
      var i,
        value = '';
      for (i in $filter_map) {
        value += $filter_map[i].fValueStr + ' ';
      }
      console.log(value);
      $target[0].style.filter = value;
    }

    setFilterProperty();
  },
};

$(document).ready(function () {
  view.init();

  var mySwiper = new Swiper('.swiper-container', {
    direction: 'vertical',
    mousewheel: true,
    pagination: {
      el: '.swiper-pagination',
    },
  });
});

$(window).resize(function () {
  rem.makeRem();
});
