import Bike from './Bike';
import CanvasDistort from './CanvasDistort';

class GeoCanvas {

  constructor(canvas, bikeDimensions) {
    this.canvas = canvas;
    this.bike = new Bike(bikeDimensions);
    this.canvasDistort = new CanvasDistort(this.canvas);
    this.ctx = this.canvas.getContext("2d");
  }

  /**
   * Place a full width image on the canvas.
   * @param  {[type]} img [description]
   * @return {[type]}     [description]
   */
  placeOrigionalImage(img) {
    this.img = img;
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    this.canvasDistort.initialize(this.ctx.getImageData(0,0,this.canvas.width, this.canvas.height));
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
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasDistort.update();
    this.drawBike();
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
    this.update();
  }

  distort(units) {
    let pixels = [];
    for (var y = 200; y < 400; y++) {
      for (var x = 200; x < 400; x++) {
        // Calculate the fade based on the distance from an edge
        let rightXDistance = 400 - x;
        let leftXDistance = x - 200;

        let minXDistance = Math.min(rightXDistance, leftXDistance);

        let topYDistance = 400 - y;
        let bottomYDistance = y - 200;

        let minYDistance = Math.min(topYDistance, bottomYDistance);

        let minDistance = Math.min(minXDistance, minYDistance);

        function smoothstep(min, max, value) {
          var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
          return x*x*(3 - 2*x);
        }

        let fade = smoothstep(0, 100, minDistance);
        // let fade = (dist) / 200;
        pixels.push({x: x, y: y, fade: fade});
      }
    }
    this.canvasDistort.translate(pixels, units, units);
    this.update();
  }
}

export default GeoCanvas;
