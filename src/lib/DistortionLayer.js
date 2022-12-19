import { hash } from '../util';

export class DistortionLayer {
  id;
  displayMap;

  constructor({ id }) {
    this.id = id;
  }

  hash() {
    return hash(JSON.stringify({
      id: this.id,
      displayMap: this.displayMap,
    }))
  };

  applyToImageData() {
    // if displaying may, only show map, otherwise apply distortion
    // would we ever want to do both? would the map have the distortion applied?
    // probably to both of those question
    console.log('applying layer', this.id);
  };
};