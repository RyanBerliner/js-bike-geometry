import React from 'react';

export default function Sidebar() {
  return <>
    <h2 className="ms-2 mt-4 h4 fw-bold">Image Details</h2>
    <div className="my-3 mx-2">
      <label for="image-select-input" class="form-label">Select an image</label>
      <input class="form-control" type="file" id="image-select-input" />
    </div>

    <h2 className="ms-2 mt-4 h4 fw-bold">Distortion Layers</h2>
    <ul className="list-unstyled">
      {[1, 2, 3].map(i => {
        return <li key={i} className="py-3 px-2 border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Head Tube</strong><br />
              <span className="text-muted">Rotational</span>
            </div>
            <div>
              <button className="btn ms-2 btn-light">Edit</button>
              <button className="btn ms-2 btn-light"><i className="bi bi-eye-fill me-1 opacity-50"></i> Show</button>
            </div>
          </div>
        </li>
      })}
    </ul>
    <button className="btn btn-light">
      <i className="bi bi-plus-lg me-1 opacity-75"></i>
      Add Distortion Layer
    </button>
  </>
}