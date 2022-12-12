import React, { useState, useRef, useEffect, useCallback } from 'react';
import { bound } from './util';
import { updateBrushSettings } from './workbenchReducer';

export default function Brush({ settings: {fade, size, opacity}, zoom, dispatch, container }) {
  const raf = useRef();
  const el = useRef();
  const adjustingFrom = useRef({rel: null, from: null, live: {fade, size}});

  const [position, setPosition] = useState({x: -999, y: -999});
  const [hidden, setHidden] = useState(true);

  const mouseMove = useCallback((event) => {
    cancelAnimationFrame(raf.current);

    raf.current = requestAnimationFrame(() => {
      const { top, left } = el.current.parentNode.getBoundingClientRect();

      let newHidden = false;
      const cX = event.clientX;
      const cY = event.clientY;
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
        const newSize = Math.ceil(bound(adjustingFrom.current.from.size + (diffY / 2), 1, 200));

        dispatch(updateBrushSettings('fade', newFade));
        dispatch(updateBrushSettings('size', newSize));

        return;
      }

      adjustingFrom.current.rel = null;
      adjustingFrom.current.from = null;

      setHidden(newHidden);
      setPosition({x, y});
    });
  }, [raf, container, dispatch]);

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