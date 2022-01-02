import React from 'react';
import {Modal} from 'bs5-react-elements';

export default function Sidebar() {
  return <>
    <h2 className="ms-2 mt-4 h4 fw-bold">Image Details</h2>
    <div className="my-3 mx-2">
      <label htmlFor="image-select-input" className="form-label">Select an image</label>
      <input className="form-control" type="file" id="image-select-input" />
    </div>

    <h2 className="ms-2 mt-4 h4 fw-bold">Distortion Layers</h2>
    <ul className="list-unstyled">
      {[1, 2, 3, 4, 5].map(i => {
        return <li key={i} className="py-3 px-2 border-bottom">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <strong>Head Tube</strong><br />
              <span className="text-muted">Rotational</span>
            </div>
            <div>
              <button className="btn ms-2 btn-light" data-bs-target="#layer-modal" data-bs-toggle="modal">Edit</button>
              <button className="btn ms-2 btn-light"><i className="bi bi-droplet-half me-1 opacity-50"></i> Draw Map</button>
            </div>
          </div>
          <div className="row align-items-center">
            <label htmlFor="angle-adjust" className="col-form-label col-3">Angle</label>
            <div className="col-9 d-flex align-items-center">
              <input type="range" className="form-range" id="angle-adjust" />
            </div>
          </div>
          <div className="row align-items-center">
            <label htmlFor="angle-origin-x" className="col-form-label col-3">Origin X</label>
            <div className="col-9 d-flex align-items-center">
              <input type="number" className="form-control form-control-sm" id="angle-origin-x" />
            </div>
          </div>
          <div className="row align-items-center">
            <label htmlFor="angle-origin-y" className="col-form-label col-3">Origin Y</label>
            <div className="col-9 d-flex align-items-center">
              <input type="number" className="form-control form-control-sm" id="angle-origin-y" />
            </div>
          </div>
        </li>
      })}
    </ul>
    <button className="btn btn-light mb-4" data-bs-target="#layer-modal" data-bs-toggle="modal">
      <i className="bi bi-plus-lg me-1 opacity-75"></i>
      Add Distortion Layer
    </button>
    <Modal
      className="modal fade"
      id="layer-modal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Layer</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="layer-name" className="form-label">Name</label>
              <input type="text" className="form-control" id="layer-name" />
            </div>
            <div className="mb-3">
              <label htmlFor="layer-type" className="form-label">Distortion Type</label>
              <select className="form-select" id="layer-type">
                <option>Rotational</option>
                <option>Translational</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-link text-danger me-auto">Delete</button>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </Modal>
  </>
}