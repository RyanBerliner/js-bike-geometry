import React, { useRef, useEffect } from 'react';
import {setImgDetails, setImgUrl} from './workbenchReducer';

export function ImageUpload({ dispatch, imageUrl, imageDetails }) {
  const inputRef = useRef();

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

  return <>
    <div className={imageUrl ? 'd-none' : ''}>
    <label htmlFor="image-select-input" className="form-label">Select an image</label>
    <input className="form-control" type="file" id="image-select-input" onChange={onChange} ref={inputRef} />
    </div>
    <img src={imageUrl} alt="" className={`w-100 ${imageUrl ? 'mb-3' : 'd-none'}`} onLoad={onLoad} />
    {imageDetails && <div className="d-flex justify-content-between align-items-center">
      <span className="text-muted small mt-1" data-testid="upload-dimensions">{imageDetails.width} x {imageDetails.height}</span>
      <button className="btn btn-sm btn-link text-danger" onClick={remove} data-testid="remove-upload">Remove</button>
      </div>}
    </>
}
