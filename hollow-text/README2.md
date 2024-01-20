### 使用 css 的 background-clip 实现（未实现）

1. css 的 background 属性无法将视频设置为背景，这样会导致背景不能使用 video 的一些标签，会存在无法自动播放的问题
2. clip-path 设置的背景色是基于整个容器的，这个本身听起来很正常，但是在实现镂空效果时，即使字可以镂空，但是背景色本身的颜色还是会显示出来，比如上方看起来是镂空了，其实有一层淡淡的不透明白色在上面。所以字的部分无论如何都镂空不了。
   [照搬了 mdn 上 background-clip 实现的效果](https://codepen.io/superzdd/pen/PoPqXex)
