export class CanvasDistort {
  element;
  canvas;
  shownImage;

  get zoom() { return this._zoom; }
  set zoom(zoom) { this._zoom = zoom; this.render(); }

  get posX() { return this._posX; }
  set posX(coord) { this._posX = coord; this.render(); }

  get posY() { return this._posY; }
  set posY(coord) { this._posY = coord; this.render(); }

  get imageUrl() { return this._imageUrl; }
  set imageUrl(url) { this._imageUrl = url; this.render(); }

  get imageDetails() { return this._imageDetails; }
  set imageDetails(details) { this._imageDetails = details; this.render(); }

  initDOM(element) {
    this.element = element;

    this.canvas = document.createElement('canvas');
    this.element.appendChild(this.canvas);

    this.render();
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

      if (this.shownImage === this.imageUrl) {
        return;
      }

      this.shownImage = this.imageUrl;

      this.canvas.height = height;
      this.canvas.width = width;

      const image = new Image();
      image.onload = () => {
        const ctx = this.canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
      }

      image.src = this.imageUrl;
    } catch(e) {
      console.debug('Unable to render.', e)
    }
  }
}