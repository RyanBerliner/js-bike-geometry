import React, { useCallback, useState, useRef } from 'react';
import {Modal} from 'bs5-react-elements';
import { LayerListItem } from './LayerListItem';
import { ImageUpload } from './ImageUpload';
import {
  DISTORTION_ROTATIONAL,
  DISTORTION_TRANSLATIONAL,
  addLayer,
  updateLayer,
  removeLayer as removeLayerActionCreator
} from './workbenchReducer';

const NEW_LAYER = 'new-layer';
const NEW_LAYER_DATA = {name: 'new layer', type: DISTORTION_ROTATIONAL, rotationalangle: 0, rotationaloriginx: 0, rotationaloriginy: 0};

export default function Sidebar({data, dispatch}) {
  const modal = useRef();
  const [modalId, setModalId] = useState(NEW_LAYER);
  const [modalData, setModalData] = useState(NEW_LAYER_DATA);

  const submit = event => {
    event.preventDefault();
    if (modalId === NEW_LAYER) {
      dispatch(addLayer(modalData));
    } else {
      dispatch(updateLayer(modalId, modalData));
    }
    modal.current.hide();
  };

  const updateModalData = event => {
    setModalData({
      ...modalData,
      [event.target.name]: event.target.value
    })
  }

  const removeLayer = () => {
    dispatch(removeLayerActionCreator(modalId));
    modal.current.hide();
  }

  const onShow = useCallback(event => {
    const layerId = event.relatedTarget.getAttribute('data-bs-layerid');
    setModalData(layerId === NEW_LAYER ? NEW_LAYER_DATA : data.layerData[layerId]);
    setModalId(layerId);
  }, [data]);

  return <>
    <h2 className="ms-2 mt-4 h4 fw-bold">Image Details</h2>
    <div className="my-3 mx-2">
      <ImageUpload dispatch={dispatch} imageUrl={data.imageUrl} imageDetails={data.imageDetails} />
    </div>

    <h2 className="ms-2 mt-4 h4 fw-bold">Distortion Layers</h2>
    <ul className="list-unstyled">
      {data.layerIds.map(id => {
        return <LayerListItem
          key={id}
          id={id}
          layerData={data.layerData[id]}
          dispatch={dispatch}
          isDrawing={data.drawingLayer === id}
        />
      })}
    </ul>
    <button className="btn btn-light mb-4" data-bs-target="#layer-modal" data-bs-toggle="modal" data-bs-layerid={NEW_LAYER}>
      <i className="bi bi-plus-lg me-1 opacity-75"></i>
      Add Distortion Layer
    </button>
    <Modal
      className="modal fade"
      id="layer-modal"
      tabIndex="-1"
      aria-hidden="true"
      onShow={onShow}
      component={modal}
    >
      <div className="modal-dialog">
        <form className="modal-content" onSubmit={submit}>
          <div className="modal-header">
            <h5 className="modal-title">{modalId === NEW_LAYER ? 'New' : 'Edit'} Layer</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="layer-name" className="form-label">Name</label>
              <input type="text" className="form-control" id="layer-name" name="name" value={modalData.name} onChange={updateModalData} required/>
            </div>
            <div className="mb-3">
              <label htmlFor="layer-type" className="form-label">Distortion Type</label>
              <select className="form-select" id="layer-type" name="type" value={modalData.type} onChange={updateModalData} required>
                <option value={DISTORTION_ROTATIONAL}>Rotational</option>
                <option value={DISTORTION_TRANSLATIONAL}>Translational</option>
              </select>
            </div>
            {modalData.type === DISTORTION_ROTATIONAL && <>
              <div className="mb-3">
                <label htmlFor="layer-rotationalangle" className="form-label">Rotational Angle ({modalData.rotationalangle} deg)</label>
                <input type="range" className="form-range" id="layer-rotationalangle" name="rotationalangle" value={modalData.rotationalangle} onChange={updateModalData} min={-359} max={359} step={1} required={modalData.type === DISTORTION_ROTATIONAL} />
              </div>
              <div className="row mb-3">
                <div className="col-6">
                  <label htmlFor="layer-rotationaloriginx" className="form-label">Origin X</label>
                  <input type="number" className="form-control" id="layer-rotationaloriginx" name="rotationaloriginx" value={modalData.rotationaloriginx} onChange={updateModalData} step={1} required={modalData.type === DISTORTION_ROTATIONAL} />
                </div>
                <div className="col-6">
                  <label htmlFor="layer-rotationaloriginy" className="form-label">Origin Y</label>
                  <input type="number" className="form-control" id="layer-rotationaloriginy" name="rotationaloriginy" value={modalData.rotationaloriginy} onChange={updateModalData} step={1} required={modalData.type === DISTORTION_ROTATIONAL} />
                </div>
              </div>
            </>}
            {modalData.type === DISTORTION_TRANSLATIONAL && <div className="row mb-3">
              <div className="col-6">
                <label htmlFor="layer-translationalx" className="form-label">Translate X</label>
                <input type="number" className="form-control" id="layer-translationalx" name="translationalx" value={modalData.translationalx} onChange={updateModalData} step={1} required={modalData.type === DISTORTION_TRANSLATIONAL} />
              </div>
              <div className="col-6">
                <label htmlFor="layer-translationaly" className="form-label">Translate Y</label>
                <input type="number" className="form-control" id="layer-translationaly" name="translationaly" value={modalData.translationaly} onChange={updateModalData} step={1} required={modalData.type === DISTORTION_TRANSLATIONAL} />
              </div>
            </div>}
          </div>
          <div className="modal-footer">
            {modalId !== NEW_LAYER && <button type="button" className="btn btn-link text-danger me-auto" onClick={removeLayer}>Delete</button>}
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" className="btn btn-primary">Save changes</button>
          </div>
        </form>
      </div>
    </Modal>
  </>
}