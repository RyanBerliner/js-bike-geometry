import React from 'react';

export function LayerListItem({id, layerData, ...props}) {
  return <li className="py-3 px-2 border-bottom" {...props}>
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <strong>{layerData.name}</strong><br />
        <span className="text-muted">{layerData.type}</span>
      </div>
      <div>
        <button className="btn ms-2 btn-light" data-bs-target="#layer-modal" data-bs-toggle="modal" data-bs-layerid={id}>Edit</button>
        {/* <button className="btn ms-2 btn-light"><i className="bi bi-droplet-half me-1 opacity-50"></i> Draw Map</button> */}
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