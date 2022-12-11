import React, { useState, useRef, useEffect, useCallback } from 'react';
import { bound } from './util';
import { updateBrushSettings } from './workbenchReducer';

export default function Brush({ settings: {fade, size, opacity}, zoom, dispatch }) {
  const raf = useRef();
  const el = useRef();
  const adjustingFrom = useRef({rel: null, from: null, live: {fade, size}});

  const [position, setPosition] = useState({x: 0, y: 0});

  const mouseMove = useCallback((event) => {
    cancelAnimationFrame(raf.current);
    const { top, left } = el.current.parentNode.getBoundingClientRect();

    const x = event.clientX - left;
    const y = event.clientY - top;
    if (event.metaKey) {
      if (adjustingFrom.current.rel === null) {
        adjustingFrom.current.rel = {x, y};
        adjustingFrom.current.from = {...adjustingFrom.current.live};
      }

      const diffX = x - adjustingFrom.current.rel.x;
      const diffY = y - adjustingFrom.current.rel.y;

      const newFade = Math.ceil(bound(adjustingFrom.current.from.fade + (diffX / 2), 0, 100));
      const newSize = Math.ceil(bound(adjustingFrom.current.from.size + (diffY / 2), 1, 200));

      dispatch(updateBrushSettings('fade', newFade));
      dispatch(updateBrushSettings('size', newSize));

      return;
    }

    adjustingFrom.current.rel = null;
    adjustingFrom.current.from = null;

    raf.current = requestAnimationFrame(() => {
      setPosition({x, y});
    });
  }, [raf, dispatch]);

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
    ref={el}
    className="brush position-absolute"
    style={{
      left: position.x,
      top: position.y,
      cursor: 'crosshair',
      zIndex: 1,
      width: size,
      height: size,
      border: '1px solid black',
      borderRadius: '50%',
      display: 'block',
      opacity: opacity / 100,
      backgroundImage:`radial-gradient(red ${fade}%, transparent)`,
      transform: `scale(${zoom / 100}) translate(-${size*(100/zoom) / 2}px, -${size*(100/zoom) / 2}px)`,
    }}
  />;
}