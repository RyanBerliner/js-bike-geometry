import React, { useRef, useEffect } from 'react';
import {setImgDetails, setImgUrl, updateStageZoom, updateStagePosition } from './workbenchReducer';
import { getCanvasOcclusion } from './Stage';
import { bound } from './util';

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

    dispatch(updateStagePosition(0, 0));
    dispatch(updateStageZoom(100));
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
        const [topLeftRelative, bottomRightRelative] = getCanvasOcclusion();

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
  }, [stageZoom, stageX, stageY, imageDetails]);

  const beginDrag = (e) => {
    if (e.nativeEvent.which !== 1) return;

    e.preventDefault();
    cancelAnimationFrame(tweenRaf.current);

    let startX = null, startY = null, absX = stageX, absY = stageY;

    function drag(event) {
      if (startX === null) startX = event.clientX;
      if (startY === null) startY = event.clientY;

      const diffX = (event.clientX - startX) / clippedImg.current.width * 100;
      const diffY = (event.clientY - startY) / clippedImg.current.height * 100;

      dispatch(updateStagePosition(
        bound(absX + diffX, -50, 50),
        bound(absY + diffY, -50, 50)
      ));
    }

    function mouseup() {
      document.removeEventListener('mouseup', mouseup);
      document.removeEventListener('mousemove', drag);
    }

    document.addEventListener('mouseup', mouseup);
    document.addEventListener('mousemove', drag);
  }

  function easeInOutCubic (time, startVal, endVal, duration) {
    const change = endVal - startVal;
    if ((time /= duration / 2) < 1) return change / 2 * time * time * time + startVal;
    return change / 2 * ((time -= 2) * time * time + 2) + startVal;
  }

  const onDoubleClick = () => {
    const duration = 500;
    const scale = getCanvasOcclusion()[2];
    const start = performance.now();

    function update(timestamp) {
      const time = timestamp - start;
      if (time > duration) {
        dispatch(updateStagePosition(0, 0));
        dispatch(updateStageZoom(scale));
        return;
      }

      dispatch(updateStageZoom(easeInOutCubic(time, stageZoom, scale, duration)));
      dispatch(updateStagePosition(
        easeInOutCubic(time, stageX, 0, duration),
        easeInOutCubic(time, stageY, 0, duration),
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
      style={{userSelect: 'none', cursor: stageX !== 0 || stageY !== 0 ? 'pointer' : 'default'}}
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