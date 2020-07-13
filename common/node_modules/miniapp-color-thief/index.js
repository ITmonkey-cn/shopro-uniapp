import quantize from "quantize";

const toString = array =>
  `#${((1 << 24) + (array[0] << 16) + (array[1] << 8) + array[2])
    .toString(16)
    .slice(1)}`;

const proxy = (data, fn) => {
  if (data.map(item => Array.isArray(item)).includes(true)) {
    return data.map(item => fn(item));
  } else {
    return fn(data);
  }
};

const getGray = rgb => (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

const colorThief = pixels => ({
  palette(count, quality) {
    if (typeof count === "undefined" || count < 2 || count > 256) {
      count = 10;
    }
    if (typeof quality === "undefined" || quality < 1) {
      quality = 10;
    }

    // Store the RGB values in an array format suitable for quantize function
    let pixelArray = [];
    for (
      let i = 0, offset, r, g, b, a;
      i < pixels.length / 4;
      i = i + quality
    ) {
      offset = i * 4;
      r = pixels[offset + 0];
      g = pixels[offset + 1];
      b = pixels[offset + 2];
      a = pixels[offset + 3];
      // If pixel is mostly opaque and not white
      if (a >= 125) {
        if (!(r > 250 && g > 250 && b > 250)) {
          pixelArray.push([r, g, b]);
        }
      }
    }
    this._data = quantize(pixelArray, count).palette() || null;
    return this;
  },
  color(quality) {
    let palette = this.palette(5, quality)._data;
    if (palette) {
      this._data = palette[0];
      return this;
    } else {
      console.error(
        "[MiniApp Color Thief] getColor has error: palette length is zero."
      );
    }
  },
  __proto__: {
    get() {
      return this._data;
    },
    getHex() {
      return proxy(this._data, toString);
    },
    getGray() {
      return proxy(this._data, getGray);
    },
    isDark() {
      return proxy(this._data, data => getGray(data) < 127.5);
    },
    isLight() {
      return proxy(this._data, data => getGray(data) >= 127.5);
    }
  }
});

export default colorThief;
