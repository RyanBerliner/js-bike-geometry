class CanvasDistort {
  constructor(canvas) {
    this.imageData = null;
    this.origionalImageData = null;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
  }

  initialize(imageData) {
    this.imageData = imageData;
    this.origionalImageData = imageData;
  }

  // todo: implement
  rotate(pixels, {x: originX, y: originY}, angle) {
    let imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);

    this.imageData.data.forEach((data, i) => {
      imageData.data[i] = data;
    });

    angle = angle * (Math.PI / 180);

    for (var i = 0; i < pixels.length; i++) {
      let pixel = pixels[i];
      // translate to do rotation around origin
      let [tempx, tempy] = [pixel.x - originX, pixel.y - originY]
      let rotatedx = (tempx * Math.cos(angle)) - (tempy * Math.sin(angle));
      let rotatedy = (tempy * Math.cos(angle)) + (tempx * Math.sin(angle));
      // re-apply translation
      let newX = rotatedx + originX, deltax = newX - pixel.x;
      let newY = rotatedy + originY, deltay = newY - pixel.y;


      let trueDeltaX = Math[deltax > 0 ? 'floor' : 'ceil'](deltax * pixel.fade);
      let trueDeltaY = Math[deltay > 0 ? 'floor' : 'ceil'](deltay * pixel.fade);

      let color = CanvasDistort.getColorForCoord(this.origionalImageData, pixel.x - trueDeltaX, pixel.y - trueDeltaY);
      imageData = CanvasDistort.setColorForCoord(imageData, pixel.x, pixel.y, color);
    }

    this.imageData = imageData;
  }

  translate(pixels, deltax, deltay) {
    let imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);

    this.imageData.data.forEach((data, i) => {
      imageData.data[i] = data;
    });

    for (var i = 0; i < pixels.length; i++) {
      let pixel = pixels[i];
      let trueDeltaX = Math[deltax > 0 ? 'floor' : 'ceil'](deltax * pixel.fade);
      let trueDeltaY = Math[deltay > 0 ? 'floor' : 'ceil'](deltay * pixel.fade);

      let color = CanvasDistort.getColorForCoord(this.origionalImageData, pixel.x - trueDeltaX, pixel.y - trueDeltaY);
      imageData = CanvasDistort.setColorForCoord(imageData, pixel.x, pixel.y, color);
    }

    this.imageData = imageData;
  }

  update() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  static getColorIndicesForCoord(imageData, x, y) {
    const red = y * (imageData.width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  static setColorForCoord(imageData, x, y, color) {
    const [redIndex, greenIndex, blueIndex, alphaIndex] = CanvasDistort.getColorIndicesForCoord(imageData, x, y);
    imageData.data[redIndex] = color.r;
    imageData.data[greenIndex] = color.g;
    imageData.data[blueIndex] = color.b;
    imageData.data[alphaIndex] = color.a;
    return imageData;
  }

  static getColorForCoord(imageData, x, y) {
    const [redIndex, greenIndex, blueIndex, alphaIndex] = CanvasDistort.getColorIndicesForCoord(imageData, x, y);
    return {
      r: imageData.data[redIndex],
      g: imageData.data[greenIndex],
      b: imageData.data[blueIndex],
      a: imageData.data[alphaIndex]
    };
  }
}

export default CanvasDistort;
