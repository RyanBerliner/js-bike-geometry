import Bike from './Bike';

class GeoCanvas {

  constructor(canvas, bikeDimensions) {
    this.canvas = canvas;
    this.bike = new Bike(bikeDimensions);
    this.setupCanvas()
  }

  /**
   * Preps the canvas.
   * @return {[type]} [description]
   */
  setupCanvas() {
    this.ctx = this.canvas.getContext("2d");
  }

  /**
   * Place a full width image on the canvas.
   * @param  {[type]} img [description]
   * @return {[type]}     [description]
   */
  placeImage(img) {
    this.img = img;
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    console.log('set image data');
    this.ogImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
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
    this.canvas.setAttribute("height", styleHeight * dpi);
    this.canvas.setAttribute("width", styleWidth * dpi);
  }

  /**
   * Draws the points of interest of the bike.
   * @return {[type]} [description]
   */
  drawBike() {
    this.drawAxlesAndBB();
    this.drawEffectSeatTube();
    this.drawHeadTube();
    this.drawKindaFork();
    console.log('set image data');
    this.ogImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  redrawBike() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.placeImage(this.img);
    this.drawBike();
    console.log('set image data');
    this.ogImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the ground under the bike.
   * @return {[type]} [description]
   */
  drawGround() {
    this.ctx.strokeStyle = "black";
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.bike.groundLevel);
    this.ctx.lineTo(this.canvas.width, this.bike.groundLevel);
    this.ctx.stroke();
  }

  drawAxlesAndBB() {
    let size = 20;
    this.ctx.fillStyle = "yellow";
    this.ctx.fillRect(this.bike.frontAxle.x-(size/2), this.bike.frontAxle.y-(size/2), size, size);
    this.ctx.fillRect(this.bike.rearAxle.x-(size/2), this.bike.rearAxle.y-(size/2), size, size);
    this.ctx.fillRect(this.bike.bb.x-(size/2), this.bike.bb.y-(size/2), size, size);
  }

  drawEffectSeatTube() {
    let est = this.bike.effectiveSeatTube();
    this.ctx.strokeStyle = "yellow";
    this.ctx.beginPath();
    this.ctx.lineWidth = 10;
    this.ctx.moveTo(est.topX, est.topY);
    this.ctx.lineTo(est.bottomX, est.bottomY);
    this.ctx.stroke();
  }

  drawHeadTube() {
    let ht = this.bike.headTube();
    this.ctx.strokeStyle = "yellow";
    this.ctx.beginPath();
    this.ctx.lineWidth = 20;
    this.ctx.moveTo(ht.topX, ht.topY);
    this.ctx.lineTo(ht.bottomX, ht.bottomY);
    this.ctx.stroke();
  }

  drawKindaFork() {
    let fork = this.bike.kindaFork();
    this.ctx.strokeStyle = "red";
    this.ctx.beginPath();
    this.ctx.lineWidth = 10;
    this.ctx.moveTo(fork.topX, fork.topY);
    this.ctx.lineTo(fork.bottomX, fork.bottomY);
    this.ctx.stroke();
  }

  slackFork(units) {
    this.bike.slackFork(units);
    this.redrawBike();
  }

  getOrigonalImageData() {
    return this.ogImageData;
  }

  distort(units) {

    // testing things
    let imageDataData = Object.assign({}, this.ogImageData);
    let imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    for (var i = 0; i < imageDataData.data.length; i++) {
      imageData.data[i] = imageDataData.data[i];
    }
    // loop through rows 200 -> 400
    for (var y = 200; y < 400; y++) {
      for (var x = 200; x < 400; x++) {
        let color = GeoCanvas.getColorForCoord(this.ogImageData, x, y);
        imageData = GeoCanvas.setColorForCoord(imageData, x + units, y, color);
      }
    }
    this.ctx.putImageData(imageData, 0, 0);
    
  }

  static getColorIndicesForCoord(imageData, x, y) {
    const red = y * (imageData.width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  static setColorForCoord(imageData, x, y, color) {
    const [redIndex, greenIndex, blueIndex, alphaIndex] = GeoCanvas.getColorIndicesForCoord(imageData, x, y);
    imageData.data[redIndex] = color.r;
    imageData.data[greenIndex] = color.g;
    imageData.data[blueIndex] = color.b;
    imageData.data[alphaIndex] = color.a;
    return imageData;
  }

  static getColorForCoord(imageData, x, y) {
    const [redIndex, greenIndex, blueIndex, alphaIndex] = GeoCanvas.getColorIndicesForCoord(imageData, x, y);
    return {
      r: imageData.data[redIndex],
      g: imageData.data[greenIndex],
      b: imageData.data[blueIndex],
      a: imageData.data[alphaIndex]
    };
  }

}

export default GeoCanvas;
