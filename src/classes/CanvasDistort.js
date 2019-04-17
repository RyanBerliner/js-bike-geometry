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

  translate(pixels, deltax, deltay) {
    let imageDataData = Object.assign({}, this.origionalImageData);
    let imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    for (var i = 0; i < imageDataData.data.length; i++) {
      imageData.data[i] = imageDataData.data[i];
    }

    for (var i = 0; i < pixels.length; i++) {
      let pixel = pixels[i];
      let trueDeltaX = Math.floor(deltax * pixel.fade);
      let trueDeltaY = Math.floor(deltay * pixel.fade);
      let color = CanvasDistort.getColorForCoord(this.origionalImageData, pixel.x, pixel.y);

      let maxDelta = Math.max(Math.abs(trueDeltaX), Math.abs(trueDeltaY));
      for (var j = 0; j < maxDelta; j++) {
        let dx = Math.floor(trueDeltaX / maxDelta * j);
        let dy = Math.floor(trueDeltaY / maxDelta * j);
        imageData = CanvasDistort.setColorForCoord(imageData, pixel.x + dx, pixel.y + dy, color);
      }

    }
    this.imageData = imageData;
  }

  update() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  static arraysEqual(arr1, arr2) {
      if(arr1.length !== arr2.length)
          return false;
      for(var i = arr1.length; i--;) {
          if(arr1[i] !== arr2[i])
              return false;
      }

      return true;
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
