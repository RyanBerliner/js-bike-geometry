class CanvasDistort {
  constructor(canvas) {
    this.imageData = null;
    this.origionalImageData = null;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.transformations = [{}, {}];  // temp, initialize 1 for each type. eventually this will be arbitraty and created on the fly
  }

  initialize(imageData) {
    this.imageData = imageData;
    this.origionalImageData = imageData;
  }

  rotate(pixels, origin, angle) {
    this.transformations[0] = {
      type: 'rotation',
      data: {
        pixels,
        origin,
        angle
      }
    }

    this.applyTransformations();
  }

  translate(pixels, deltax, deltay) {
    this.transformations[1] = {
      type: 'translate',
      data: {
        pixels,
        deltax,
        deltay
      }
    }

    this.applyTransformations();
  }

  applyTransformations() {
    let refImageData = this.origionalImageData;
    this.transformations.forEach(transformation => {
      if (transformation.type === 'rotation') {
        refImageData = this.applyRotationTransformation(transformation.data, refImageData);
      } else if (transformation.type === 'translate') {
        refImageData = this.applyTranslateTransformation(transformation.data, refImageData);
      }

      this.update();
    });
  }

  applyRotationTransformation(transformation, refImageData) {
    let {pixels, origin: { x: originX, y: originY }, angle} = transformation;
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
      let newX = rotatedx + originX, deltax = pixel.x - newX;
      let newY = rotatedy + originY, deltay = pixel.y - newY;


      let trueDeltaX = Math[deltax > 0 ? 'floor' : 'ceil'](deltax * pixel.fade);
      let trueDeltaY = Math[deltay > 0 ? 'floor' : 'ceil'](deltay * pixel.fade);

      let color = CanvasDistort.getColorForCoord(refImageData, pixel.x - trueDeltaX, pixel.y - trueDeltaY);
      imageData = CanvasDistort.setColorForCoord(imageData, pixel.x, pixel.y, color);
    }

    this.imageData = imageData;
    return imageData;
  }

  applyTranslateTransformation(transformation, refImageData) {
    const {pixels, deltax, deltay} = transformation;
    let imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);

    this.imageData.data.forEach((data, i) => {
      imageData.data[i] = data;
    });

    for (var i = 0; i < pixels.length; i++) {
      let pixel = pixels[i];
      let trueDeltaX = Math[deltax > 0 ? 'floor' : 'ceil'](deltax * pixel.fade);
      let trueDeltaY = Math[deltay > 0 ? 'floor' : 'ceil'](deltay * pixel.fade);

      let color = CanvasDistort.getColorForCoord(refImageData, pixel.x - trueDeltaX, pixel.y - trueDeltaY);
      imageData = CanvasDistort.setColorForCoord(imageData, pixel.x, pixel.y, color);
    }

    this.imageData = imageData;
    return imageData;
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
