import {
  SET_IMG_DETAILS,
  SET_IMG_URL,
  UPDATE_STAGE_POSITION,
  UPDATE_STAGE_ZOOM,
  ADD_LAYER,
} from "../workbenchReducer";
import { afterMiddleWare } from "../hooks";

export const WorkbenchMiddleware = canvasDistort => {
  return afterMiddleWare((actions, state) => {
    actions.forEach(({ type, payload }) => {
      switch(type) {
        case SET_IMG_URL:
          canvasDistort.imageUrl = payload;
          break;
        case SET_IMG_DETAILS:
          canvasDistort.imageDetails = payload;
          break;
        case UPDATE_STAGE_ZOOM:
          canvasDistort.zoom = payload;
          break;
        case UPDATE_STAGE_POSITION:
          canvasDistort.posX = payload[0]
          canvasDistort.posY = payload[1]
          break;
        case ADD_LAYER:
          // makes the assumption that the new layer was added to the end
          // since the id is generated in the reducer and not part of payload
          canvasDistort.addLayer({
            id: state.layerIds.slice(-1)[0],
          });
          break;
        default:
          break;
      }
    });
  });
};