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

    console.log(Math.floor(deltax));

    for (var i = 0; i < pixels.length; i++) {
      let pixel = pixels[i];
      let trueDeltaX = Math[deltax > 0 ? 'floor' : 'ceil'](deltax * pixel.fade);
      let trueDeltaY = Math[deltay > 0 ? 'floor' : 'ceil'](deltay * pixel.fade);
      let color = CanvasDistort.getColorForCoord(this.origionalImageData, pixel.x, pixel.y);

      for (var j = 0; trueDeltaX > 0 ? j < trueDeltaX: j > trueDeltaX; trueDeltaX > 0 ? j++ : j--) {
        let color = CanvasDistort.getColorForCoord(this.origionalImageData, pixel.x + j, pixel.y);
        imageData = CanvasDistort.setColorForCoord(imageData, pixel.x, pixel.y + trueDeltaY, color);
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
