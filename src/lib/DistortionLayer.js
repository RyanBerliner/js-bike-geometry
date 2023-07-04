import { hash } from '../util';
import { DistortionMap } from './DistortionMap';

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

    const distortionMap = new DistortionMap(this.id);

    // function indices(x, y) {
    //   x = parseInt(x);
    //   y = parseInt(y);
    //   const r = y * (imageData.width * 4) + x * 4;
    //   return [r, r + 1, r + 2, r + 3];
    // };

    const map = distortionMap.map;
    console.log(map);

    // const data = imageData.data;
    Object.keys(map).forEach((y) => {
      Object.keys(map[y]).forEach((x) => {
        // const [r, g, b, a] = indices(x, y);
        ctx.fillStyle = `rgba(255, 0, 0, ${map[y][x]})`;
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