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
  const containerBounding = document.getElementById('stage-container').getBoundingClientRect();
  const imgBounding  =document.getElementById('stage-img').getBoundingClientRect();

  const imgCoords = [imgBounding.top, imgBounding.left, imgBounding.bottom, imgBounding.right];
  const contCoords = [containerBounding.top, containerBounding.left, containerBounding.bottom, containerBounding.right];

  const topLeft = [contCoords[1] - imgCoords[1], contCoords[0] - imgCoords[0]]
  const bottomRight = [imgCoords[3] - contCoords[3], imgCoords[2] - contCoords[2]]
  const topLeftRelative = [topLeft[0] / imgBounding.width * 100, topLeft[1] / imgBounding.height * 100];
  const bottomRightRelative = [bottomRight[0] / imgBounding.width * 100, bottomRight[1] / imgBounding.height * 100];

  return [topLeftRelative, bottomRightRelative];
}