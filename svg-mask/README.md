# svg 蒙版
svg波浪动画，主要实现方式是：
1. 先用pattern将整个波浪拼起来
2. 将波浪罩上名字的mask
看似很简单，但是做起来其实很难，下面详细说一下一些细节

### svg制作
1. svg制作推荐用PS来做，当然有条件的用AI更好，不推荐网上的svg快速编辑器，因为辅助线和尺寸都不好调整，比较模糊
2. 在这个案例里面，svg的尺寸是有严格要求的。比如现在的svg整个的viewbox尺寸是600，用pattern平铺波浪的话，6*100=600，所以svg的宽度是100px，这得比较精确。

### text本文的定位
1. <text>的`y`属性，指的不是<text>的左上角坐标，而是baseline坐标，也就是字符底对齐中**“底”那根线的位置**
> 底对齐也有小知识点：英文有大小写，比如p，q这类字母，在小写时，底对齐的线不会计算下面多出来的竖线的高度，所以这类字母小写时一般会看上去靠下一点；但是当p,q为大写字母时，竖线就会一起计算底对齐了。
> 强烈推荐读这篇博客[SVG之text](https://segmentfault.com/a/1190000009293590)

### text内阴影的制作
1. 内阴影比外阴影要难做的多，使用到的技术不是`text-shadow`，而是`filter`。用`filter`制作阴影之前在`svg滤镜1`里有提到过，但那时只是外阴影，内阴影做起来很困难。我是找的网上的代码实现的，其中涉及到的fe属性太多，我得加注释慢慢说。
```html
<filter id="iiss">
	<!-- 内阴影滤镜 -->
	<!-- 先说重点，这里的每一个滤镜顺序都是不能轻易动，否则就无法实现效果 -->
	<!-- feComponentTransfer是一个rgb过滤工具，其中feFuncA的作用是将透明度取反 -->
	<feComponentTransfer in="SourceAlpha">
		<feFuncA type="table" tableValues="1 0" />
	</feComponentTransfer>
	<!-- 高斯模糊，这里特别注意一点，不能写in="SourceGraphic"这句，因为模糊的不是原始素材，而是经过一次feComponentTransfer的内容，以下滤镜也是如此 -->
	<feGaussianBlur stdDeviation="5" result="blur"/>
	<!-- 偏移，内阴影不用偏移，直接(0,0)，重点在后面，如何处理模糊到物体外部的部分，以及加深内部的阴影 -->
	<feOffset dx="0" dy="0" in="blur" result="offsetblur" />
	<!-- 在图片内部加入一块色板，这块色板受到feComponentTransfer的直接影响，是制作内阴影的核心，如果想看这块色板，可以把feComponentTransfer整个注释掉就能看到 -->
	<feFlood floodColor="#000" floodOpacity="1" result="color" />
	<!-- 去除feGaussianBlur在物体外的炫光 -->
	<feComposite in2="offsetblur" operator="in" />
	<!-- 将物体内的模糊，色板，以及物体本身进行合成 -->
	<feComposite in2="SourceGraphic" operator="in" />
	<feMerge>
		<!-- 注意叠放顺序，先原图，后阴影，因为阴影要盖在原图上方 -->
		<feMergeNode in="SourceGraphic" />
		<!-- 这个标签啥都没指明，其实默认的就是我们上面做的一大溜事情，也就是内阴影 -->
		<feMergeNode/>
	</feMerge>
</filter>
```