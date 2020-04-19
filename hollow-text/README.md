## 镂空遮罩
进行一些镂空遮罩属性的实验，主要是用代码实现在视频上盖一层遮罩，看起来比较像镂空的效果。以下几个页面分别代表了几种不同的实现方式

### 使用svg的mask实现
> index.html
这里主要使用到了mask标签，其中最关键的是mask中两个元素的颜色
```js
<defs>
	<mask id="mask" x="0" y="0" width="100%" height="100%">
		<rect class="mask-rect" x="0" y="0" width="100%" height="100%"></rect>
		<text class="mask-text" x="50%" y="45%" font-size="300" font-weight="900">SUPERZDD</text>
	</mask>
</defs>
```

关键代码
```css
<!-- 越白代表越不透明 -->
.mask-rect {
	fill: rgb(240, 240, 240);
}

<!-- 黑色代表完全透明 -->
.mask-text {
	text-anchor: middle;
	fill: black;
}
```

### 使用css的background-clip实现（未实现）
> index-clip.html
个人觉得这个方案有几点问题导致镂空效果实现不了：
1. css的background属性无法将视频设置为背景，这样会导致背景不能使用video的一些标签，会存在无法自动播放的问题
2. clip-path设置的背景色是基于整个容器的，这个本身听起来很正常，但是在实现镂空效果时，即使字可以镂空，但是背景色本身的颜色还是会显示出来，所以字的部分无论如何都镂空不了。
[照搬了mdn上background-clip实现的效果](https://codepen.io/superzdd/pen/PoPqXex)

### 使用svg的clip-path实现（未实现）
> index-clip-path.html
svg的clip-path可以比较完美的实现“剪裁”这个功能，但是目前仍然有两点未完善
1. 封闭的文字裁剪路径，目前字是由手写字路径绘制而成的，貌似svg会自动将这些path进行闭合处理，所以裁剪的区域不是字母区域，而是字母路径所构成的闭合区域
2. 只能裁剪出字，但是无法实现周边半透明的包围效果