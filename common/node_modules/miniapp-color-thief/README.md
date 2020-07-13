# Mini App Color Thief

基于小程序的结构，参考 [Color Thief](https://github.com/lokesh/color-thief/) 实现的获取图片主色调，非小程序也可使用，只需是 `Uint8ClampedArray` 类型的图片数据即可

[![npm](https://img.shields.io/npm/v/miniapp-color-thief.svg?style=flat-square)](https://www.npmjs.com/package/miniapp-color-thief)
[![license](https://img.shields.io/github/license/neobaran/miniapp-color-thief.svg?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## 快速上手

### 安装

```bash
npm i --save miniapp-color-thief
```

### 使用

以小程序中使用为 🌰

```javascript
import colorThief from "miniapp-color-thief";

wx.canvasGetImageData({
  canvasId: "myCanvas",
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  success: res => {
    let palette = colorThief(res.data)
      .palette()
      .get();
    console.log(palette); // [[0,0,0],[0,0,0],[0,0,0]...]
  }
});
```

## Demo

[微信小程序代码片段](https://developers.weixin.qq.com/s/HIEMlXmk7w5q)

## API

### 计算

#### Palette

- 参数:
  - `{Number} count` 返回色板的颜色数量 ( 1 < count < 256 )
  - `{Number} quality` 计算颜色的精度，默认为 `10`
- 说明:

  获取图片的色板

```javascript
colorThief(data)
  .palette(count, quality)
  .get(); // [[0,0,0],[0,0,0],[0,0,0]...]
```

#### Color

- 参数:
  - `{Number} quality` 计算颜色的精度，默认为 `10`
- 说明:

  获取图片的主色调

```javascript
colorThief(data)
  .color(quality)
  .get(); // [0,0,0]
```

### 输出

#### Get

- 输出:
  - `{Array}`
- 说明:

  返回颜色的 [R,G,B]

```javascript
colorThief(data)
  .palette()
  .get(); // [[0,0,0],[0,0,0],[0,0,0]...]

colorThief(data)
  .color()
  .get(); // [0,0,0]
```

#### GetHex

- 输出:
  - `{Array|String}`
- 说明:

  返回颜色的 16 进制

```javascript
colorThief(data)
  .palette()
  .getHex(); // ['#000000','#000000','#000000'...]

colorThief(data)
  .color()
  .getHex(); // '#000000'
```

#### GetGray

- 输出:
  - `{Array|Number}`
- 说明:

  返回颜色灰度 `0 ~ 255`

```javascript
colorThief(data)
  .palette()
  .getGray(); // [0,0,0...]

colorThief(data)
  .color()
  .getGray(); // 0
```

#### IsDark

- 输出:
  - `{Array|Boolean}`
- 说明:

  返回颜色是否为深色系

```javascript
colorThief(data)
  .palette()
  .isDark(); // [true,true,false...]

colorThief(data)
  .color()
  .isDark(); // true
```

#### IsLight

- 输出:
  - `{Array|Boolean}`
- 说明:

  返回颜色是否为浅色系

```javascript
colorThief(data)
  .palette()
  .isLight(); // [true,true,false...]

colorThief(data)
  .color()
  .isLight(); // true
```

## License

Apache-2.0 @ [NEOBARAN](https://github.com/neobaran)
