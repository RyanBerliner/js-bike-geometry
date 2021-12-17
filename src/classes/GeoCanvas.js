import Bike from './Bike';
import CanvasDistort from './CanvasDistort';
import {mapdata} from './../forkdistortionmap';

class GeoCanvas {

  constructor(canvas, bikeDimensions) {
    this.canvas = canvas;
    this.bike = new Bike(bikeDimensions);
    this.canvasDistort = new CanvasDistort(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.cords = mapdata;
  }

  addCord(x, y, value = 1, single = false) {
    if (!this.cords[y]) {
      this.cords[y] = {};
    }

    if (!this.cords[y][x]) {
      this.cords[y][x] = 0;
    }

    value += this.cords[y][x];
    this.cords[y][x] = value > 1 ? 1 : value;

    if (single) {
      return;
    }

    for (var i = -25; i < 25; i++) {
      for (var o = -25; o < 25; o++) {
        const absi = Math.abs(i);
        const abso = Math.abs(o);
        let val = 1 / (Math.max(absi, abso));
        this.addCord(x + i, y + o, val > 1 ? 1 : val, true);
      }
    }
  }

  /**
   * Place a full width image on the canvas.
   * @param  {[type]} img [description]
   * @return {[type]}     [description]
   */
  placeOriginalImage(img) {
    this.canvas.setAttribute("height", img.naturalHeight);
    this.canvas.setAttribute("width", img.naturalWidth);
    this.img = img;
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    this.canvasDistort.initialize(this.ctx.getImageData(0,0,this.canvas.width, this.canvas.height));
  }

  /**
   * Draws the points of interest of the bike.
   * @return {[type]} [description]
   */
  drawBike() {
    // this.drawAxlesAndBB();
    // this.drawEffectSeatTube();
    // this.drawHeadTube();
    // this.drawKindaFork();
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasDistort.redraw();
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

  rotate(deg, origin) {
    let pixels = [];

    Object.keys(this.cords).forEach(y => {
      Object.keys(this.cords[y]).forEach(x => {
        pixels.push({x: x, y: y, fade: this.cords[y][x]});
      })
    });

    this.canvasDistort.rotate(pixels, origin, deg);
  }

  distort(xunits, yunits) {
    let pixels = [];
    let leftTop = 200;
    let rightBottom = 400;

    function smoothstep(min, max, value) {
      var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
      return x * x * (3 - 2 * x);
    }

    for (var y = leftTop; y < rightBottom; y++) {
      for (var x = leftTop; x < rightBottom; x++) {
        // Calculate the fade based on the distance from an edge
        let rightXDistance = rightBottom - x;
        let leftXDistance = x - leftTop;
        let minXDistance = Math.min(rightXDistance, leftXDistance);

        let topYDistance = rightBottom - y;
        let bottomYDistance = y - leftTop;
        let minYDistance = Math.min(topYDistance, bottomYDistance);

        let minDistance = Math.min(minXDistance, minYDistance);

        let fade = smoothstep(0, ((rightBottom - leftTop) / 2), minDistance);
        pixels.push({x: x, y: y, fade: fade});
      }
    }

    this.canvasDistort.translate(pixels, xunits, yunits);
  }
}

export default GeoCanvas;
