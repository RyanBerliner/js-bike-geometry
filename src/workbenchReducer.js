import {produce} from 'immer';

const SET_IMG_URL = 'set-image-url';
const SET_IMG_DETAILS = 'set-image-details';
const ADD_LAYER = 'add-layer';
const REMOVE_LAYER = 'remove-layer';
const UPDATE_LAYER = 'update-layer';
const SET_DRAWING_LAYER = 'set-drawing-layer';
const UPDATE_BRUSH_SETTINGS = 'update-brush-settings';
const UPDATE_STAGE_ZOOM = 'update-stage-zoom';

export const DISTORTION_ROTATIONAL = 'rotational';
export const DISTORTION_TRANSLATIONAL = 'translational';

export const INITIAL_DATA = {
  imageUrl: null,
  imageDetails: null,
  layerIds: [],
  layerData: {},
  drawingLayer: null,
  brushSettings: {
    fade: 50,
    size: 50,
    opacity: 100
  },
  stageZoom: 100
};

export const reducer = produce((draft, { type, payload }) => {
  switch(type) {
    case SET_IMG_URL:
      draft.imageUrl = payload;
      break;
    case SET_IMG_DETAILS:
      draft.imageDetails = payload === null ? null : {
        ...draft.imageDetails,
        ...payload
      };
      break;
    case ADD_LAYER:
      var id = (
        draft.layerIds.length === 0
          ? 1
          : parseInt(Math.max(...draft.layerIds)) + 1
      ).toString();

      draft.layerIds.push(id);
      draft.layerData[id] = payload;
      break;
    case REMOVE_LAYER:
      payload = payload.toString();
      draft.layerIds = draft.layerIds.filter(id => id !== payload);
      delete draft.layerData[payload];
      if (draft.drawingLayer === payload) draft.drawingLayer = null;
      break;
    case UPDATE_LAYER:
      draft.layerData[payload.id] = {
        ...draft.layerData[payload.id],
        ...payload.details,
      }
      break;
    case SET_DRAWING_LAYER:
      draft.drawingLayer = payload;
      break;
    case UPDATE_BRUSH_SETTINGS:
      draft.brushSettings[payload.setting] = payload.value;
      break;
    case UPDATE_STAGE_ZOOM:
      draft.stageZoom = payload;
      break;
    default:
      break;
  }

  return draft;
});

export const setImgUrl = url => ({ type: SET_IMG_URL, payload: url });
export const setImgDetails = details => ({ type: SET_IMG_DETAILS, payload: details });
export const addLayer = details => ({ type: ADD_LAYER, payload: details });
export const removeLayer = id => ({ type: REMOVE_LAYER, payload: id });
export const updateLayer = (id, details) => ({ type: UPDATE_LAYER, payload: {id, details} });
export const setDrawingLayer = id => ({ type: SET_DRAWING_LAYER, payload: id });
export const updateBrushSettings = (setting, value) => ({ type: UPDATE_BRUSH_SETTINGS, payload: {setting, value}});
export const updateStageZoom = stageZoom => ({ type: UPDATE_STAGE_ZOOM, payload: stageZoom });
