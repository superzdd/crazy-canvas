# 效果介绍

css 实现霓虹灯效果

> 这个项目之后，我对 css 中的一些属性有了更深刻的理解，原来 css 中的属性经过一些*叠加*，可以实现很真实的效果。平时在项目过程中，有些素材往往第一反应就是使用图片来做的，尤其是一些背景纹路，阴影这样的效果，现在也可以尝试用代码去实现。但是这些效果如何才能真正产生，不仅需要对 css 属性很了解，更要有想象力和分析能力，善用这些工具来打到效果。

### 一些思路的积累

- 说在最前面，css 的`shadow`,`background-image`是可以叠加的，是可以叠加的，是可以叠加的。
- 一般如果要做到比较真实的阴影，叠加一层往往是不够的，但是叠太多性能又会有损失，3，4 层已经很足够了。

```css
div {
  box-shadow: 1px 1px 1px #555, 2px 2px 1px #444, 3px 3px 1px #333, 5px 5px 10px black;
}
```

- 如果想实现一些线段，线圈，而且是有规律的重复出现的，`repeating-xxx-gradient`是一个好选择

```css
div {
  /* 下方实现了一个斜45度方向有间隔的出现灰线的示意 */
  /* center/5px 表示整个背景的位置在正中间，宽度为5px，注意这里/代表的意思不是除法运算，只是起到了分隔符的作用 */
  /* 最后那个5px我还没弄懂是什么意思 */
  background: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.3) 25%,
      transparent 25%,
      transparent 50%
    ) center/5px 5px;
  background-image: repeating-radial-gradient(transparent, transparent 0, transparent 7%, hsla(0, 0%, 100%, 0.1) 8%);
}
```

- 要做一些光芒，反光特效的时候，需要用到`radial-gradient`。`radial-gradient`中的`circle`比较适合模拟一大片光芒从平面中间反射，而如果要实现一些比较细节的反光，比如这个作品中按钮四周的反光，就需要想象力了！在这个项目中，分别在按钮上下左右四边（想象成标准坐标的xy轴）画了四个只显示一半的椭圆，模拟了按钮四边的反光效果~

- 在这个项目中，`ellipse`的用法已经很彻底了，甚至连mdn官方文档中，都没有解释道这么细节的程度，这里把用法记录一下，以免忘记

  ```css
  div{
    /*
    8% 50%这两个值，在mdn中的解释也不明确。在这里应该是ellipse的特殊用法，椭圆有两根轴，8%指的是横轴的长度，50%指的是纵轴的长度。
    */
    radial-gradient(ellipse 8% 50% at top, hsla(0, 0%, 100%, 0.5) 0%, hsla(0, 0%, 100%, 0) 100%),
  }
  ```

  

### 参考

[mdn bakcground](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background)

