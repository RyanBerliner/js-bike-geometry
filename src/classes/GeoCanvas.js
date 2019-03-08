export default class GeoCanvas {

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = true;
  }

  placeImage(img) {
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
  }

}
