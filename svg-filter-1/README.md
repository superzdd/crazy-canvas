# svg 滤镜

## feBlend

-   index.html

## feImage

-   index-1.html

## svg filter 级联

-   index-2.html index-3.html
-   feFlood 无法级联，会暴力覆盖掉之前的效果

## feTile

-   index-4.html

-   feTile 没有研究得很明白，只有在`primitiveUnits="objectBoundingBox"`时，将 filter 内部的尺寸都用百分比来显示才会有比较好的平铺效果。如果不在`primitiveUnits="objectBoundingBox"`的情况下，feTile 很可能导致整个图像不出现，或者即使出现了也没有显示在该出现的地方

## feComposite

-   index-5.html
-   在 chrome 下不兼容，暂时不继续研究了

## feColorMatrix

-   index-6.html
