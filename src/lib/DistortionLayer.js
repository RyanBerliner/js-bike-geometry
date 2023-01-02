import { hash } from '../util';

export class DistortionLayer {
  id;
  map;

  constructor({ id }) {
    this.id = id;
  }

  hash() {
    return hash(JSON.stringify({
      id: this.id,
      map: this.map,
    }))
  };

  applyToImageData(ctx, imageData) {
    if (!this.map) {
      return imageData;
    }

    // function indices(x, y) {
    //   x = parseInt(x);
    //   y = parseInt(y);
    //   const r = y * (imageData.width * 4) + x * 4;
    //   return [r, r + 1, r + 2, r + 3];
    // };

    // const data = imageData.data;
    Object.keys(this.map).forEach((y) => {
      Object.keys(this.map[y]).forEach((x) => {
        // const [r, g, b, a] = indices(x, y);
        ctx.fillStyle = `rgba(255, 0, 0, ${this.map[y][x]})`;
        ctx.fillRect(x, y, 1, 1);
        // data[r] = 255;
        // data[g] = 0;
        // data[b] = 0;
        // data[a] = parseInt(this.map[y][x] * 255);
      });
    });

    return imageData;
  };
};