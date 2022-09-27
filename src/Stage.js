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

export function getParts() {
  return {
    container: document.getElementById('stage-container'),
    img: document.getElementById('stage-img'),
  };
}