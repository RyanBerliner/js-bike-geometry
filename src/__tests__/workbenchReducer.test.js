import {
  INITIAL_DATA,
  DISTORTION_ROTATIONAL,
  DISTORTION_TRANSLATIONAL,
  BRUSH_MODE_ERASER,
  setImgUrl,
  setImgDetails,
  addLayer,
  removeLayer,
  updateLayer,
  reducer,
  setDrawingLayer,
  updateBrushSettings,
  updateStageZoom,
  updateStagePosition,
} from '../workbenchReducer';

describe('workbench reducer', () => {
  let state;

  beforeEach(() => {
    state = INITIAL_DATA;
  })

  it('has working setImgUrl action creator', () => {
    const newState = reducer(state, setImgUrl('new image url'));
    expect(newState.imageUrl).toBe('new image url');
  })

  it('has working setImgDetails action creator', () => {
    let newState = reducer(state, setImgDetails({name: 'value'}));
    expect(newState.imageDetails).toStrictEqual({name: 'value'});

    newState = reducer(newState, setImgDetails({name2: 'value2'}));
    expect(newState.imageDetails).toStrictEqual({name: 'value', name2: 'value2'});

    // should be able to clear by passing null
    newState = reducer(newState, setImgDetails(null));
    expect(newState.imageDetails).toStrictEqual(null);
  })

  it('has working addLayer action creator', () => {
    let newState = reducer(state, addLayer({name: 'layer 1', type: DISTORTION_ROTATIONAL}));
    expect(newState.layerIds).toStrictEqual(['1']);
    expect(newState.layerData['1']).toStrictEqual({name: 'layer 1', type: DISTORTION_ROTATIONAL});

    newState = reducer(newState, addLayer({name: 'layer 2', type: DISTORTION_TRANSLATIONAL}));
    expect(newState.layerIds).toStrictEqual(['1', '2']);
    expect(newState.layerData['2']).toStrictEqual({name: 'layer 2', type: DISTORTION_TRANSLATIONAL});
  })

  it('has resilient id generation in addLayer action creator', () => {
    state = {
      ...state,
      layerIds: ['2', '3'],
      layerData: {
        '2': {name: 'layer 2', type: DISTORTION_TRANSLATIONAL},
        '3': {name: 'layer 3', type: DISTORTION_TRANSLATIONAL},
      }
    }

    const newState = reducer(state, addLayer({name: 'new layer', type: DISTORTION_ROTATIONAL}));
    expect(newState.layerIds).toStrictEqual(['2', '3', '4']);
    expect(newState.layerData['4']).toStrictEqual({name: 'new layer', type: DISTORTION_ROTATIONAL});
  })

  it('has working removeLayer action creator', () => {
    state = {
      ...state,
      layerIds: ['1', '2', '3'],
      layerData: {
        '1': {name: 'layer 1', type: DISTORTION_TRANSLATIONAL},
        '2': {name: 'layer 2', type: DISTORTION_TRANSLATIONAL},
        '3': {name: 'layer 3', type: DISTORTION_TRANSLATIONAL},
      }
    };

    let newState = reducer(state, removeLayer('2'));
    expect(newState.layerIds).toStrictEqual(['1', '3']);
    expect(newState.layerData).toHaveProperty('1');
    expect(newState.layerData).toHaveProperty('3');
    expect(newState.layerData).not.toHaveProperty('2');

    newState = reducer(newState, removeLayer(1));  // intentional int support test
    expect(newState.layerIds).toStrictEqual(['3']);
    expect(newState.layerData).toHaveProperty('3');
    expect(newState.layerData).not.toHaveProperty('1');
    expect(newState.layerData).not.toHaveProperty('2');

    // If the drawing layer is deleted, the drawing layer should be set null
    newState = reducer({ ...newState, drawingLayer: '3' }, removeLayer('3'));
    expect(newState.layerIds).toStrictEqual([]);
    expect(newState.layerData).not.toHaveProperty('3');
    expect(newState.drawingLayer).toBe(null);
  })

  it('has working updateLayer action creator', () => {
    state = {
      ...state,
      layerIds: ['1', '2', '3'],
      layerData: {
        '1': {name: 'layer 1', type: DISTORTION_TRANSLATIONAL},
        '2': {name: 'layer 2', type: DISTORTION_TRANSLATIONAL},
        '3': {name: 'layer 3', type: DISTORTION_TRANSLATIONAL},
      }
    };

    let newState = reducer(state, updateLayer('2', {name: 'changed', type: DISTORTION_ROTATIONAL, extra: 'lorem'}));
    expect(newState.layerData['2']).toStrictEqual({
      name: 'changed',
      type: DISTORTION_ROTATIONAL,
      extra: 'lorem'
    });

    newState = reducer(newState, updateLayer('2', {name: 'changed again'}));
    expect(newState.layerData['2']).toStrictEqual({
      name: 'changed again',
      type: DISTORTION_ROTATIONAL,
      extra: 'lorem'
    });
  })

  it('has working setDrawingLayer action creator', () => {
    let newState = reducer(state, setDrawingLayer('1'));
    expect(newState.drawingLayer).toBe('1');

    newState = reducer(newState, setDrawingLayer(null));
    expect(newState.drawingLayer).toBe(null);
  })

  it('has working updateBrushSettings action creator', () => {
    let newState = reducer(state, updateBrushSettings('fade', 1));
    expect(newState.brushSettings.fade).toBe(1);

    newState = reducer(newState, updateBrushSettings('size', 1));
    expect(newState.brushSettings.size).toBe(1);

    newState = reducer(newState, updateBrushSettings('opacity', 1));
    expect(newState.brushSettings.opacity).toBe(1);

    newState = reducer(newState, updateBrushSettings('mode', BRUSH_MODE_ERASER));
    expect(newState.brushSettings.mode).toBe(BRUSH_MODE_ERASER);

    // ignores bad key
    newState = reducer(newState, updateBrushSettings('invalid', 1));
    expect(newState.brushSettings.invalid).toBeUndefined();
  })

  it('has working updateStageZoom action creator', () => {
    let newState = reducer(state, updateStageZoom(1));
    expect(newState.stageZoom).toBe(1);
  })

  it('has working updateStagePosition action creator', () => {
    let newState = reducer(state, updateStagePosition(1, 2));
    expect(newState.stageX).toBe(1);
    expect(newState.stageY).toBe(2);
    
  })
});