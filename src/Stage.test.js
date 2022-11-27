
import { render } from '@testing-library/react';
import { CanvasDistort } from './lib/CanvasDistort';
import Stage, { CONTAINER_ID, getCanvasOcclusion, IMG_ID } from './Stage';

describe('stage', () => {
  it('renders properly and inits canvas distort in dom', () => {
    const canvasDistort = new CanvasDistort();
    jest.spyOn(canvasDistort, 'initDOM');

    const { asFragment } = render(<Stage canvasDistort={canvasDistort} />);

    expect(asFragment()).toMatchSnapshot();
    expect(canvasDistort.initDOM).toHaveBeenCalledTimes(1);
  })
})

describe('get canvas occlusion', () => {
  function mockDiv(width, height, nativeWidth, nativeHeight, x, y) {
    const div = document.createElement('div')

    div.getBoundingClientRect = () => ({
      height,
      width,
      top: y - (height / 2),
      bottom: y + (height / 2),
      left: x - (width / 2),
      right: x + (width / 2),
    });

    Object.defineProperty(div, 'offsetWidth', { writable: true });
    Object.defineProperty(div, 'offsetHeight', { writable: true });

    div.offsetHeight = nativeHeight;
    div.offsetWidth = nativeWidth;

    return div;
  }

  beforeEach(() => {
    document.body.innerHTML = '';
  })

  it('returns all nulls on missing elements', () => {
    expect(getCanvasOcclusion()).toStrictEqual([null, null, null]);
  })

  it('calculates occlusion and scale properly (hotdog)', () => {
    const containerDiv = mockDiv(100, 75, 100, 75, 75, 50)
    containerDiv.setAttribute('id', CONTAINER_ID)

    const imgDiv = mockDiv(150, 100, 300, 200, 10, 20)
    imgDiv.setAttribute('id', IMG_ID)

    containerDiv.appendChild(imgDiv)
    document.body.appendChild(containerDiv);

    expect(getCanvasOcclusion()).toStrictEqual([
      [60, 42.5],
      [-26.666666666666668, -17.5],
      33.33333333333333,
    ]);
  })

  it('calculates occlusion and scale properly (hamburger)', () => {
    const containerDiv = mockDiv(100, 40, 100, 40, 75, 50)
    containerDiv.setAttribute('id', CONTAINER_ID)

    const imgDiv = mockDiv(150, 100, 300, 200, 10, 20)
    imgDiv.setAttribute('id', IMG_ID)

    containerDiv.appendChild(imgDiv)
    document.body.appendChild(containerDiv);

    expect(getCanvasOcclusion()).toStrictEqual([
      [60, 60],
      [-26.666666666666668, 0],
      20,
    ]);
  })
})