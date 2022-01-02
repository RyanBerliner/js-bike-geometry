import {
  INITIAL_DATA,
  DISTORTION_ROTATIONAL,
  DISTORTION_TRANSLATIONAL,
  setImgUrl,
  setImgDetails,
  addLayer,
  removeLayer,
  updateLayer,
  reducer,
  setDrawingLayer
} from './workbenchReducer';

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
});