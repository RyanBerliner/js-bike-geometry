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

  /**
   * Draws the ground under the bike.
   * @return {[type]} [description]
   */
  drawGround() {
    this.ctx.strokeStyle = "black";
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.percToPix(false, this.bike.groundLevel));
    this.ctx.lineTo(this.canvas.width, this.percToPix(false, this.bike.groundLevel));
    this.ctx.stroke();
  }

  drawAxlesAndBB() {
    let size = 20;
    this.ctx.fillStyle = "yellow";
    this.ctx.fillRect(this.percToPix(true, this.bike.frontAxle.x)-(size/2), this.percToPix(false, this.bike.frontAxle.y)-(size/2), size, size);
    this.ctx.fillRect(this.percToPix(true, this.bike.rearAxle.x)-(size/2), this.percToPix(false, this.bike.rearAxle.y)-(size/2), size, size);
    this.ctx.fillRect(this.percToPix(true, this.bike.bb.x)-(size/2), this.percToPix(false, this.bike.bb.y)-(size/2), size, size);
  }

  drawEffectSeatTube() {
    let est = this.bike.effectiveSeatTube();
    this.ctx.strokeStyle = "yellow";
    this.ctx.beginPath();
    this.ctx.lineWidth = 10;
    this.ctx.moveTo(this.percToPix(true, est.topX), this.percToPix(false, est.topY));
    this.ctx.lineTo(this.percToPix(true, est.bottomX), this.percToPix(false, est.bottomY));
    this.ctx.stroke();
  }

  drawHeadTube() {
    let ht = this.bike.headTube();
    this.ctx.strokeStyle = "yellow";
    this.ctx.beginPath();
    this.ctx.lineWidth = 10;
    this.ctx.moveTo(this.percToPix(true, ht.topX), this.percToPix(false, ht.topY));
    this.ctx.lineTo(this.percToPix(true, ht.bottomX), this.percToPix(false, ht.bottomY));
    this.ctx.stroke();
  }

  drawKindaFork() {
    let fork = this.bike.kindaFork();
    this.ctx.strokeStyle = "red";
    this.ctx.beginPath();
    this.ctx.lineWidth = 10;
    this.ctx.moveTo(this.percToPix(true, fork.topX), this.percToPix(false, fork.topY));
    this.ctx.lineTo(this.percToPix(true, fork.bottomX), this.percToPix(false, fork.bottomY));
    this.ctx.stroke();
  }

  slackFork(units) {
    this.bike.slackFork(units / this.canvas.width);
    this.drawBike();
  }

  /**
   * Converts percentage to pixel amount
   * @param  {[boolean]} width Are we talking about width?
   * @param  {[type]} perc  [description]
   * @return {[type]}       [description]
   */
  percToPix(width, perc) {
    let multipler = (width) ? this.canvas.width : this.canvas.height;
    return perc * multipler;
  }

}

export default GeoCanvas;
