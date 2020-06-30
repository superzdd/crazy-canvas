### 这里主要使用到了 svg 的`mask`标签进行镂空，其中最关键的是`mask`中两个元素的颜色，颜色是用来做透明度用的

> 大致结构如下

```html
<svg>
  <defs>
    <mask>
      <rect></rect>
      <text></text>
    </mask>
  </defs>
  <rect></rect>
</svg>
```

```css
.mask-rect {
  /* 显示为半透明颜色 */
  fill: rgb(240, 240, 240);
}

.mask-text {
  text-anchor: middle;
  /*  
    black最透明
    red,green,blue三个颜色不如black那么透明，但也能差不多达到透明的效果
  */
  fill: black;
}

.svg-rect {
  /* svg框的底色 */
  fill: red;
  mask: url(#mask);
}
```
