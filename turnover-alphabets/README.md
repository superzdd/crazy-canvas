# 效果介绍

翻折的文字

- 伪元素，伪元素，伪元素（重要的事情说三遍）。伪元素可以省掉许多复制黏贴的代码
- css 里可以用 attr 来获取 html 标签的里指定 attr 属性的值

```css
.text--front span:before {
  content: attr(letter);
  position: absolute;
  z-index: 5;
  left: 0;
  top: 0;
  color: #ffffff;
  transform-origin: 0% 50%;
}
```

- 伪元素用 Jquery 选择器是选不到的，具体原因可能是他没有 dom 节点的关系。所以如果想要批量对伪元素进行处理的话，用 js 会比较难，这里可以用 js+css 的技巧来解决一部分问题，比如：

```js
let alphabets = $('.text--front').children();

let dur = 0.3;
for (let i = 0; i < alphabets.length; i++) {
  let $alpha = $(alphabets[i]);
  setTimeout(() => {
    $alpha.addClass('fold');
    $alpha.one('animationend', () => {
      $alpha.removeClass('fold');
    });
  }, 1000 + dur * 1000 * 2 * i);
}
```

```css
.text--front span.fold:before {
  animation: turnover 0.5s 2 ease alternate;
}

.text--front span.fold:after {
  animation: showShadow 0.5s 2 ease alternate;
}
```
