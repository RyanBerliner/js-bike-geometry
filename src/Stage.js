import React, { useEffect, useRef } from 'react';

export default function Stage({ canvasDistort }) {
  const canvasElement = useRef();

  useEffect(() => {
    canvasDistort.initDOM(canvasElement.current);
  }, [canvasDistort]);

  return <div className="bg-secondary bg-opacity-10 position-relative overflow-hidden" id="stage-container">
    <div className="position-absolute start-50 top-50 translate-middle text-muted">
      <div ref={canvasElement} className="bg-white" id="stage-img" />
    </div>
  </div>
}

export function getCanvasOcclusion() {
  const img = document.getElementById('stage-img');
  const container = document.getElementById('stage-container');

  const containerBounding = container.getBoundingClientRect();
  const imgBounding = img.getBoundingClientRect();

  const imgCoords = [imgBounding.top, imgBounding.left, imgBounding.bottom, imgBounding.right];
  const contCoords = [containerBounding.top, containerBounding.left, containerBounding.bottom, containerBounding.right];

  const topLeft = [contCoords[1] - imgCoords[1], contCoords[0] - imgCoords[0]]
  const bottomRight = [imgCoords[3] - contCoords[3], imgCoords[2] - contCoords[2]]
  const topLeftRelative = [topLeft[0] / imgBounding.width * 100, topLeft[1] / imgBounding.height * 100];
  const bottomRightRelative = [bottomRight[0] / imgBounding.width * 100, bottomRight[1] / imgBounding.height * 100];

  let scale = 100;
  const nativeHeight = img.offsetHeight;
  const nativeWidth = img.offsetWidth;
  const imageAspect = nativeHeight / nativeWidth;
  const stageAspect = containerBounding.height / containerBounding.width;

  const padding = 5; // give the image some space, not exact fit

  if (imageAspect > stageAspect) {
    scale =  containerBounding.height / nativeHeight * 100 - padding;
  } else {
    scale =  containerBounding.width / nativeWidth * 100 - padding;
  }

  return [topLeftRelative, bottomRightRelative, scale];
}