import { hash } from '../util';
import { DistortionLayer } from './DistortionLayer';

export class CanvasDistort {
  element;
  canvas;
  shownImage;
  tempStroke;

  // Flag for if the initial object has been set up yet
  setUp;

  // Hash the layers + image shown so we know if there is a diff
  renderedHash;
  currentHash;

  get zoom() { return this._zoom; }
  set zoom(zoom) { this._zoom = zoom; this.render(); }

  get posX() { return this._posX; }
  set posX(coord) { this._posX = coord; this.render(); }

  get posY() { return this._posY; }
  set posY(coord) { this._posY = coord; this.render(); }

  get imageUrl() { return this._imageUrl; }
  set imageUrl(url) { this._imageUrl = url; this.updateHash(); this.render(); }

  get imageDetails() { return this._imageDetails; }
  set imageDetails(details) { this._imageDetails = details; this.render(); }

  get layers() { return this._layers || []; }

  addLayer(layerProps) {
    if (!Array.isArray(this._layers)) {
      this._layers = [];
    }

    this._layers.push(new DistortionLayer(layerProps));

    this.updateHash();
    this.render();
  };

  initDOM(element) {
    this.element = element;

    this.canvas = document.createElement('canvas');
    this.element.appendChild(this.canvas);

    this.render();
  }

  addTempStrokePoint(rawX, rawY, width) {
    // use width on first point of stroke
    const { context, offsetX, offsetY } = width == null
      ? this.tempStroke
      : (() => {
        this.tempStroke = {};
        this.tempStroke.context = this.canvas.getContext('2d')
        this.tempStroke.context.lineWidth = width;
        this.tempStroke.context.lineCap = 'round';
        this.tempStroke.context.strokeStyle = 'rgba(255, 0, 0, 1)';
        this.tempStroke.context.beginPath();

        const {top, left} = this.element.getBoundingClientRect();

        this.tempStroke.offsetX = left;
        this.tempStroke.offsetY = top;

        return this.tempStroke;
      })();

    const pos = [(rawX - offsetX) * (100/this.zoom), (rawY - offsetY) * (100/this.zoom)];
    context.moveTo(...pos);
    context.lineTo(...pos);
    context.stroke()
  }

  updateHash() {
    this.currentHash = hash(JSON.stringify({
      image: this._imageUrl,
      layers: this.layers.map(l => l.hash()),
    }));
  }

  render() {
    try {
      if (!this.element || !this.canvas) {
        throw Error('No element or canvas, have you called canvasDistort.initDOM() yet?');
      }

      if (!this.imageUrl || !this.imageDetails?.height || !this.imageDetails?.width) {
        throw Error('No image or image details. Have you selected an image yet?')
      }

      const {height, width} = this.imageDetails;

      this.element.style.height = `${height}px`;
      this.element.style.width = `${width}px`;
      this.element.style.transform = `scale(${this.zoom / 100}) translate(${-1 * this.posX}%, ${-1 * this.posY}%)`;

      if (this.currentHash === this.renderedHash) {
        return;
      }

      this.renderedHash = this.currentHash;
      this.canvas.height = height;
      this.canvas.width = width;

      const image = new Image();
      image.onload = () => {
        const ctx = this.canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);

        // TODO can cache lower level layers?
        let imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.layers.forEach(l => {
          imageData = l.applyToImageData(imageData);
        });
      }

      image.src = this.imageUrl;
    } catch(e) {
      console.debug('Unable to render.', e)
    }
  }
}