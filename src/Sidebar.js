import React, { useCallback, useState, useRef } from 'react';
import {Modal} from 'bs5-react-elements';
import { LayerListItem } from './LayerListItem';
import {
  DISTORTION_ROTATIONAL,
  DISTORTION_TRANSLATIONAL,
  addLayer,
  updateLayer,
  removeLayer as removeLayerActionCreator
} from './workbenchReducer';

const NEW_LAYER = 'new-layer';
const NEW_LAYER_DATA = {name: 'new layer', type: DISTORTION_ROTATIONAL};

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
      <label htmlFor="image-select-input" className="form-label">Select an image</label>
      <input className="form-control" type="file" id="image-select-input" />
    </div>

    <h2 className="ms-2 mt-4 h4 fw-bold">Distortion Layers</h2>
    <ul className="list-unstyled">
      {data.layerIds.map(id => {
        return <LayerListItem key={id} id={id} layerData={data.layerData[id]} />
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