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
    this.tempCords = {};
  }

  processCoordsQueue(coords) {
    let prevCord = null;
    function getLineFunc (x1, x2, y1, y2) {
      let m = (y1 - y2) / (x1 - x2);
      const b = y1 - (m * x1);

      let func = x => {
        return (m * x) + b;
      }

      if (Math.abs(m) === Infinity) {
        func = x1;
        m = Math.abs(m);
      }

      return { func, m, b }
    }

    function perpLine (line1, x1, y1) {
      let m = -1 / line1.m;
      const b = y1 - (m * x1)

      let func = x => {
        return (m * x) + b
      }

      if (Math.abs(m) === Infinity) {
        func = x1;
        m = Math.abs(m);
      }

      return { func, m, b }
    }

    function lineIntersection(line1, line2) {
      const {m: m1, b: b1, func: func1} = line1;
      const {m: m2, b: b2, func: func2} = line2

      if (m1 === Infinity || m2 === Infinity) {
        if (m1 === Infinity && m2 === Infinity) {
          return [undefined, undefined];
        }

        if (m1 === Infinity) {
          return [func1, func2(func1)]
        }

        return [func2, func1(func2)]
      }

      const intersectX = (b1 - b2) / (m2 - m1),
            intersectY = func1(intersectX);

      return [intersectX, intersectY];
    }

    function distanceFromLine(line, x1, y1) {
      const perp = perpLine(line, x1, y1);
      const [x2, y2] = lineIntersection(line, perp);
      return [
        Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)),
        x2,
        y2
      ];
    }

    function between(num, a, b) {
      const min = Math.min(a, b);
      const max = Math.max(a, b);
      return num >= min && num <= max;
    }

    coords.forEach(([x, y, value, time]) => {
      if (!this.cords[y]) {
        this.cords[y] = {};
      }

      if (!this.cords[y][x]) {
        this.cords[y][x] = 0;
      }

      this.simpAddTempCord(x, y, 0.5, time);

      let lineFunc = null;
      let radius = 25;
      let box = radius;
      if (prevCord) {
        lineFunc = getLineFunc(prevCord[0], x, prevCord[1], y);
        const dist = Math.sqrt(Math.pow(prevCord[0] - x, 2) + Math.pow(prevCord[1] - y, 2));
        box = Math.ceil(Math.max(box, dist + radius));
      }

      for (var i = -1 * box; i < box; i++) {
        for (var o = -1 * box; o < box; o++) {
          const pointx = x + i, pointy = y + o;
          let dFromPoint = Math.sqrt(Math.pow(i, 2) + Math.pow(o, 2));
          let dFromLine = Infinity;
          if (lineFunc) {
            // This isn't quite right becase we need to do line "segment" not just line
            let [distance, intersectx, intersecty] = distanceFromLine(lineFunc, pointx, pointy);
            let dFromPrevPoint = Math.sqrt(Math.pow(prevCord[0] - pointx, 2) + Math.pow(prevCord[1] - pointy, 2));

            // If not on the line segment, lets check either start or end radius
            if (!(between(intersectx, x, prevCord[0]) && between(intersecty, y, prevCord[1]))) {
              distance = Math.min(dFromPoint,dFromPrevPoint);
            }

            dFromLine = distance;
          }

          const validDFromLine = !isNaN(dFromLine) && dFromLine < radius;
          const validDFromPoint = dFromPoint < radius
          if (!validDFromLine && !validDFromPoint) {
            continue;
          }

          let offset = dFromPoint;
          if (validDFromLine) {
            offset = Math.min(dFromLine, dFromPoint);
          }

          let val = ((radius - offset) / radius) * value;
          this.simpAddTempCord(pointx, pointy, val, time);
        }
      }

      prevCord = [x, y];
    });

    this.applyTempCords();
  }

  simpAddTempCord(x, y, val, timestamp) {
    if (!this.tempCords[y]) {
      this.tempCords[y] = {};
    }

    if (!this.tempCords[y][x]) {
      this.tempCords[y][x] = [0, timestamp];
    }

    // 500 ms ago means full mix, 0 ms ago means no mix
    const fullMixMs = 500;
    const timediff = timestamp - this.tempCords[y][x][1];
    const timediffAdj = Math.min((timediff / fullMixMs), 1)
    const fullMix = Math.min(1, this.tempCords[y][x][0] + val);
    const noMix = Math.max(val, this.tempCords[y][x][0]);
    const diffMix = fullMix - noMix;
    const adjVal = noMix + (diffMix * timediffAdj);

    this.tempCords[y][x][0] = adjVal;
    this.tempCords[y][x][1] = timestamp;
  }

  applyTempCords() {
    Object.keys(this.tempCords).forEach(y => {
      Object.keys(this.tempCords[y]).forEach(x => {
        if (!this.cords[y]) {
          this.cords[y] = {};
        }
    
        if (!this.cords[y][x]) {
          this.cords[y][x] = 0;
        }

        this.cords[y][x] += this.tempCords[y][x][0];
      })
    });

    this.tempCords = {};
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
