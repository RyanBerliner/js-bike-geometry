import React, { useEffect, useRef } from 'react';
import Brush from './Brush';

export const CONTAINER_ID = 'stage-container';
export const IMG_ID = 'stage-img';

export default function Stage({ drawingLayer, brushSettings, stageZoom, canvasDistort, dispatch }) {
  const canvasElement = useRef();

  useEffect(() => {
    canvasDistort.initDOM(canvasElement.current);
  }, [canvasDistort]);

  return <div className="bg-secondary bg-opacity-10 position-relative overflow-hidden" id={CONTAINER_ID}>
    {drawingLayer != null && <Brush settings={brushSettings} zoom={stageZoom} dispatch={dispatch} />}
    <div className="position-absolute start-50 top-50 translate-middle text-muted">
      <div ref={canvasElement} className="bg-white" id={IMG_ID} />
    </div>
  </div>
}

export function getCanvasOcclusion() {
  const img = document.getElementById(IMG_ID);
  const container = document.getElementById(CONTAINER_ID);

  if (!img || !container) {
    return [null, null, null]
  }

  const containerBounding = container.getBoundingClientRect();
  const imgBounding = img.getBoundingClientRect();

  const imgCoords = [imgBounding.top, imgBounding.left, imgBounding.bottom, imgBounding.right];
  const contCoords = [containerBounding.top, containerBounding.left, containerBounding.bottom, containerBounding.right];

  const topLeft = [contCoords[1] - imgCoords[1], contCoords[0] - imgCoords[0]]
  const bottomRight = [imgCoords[3] - contCoords[3], imgCoords[2] - contCoords[2]]
  const topLeftRelative = [topLeft[0] / imgBounding.width * 100, topLeft[1] / imgBounding.height * 100];
  const bottomRightRelative = [bottomRight[0] / imgBounding.width * 100, bottomRight[1] / imgBounding.height * 100];

  let fitScale = 100;
  const nativeHeight = img.offsetHeight;
  const nativeWidth = img.offsetWidth;
  const imageAspect = nativeHeight / nativeWidth;
  const stageAspect = containerBounding.height / containerBounding.width;

  if (imageAspect > stageAspect) {
    fitScale =  containerBounding.height / nativeHeight * 100;
  } else {
    fitScale =  containerBounding.width / nativeWidth * 100;
  }

  return [topLeftRelative, bottomRightRelative, fitScale];
}