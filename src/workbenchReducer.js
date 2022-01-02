import {produce} from 'immer';

const SET_IMG_URL = 'set-image-url';
const SET_IMG_DETAILS = 'set-image-details';
const ADD_LAYER = 'add-layer';
const REMOVE_LAYER = 'remove-layer';
const UPDATE_LAYER = 'update-layer';

export const DISTORTION_ROTATIONAL = 'rotational';
export const DISTORTION_TRANSLATIONAL = 'translational';

export const INITIAL_DATA = {
  imageUrl: null,
  imageDetails: {},
  layerIds: [],
  layerData: {}
};

export const reducer = produce((draft, { type, payload }) => {
  switch(type) {
    case SET_IMG_URL:
      draft.imageUrl = payload;
      break;
    case SET_IMG_DETAILS:
      draft.imageDetails = {
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
      break;
    case UPDATE_LAYER:
      draft.layerData[payload.id] = {
        ...draft.layerData[payload.id],
        ...payload.details,
      }
      break;
    default:
      break;
  }

  return draft;
});

export const setImgUrl = url => ({ type: SET_IMG_URL, payload: url });
export const setImgDetails = details => ({ type: SET_IMG_DETAILS, payload: details });
export const addLayer = (name, type) => ({ type: ADD_LAYER, payload: {name, type} });
export const removeLayer = id => ({ type: REMOVE_LAYER, payload: id });
export const updateLayer = (id, details) => ({ type: UPDATE_LAYER, payload: {id, details} });
