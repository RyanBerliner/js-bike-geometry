import {
  setImgUrl,
  setImgDetails,
  updateStageZoom,
  updateStagePosition,
} from '../../workbenchReducer';

import { CanvasDistort } from '../../lib/CanvasDistort';
import { WorkbenchMiddleware } from '../../lib/CanvasDistortMiddleware';

describe('canvas distort middleware', () => {
  let canvasDistort;

  beforeEach(() => {
    canvasDistort = new CanvasDistort();
  })

  it('sets image url', () => {
    const middleware = WorkbenchMiddleware(canvasDistort).fn;
    middleware([setImgUrl('lorem')]);
    expect(canvasDistort.imageUrl).toBe('lorem');;
  })

  it('sets image details', () => {
    const middleware = WorkbenchMiddleware(canvasDistort).fn;
    middleware([setImgDetails('lorem')]);
    expect(canvasDistort.imageDetails).toBe('lorem');;
  })

  it('updates zoom', () => {
    const middleware = WorkbenchMiddleware(canvasDistort).fn;
    middleware([updateStageZoom(90)]);
    expect(canvasDistort.zoom).toBe(90);;
  })

  it('updates stage position', () => {
    const middleware = WorkbenchMiddleware(canvasDistort).fn;
    middleware([updateStagePosition(1, 2)]);
    expect(canvasDistort.posX).toBe(1);;
    expect(canvasDistort.posY).toBe(2);;
  })
});