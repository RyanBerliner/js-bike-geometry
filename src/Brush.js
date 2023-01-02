import React, { useState, useRef, useEffect, useCallback } from 'react';
import { bound } from './util';
import { updateBrushSettings, mapMergeLayer } from './workbenchReducer';

export default function Brush({
  settings: {fade, size, opacity},
  zoom,
  dispatch,
  container,
  canvasDistort,
  layer,
}) {
  const raf = useRef();
  const el = useRef();
  const stroke = useRef([]);

  const adjustingFrom = useRef({rel: null, from: null, live: {fade, size}});

  const [position, setPosition] = useState({x: -999, y: -999});
  const [hidden, setHidden] = useState(true);

  const startStroke = (event) => {
    if (event.button !== 0) {
      return;
    }

    const {top, left} = canvasDistort.element.getBoundingClientRect();
    const point = [(event.clientX - left) * (100/zoom), (event.clientY - top) * (100/zoom)];
    stroke.current = [point];
    canvasDistort.addTempStrokePoint(...point, size);
  }

  const endStroke = (event) => {
    const {top, left} = canvasDistort.element.getBoundingClientRect();
    const point = [(event.clientX - left) * (100/zoom), (event.clientY - top) * (100/zoom)];

    stroke.current.push(point);
    canvasDistort.addTempStrokePoint(...point);

    dispatch(mapMergeLayer(
      layer,
      stroke.current,
    ));

    stroke.current = [];
  }

  const mouseMove = useCallback((event) => {
    cancelAnimationFrame(raf.current);

    const cX = event.clientX;
    const cY = event.clientY;

    if (stroke.current.length > 0) {
      const {top, left} = canvasDistort.element.getBoundingClientRect();
      const point = [(event.clientX - left) * (100/canvasDistort.zoom), (event.clientY - top) * (100/canvasDistort.zoom)];

      stroke.current.push(point);
      canvasDistort.addTempStrokePoint(...point);
    }

    raf.current = requestAnimationFrame(() => {
      const { top, left } = el.current.parentNode.getBoundingClientRect();

      let newHidden = false;
      const x = cX - left;
      const y = cY - top;

      if (!container.current.contains(document.elementFromPoint(cX, cY))) {
        newHidden = true;
      }

      if (event.metaKey) {
        if (adjustingFrom.current.rel === null) {
          adjustingFrom.current.rel = {x, y};
          adjustingFrom.current.from = {...adjustingFrom.current.live};
        } 

        const diffX = x - adjustingFrom.current.rel.x;
        const diffY = y - adjustingFrom.current.rel.y;

        const newFade = Math.ceil(bound(adjustingFrom.current.from.fade + (diffX / 2), 0, 100));
        const newSize = Math.ceil(bound(adjustingFrom.current.from.size - (diffY / 2), 1, 200));

        dispatch(updateBrushSettings('fade', newFade));
        dispatch(updateBrushSettings('size', newSize));

        return;
      }

      adjustingFrom.current.rel = null;
      adjustingFrom.current.from = null;

      setHidden(newHidden);
      setPosition({x, y});
    });
  }, [raf, container, dispatch, canvasDistort]);

  useEffect(() => {
    document.addEventListener('mousemove', mouseMove);

    return () => {
      document.removeEventListener('mousemove', mouseMove);
      cancelAnimationFrame(raf.current)
    };
  });

  useEffect(() => {
    adjustingFrom.current.live.fade = fade;
    adjustingFrom.current.live.size = size;
  }, [fade, size]);

  return <span
    onMouseDown={startStroke}
    onMouseUp={endStroke}
    ref={el}
    className="brush position-absolute"
    draggable="false"
    style={{
      left: position.x,
      top: position.y,
      zIndex: 1,
      width: size,
      height: size,
      border: '1px solid black',
      borderRadius: '50%',
      display: 'block',
      opacity: hidden ? 0 : opacity / 100,
      transition: '0.1s opacity',
      backgroundImage:`radial-gradient(red ${fade}%, transparent)`,
      transform: `scale(${zoom / 100}) translate(-${size*(100/zoom) / 2}px, -${size*(100/zoom) / 2}px)`,
    }}
  />;
}