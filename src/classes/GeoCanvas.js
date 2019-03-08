class GeoCanvas {

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = true;
  }

  /**
   * Place a full width image on the canvas.
   * @param  {[type]} img [description]
   * @return {[type]}     [description]
   */
  placeImage(img) {
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Fixes the canvas blur.
   * https://medium.com/wdstack/fixing-html5-2d-canvas-blur-8ebe27db07da
   * @return {[type]} [description]
   */
  fixDPI() {
    let dpi = window.devicePixelRatio;
    let styleHeight = + getComputedStyle(this.canvas).getPropertyValue("height").slice(0, -2);
    let styleWidth = + getComputedStyle(this.canvas).getPropertyValue("width").slice(0, -2);
    this.canvas.setAttribute('height', styleHeight * dpi);
    this.canvas.setAttribute('width', styleWidth * dpi);
  }

}

export default GeoCanvas;
