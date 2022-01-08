import React, { useState, useRef, useEffect } from 'react';

export function ImageUpload() {
  const inputRef = useRef();
  const [imageSrc, setImageSrc] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);

  const onChange = event => {
    const {files} = event.target;
    if (files && files[0]) {
      const localImageURL = window.URL.createObjectURL(files[0]);
      setImageSrc(localImageURL);
    }
  }

  const onLoad = event => {
    setImageDetails({
      height: event.target.naturalHeight,
      width: event.target.naturalWidth,
    })
  }

  const remove = () => {
    setImageSrc(null);
    setImageDetails(null);
  }

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (imageSrc !== null) {
      return;
    }

    inputRef.current.value = null;
    inputRef.current.focus();
  }, [imageSrc]);

  return <>
    <div className={imageSrc ? 'd-none' : ''}>
      <label htmlFor="image-select-input" className="form-label">Select an image</label>
      <input className="form-control" type="file" id="image-select-input" onChange={onChange} ref={inputRef} />
    </div>
    <img src={imageSrc} alt="" className={`w-100 ${imageSrc ? 'mb-3' : 'd-none'}`} onLoad={onLoad} />
    {imageDetails && <div className="d-flex justify-content-between align-items-center">
      <button className="btn btn-sm btn-link text-danger" onClick={remove}>Remove</button>
      <span className="text-muted small mt-1">{imageDetails.width} x {imageDetails.height}</span>
    </div>}
  </>
}