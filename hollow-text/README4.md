### 使用 css 的 mix-blend-mode 实现

screen 的效果最完美

> 关键代码

```css
#blend-text {
  color: #000000;
  background-color: rgb(240, 240, 240);
}
```

```js
clipPathSelect.addEventListener('change', function (evt) {
  let cssValue = evt.target.value;
  $blendVideo.css(cssMixBlendMode, cssValue);
  $blendText.css(cssMixBlendMode, cssValue);
  $blendCover.css(cssMixBlendMode, cssValue);
});
```
