# 效果介绍

canvas 绘制 Loading 的波浪效果
从中掌握了一些 CanvasRenderingContext2D(ctx)的基本用法，包括

-   fill
-   stroke
-   clip
-   moveTo
-   lineTo
-   save
-   restore
    -   restore 其实是 pop 了上一次 save 的状态，所以当一次 restore 执行成功后，如果再对 ctx 进行任何修改，restore 就不会起作用了
    -   [例子](https://codepen.io/superzdd/pen/xxZqbWo)
    -   _所以每一次 restore 之后，最好还是再做一次 save 为好。。。相当于 restore 没什么用_
-   lineWidth
    -   lineWidth 用于设置线条粗细，这个线条粗细是基于绘制的坐标左右平均延伸的，比如设置`lineWidth=1`的线条，实际的显示效果在其坐标两旁的各宽 0.5。所以假设我们现在有一个 lineWidth>1 的元素 a, a 的横坐标最好是计算上 lineWidth 的宽度，也就是`a.x = a.x + ctx.lineWidth/2`,或者`a.x = a.x - ctx.lineWidth/2`,以免因为线条宽度导致遮住其他元素的情况，具体是`+`还是`-`依照页面布局的具体情况而定。

## 原生 canvas+jQuery 实现

其中部分 canvas 代码可以剥离出来，当做 canvas 的基础操作，类似与 p5.js 的做法
