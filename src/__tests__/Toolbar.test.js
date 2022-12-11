import { render, screen, fireEvent } from '@testing-library/react';
import { BRUSH_MODE_ERASER, updateBrushSettings, updateStageZoom } from '../workbenchReducer';
import Toolbar from '../Toolbar';

describe('toolbar', () => {
  it('renders properly', () => {
    const { asFragment } = render(
      <Toolbar
        data={{
          brushSettings: {
            size: 100,
            opacity: 75,
            fade: 50,
          },
          stageZoom: 25
        }}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  })

  it('properly dispatches change of size, opacity, fade, zoom', () => {
    const dispatch = jest.fn();

    render(
      <Toolbar
        data={{
          brushSettings: {
            size: 100,
            opacity: 75,
            fade: 50,
          },
          stageZoom: 25
        }}
        dispatch={dispatch}
      />
    )

    fireEvent.change(screen.getByLabelText('Size'), {target: {value: '25'}});
    expect(dispatch.mock.calls[0][0]).toStrictEqual(updateBrushSettings('size', 25));

    fireEvent.change(screen.getByLabelText('Opacity'), {target: {value: '25'}});
    expect(dispatch.mock.calls[1][0]).toStrictEqual(updateBrushSettings('opacity', 25));

    fireEvent.change(screen.getByLabelText('Fade'), {target: {value: '25'}});
    expect(dispatch.mock.calls[2][0]).toStrictEqual(updateBrushSettings('fade', 25));

    fireEvent.change(screen.getByLabelText('Mode'), {target: {value: BRUSH_MODE_ERASER}});
    expect(dispatch.mock.calls[3][0]).toStrictEqual(updateBrushSettings('mode', BRUSH_MODE_ERASER));

    fireEvent.change(screen.getByRole('slider'), {target: {value: '15'}});
    expect(dispatch.mock.calls[4][0]).toStrictEqual(updateStageZoom(15));
  })
})