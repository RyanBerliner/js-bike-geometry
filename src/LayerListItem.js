import React from 'react';
import { setDrawingLayer } from './workbenchReducer';

export function LayerListItem({id, layerData, dispatch, isDrawing}) {
  const toggleDraw = () => {
    dispatch(setDrawingLayer(isDrawing ? null : id))
  }

  return <li className="py-3 px-2 border-bottom" id={`layer-${id}`}>
    <div className="d-xl-flex justify-content-between align-items-center">
      <div className="text-truncate">
        <strong>{layerData.name}</strong><br />
        <span className="text-muted">{layerData.type}</span>
      </div>
      <div className="text-nowrap mt-xl-0 mt-2">
        <button className="btn ms-xl-2 me-2 btn-light" data-bs-target="#layer-modal" data-bs-toggle="modal" data-bs-layerid={id}>Edit</button>
        <button className={`btn ${isDrawing ? 'btn-danger' : 'btn-light'}`} onClick={toggleDraw}>
          <i className={`bi me-1 ${isDrawing ? 'opacity-75 bi-x-lg' : 'opacity-50 bi-brush-fill'}`}></i> {isDrawing ? 'Stop' : 'Draw'}
        </button>
      </div>
    </div>
    {/* <div className="row align-items-center">
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
    </div> */}
  </li>
}