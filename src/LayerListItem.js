import React from 'react';
import { DISTORTION_ROTATIONAL, DISTORTION_TRANSLATIONAL, setDrawingLayer, updateLayer } from './workbenchReducer';

export function LayerListItem({id, layerData, dispatch, isDrawing}) {
  const toggleDraw = () => {
    dispatch(setDrawingLayer(isDrawing ? null : id))
  }

  const updateLayerValue = event => {
    dispatch(updateLayer(id, {[event.target.name]: event.target.value}));
  }

  return <li className="py-3 px-2 border-bottom" id={`layer-${id}`}>
    <div className="d-xl-flex justify-content-between align-items-center mb-3">
      <div className="text-truncate lh-sm">
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
    {layerData.type === DISTORTION_ROTATIONAL && <>
      <div className="row align-items-center">
        <label htmlFor={`rotationalangle-quick-${id}`} className="col-form-label col-3 text-nowrap lh-sm">Angle <br /><small className="text-muted">{layerData.rotationalangle} deg</small></label>
        <div className="col-9 d-flex align-items-center">
          <input type="range" className="form-range" id={`rotationalangle-quick-${id}`} name="rotationalangle" value={layerData.rotationalangle} onChange={updateLayerValue} min={-359} max={359} step={1} required={layerData.type === DISTORTION_ROTATIONAL} />
        </div>
      </div>
      <div className="row align-items-center">
        <label htmlFor={`rotationaloriginx-quick-${id}`} className="col-form-label col-3">OriginX</label>
        <div className="col-9 d-flex align-items-center">
          <input type="number" className="form-control form-control-sm" id={`rotationaloriginx-quick-${id}`} name="rotationaloriginx" value={layerData.rotationaloriginx} onChange={updateLayerValue} step={1} required={layerData.type === DISTORTION_ROTATIONAL} />
        </div>
      </div>
      <div className="row align-items-center">
        <label htmlFor={`rotationaloriginy-quick-${id}`} className="col-form-label col-3">OriginY</label>
        <div className="col-9 d-flex align-items-center">
          <input type="number" className="form-control form-control-sm" id={`rotationaloriginy-quick-${id}`} name="rotationaloriginy" value={layerData.rotationaloriginy} onChange={updateLayerValue} step={1} required={layerData.type === DISTORTION_ROTATIONAL} />
        </div>
      </div>
    </>}
    {layerData.type === DISTORTION_TRANSLATIONAL && <>
      <div className="row align-items-center">
        <label htmlFor={`translationalx-quick-${id}`} className="col-form-label col-3">TransX</label>
        <div className="col-9 d-flex align-items-center">
          <input type="number" className="form-control form-control-sm" id={`translationalx-quick-${id}`} name="translationalx" value={layerData.translationalx} onChange={updateLayerValue} step={1} required={layerData.type === DISTORTION_TRANSLATIONAL} />
        </div>
      </div>
      <div className="row align-items-center">
        <label htmlFor={`translationaly-quick-${id}`} className="col-form-label col-3">TransY</label>
        <div className="col-9 d-flex align-items-center">
          <input type="number" className="form-control form-control-sm" id={`translationaly-quick-${id}`} name="translationaly" value={layerData.translationaly} onChange={updateLayerValue} step={1} required={layerData.type === DISTORTION_TRANSLATIONAL} />
        </div>
      </div>
    </>}
  </li>
}