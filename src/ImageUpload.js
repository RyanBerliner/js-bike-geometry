import React, { useRef, useEffect } from 'react';
import {setImgDetails, setImgUrl, updateStagePosition } from './workbenchReducer';
import { getParts } from './Stage';

export function ImageUpload({ dispatch, imageUrl, imageDetails, stageZoom, stageX, stageY }) {
  const inputRef = useRef();
  const viewBox = useRef();
  const clippedImg = useRef();
  const tweenRaf = useRef();

  const onChange = event => {
    const {files} = event.target;
    if (files && files[0]) {
      const localImageURL = window.URL.createObjectURL(files[0]);
      dispatch(setImgUrl(localImageURL));
    }
  }

  const onLoad = event => {
    dispatch(setImgDetails({
      height: event.target.naturalHeight,
      width: event.target.naturalWidth,
    }))
  }

  const remove = () => {
    window.URL.revokeObjectURL(imageUrl);
    dispatch(setImgUrl(null));
    dispatch(setImgDetails(null));
  }

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (imageUrl !== null) {
      return;
    }

    inputRef.current.value = null;
    inputRef.current.focus();
  }, [imageUrl]);

  useEffect(() => {
    let raf;

    const resize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const { container, img } = getParts();

        const imgBounding = img.getBoundingClientRect();
        const containerBounding = container.getBoundingClientRect();

        const imgCoords = [imgBounding.top, imgBounding.left, imgBounding.bottom, imgBounding.right];
        const contCoords = [containerBounding.top, containerBounding.left, containerBounding.bottom, containerBounding.right];

        // x, y being being trimmed
        const topLeft = [contCoords[1] - imgCoords[1], contCoords[0] - imgCoords[0]]
        const bottomRight = [imgCoords[3] - contCoords[3], imgCoords[2] - contCoords[2]]
        const topLeftRelative = [topLeft[0] / imgBounding.width * 100, topLeft[1] / imgBounding.height * 100];
        const bottomRightRelative = [bottomRight[0] / imgBounding.width * 100, bottomRight[1] / imgBounding.height * 100];

        viewBox.current.style.left = `${topLeftRelative[0]}%`;
        viewBox.current.style.top = `${topLeftRelative[1]}%`;
        viewBox.current.style.right = `${bottomRightRelative[0]}%`;
        viewBox.current.style.bottom = `${bottomRightRelative[1]}%`;
        clippedImg.current.style.clipPath = `inset(${topLeftRelative[1]}% ${bottomRightRelative[0]}% ${bottomRightRelative[1]}% ${topLeftRelative[0]}%)`;
      });
    }

    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, [stageZoom, stageX, stageY]);

  const beginDrag = (e) => {
    e.preventDefault();
    cancelAnimationFrame(tweenRaf.current);

    let startX = null, startY = null, absX = stageX, absY = stageY;

    function drag(event) {
      if (startX === null) startX = event.clientX;
      if (startY === null) startY = event.clientY;

      // percentages
      const diffX = (event.clientX - startX) / clippedImg.current.width * 100;
      const diffY = (event.clientY - startY) / clippedImg.current.height * 100;

      // lets do percentage offset from the middle
      dispatch(updateStagePosition(absX + diffX, absY + diffY))
    }

    function mouseup() {
      document.removeEventListener('mouseup', mouseup);
      document.removeEventListener('mousemove', drag);
    }

    document.addEventListener('mouseup', mouseup);
    document.addEventListener('mousemove', drag);
  }

  function easeInOutCubic (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
}

  const onDoubleClick = () => {
    const xb = stageX, yb = stageY, xc = -stageX, yc = -stageY;
    const duration = 500;
    let start = performance.now();

    function update(timestamp) {
      const time = timestamp - start;
      if (time >= duration) {
        dispatch(updateStagePosition(0, 0));
        return;
      }

      dispatch(updateStagePosition(
        easeInOutCubic(time, xb, xc, duration),
        easeInOutCubic(time, yb, yc, duration),
      ));

      tweenRaf.current = requestAnimationFrame(update);
    }

    tweenRaf.current = requestAnimationFrame(update);
  }

  return <>
    <div className={imageUrl ? 'd-none' : ''}>
      <label htmlFor="image-select-input" className="form-label">Select an image</label>
      <input className="form-control" type="file" id="image-select-input" onChange={onChange} ref={inputRef} />
    </div>
    <div
      className={`position-relative overflow-hidden rounded ${imageUrl ? 'mb-3' : 'd-none'}`}
      onDoubleClick={onDoubleClick}
      style={{userSelect: 'none'}}
    >
      <img src={imageUrl} alt="" className="pe-none w-100" style={{filter: 'brightness(0.6)'}} onLoad={onLoad} />
      <img src={imageUrl} alt="" className="pe-none w-100 position-absolute start-0 top-0" ref={clippedImg} />
      <div
        ref={viewBox}
        className="border border-danger border-3 position-absolute shadow"
        onMouseDown={beginDrag}
        style={{cursor: 'move'}}
      />
    </div>
    {imageDetails && <div className="d-flex justify-content-between align-items-center">
      <span className="text-muted small mt-1" data-testid="upload-dimensions">{imageDetails.width} x {imageDetails.height}</span>
      <button className="btn btn-sm btn-link text-danger" onClick={remove} data-testid="remove-upload">Remove</button>
    </div>}
  </>
}