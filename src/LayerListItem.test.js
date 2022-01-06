import { render, screen, fireEvent } from '@testing-library/react';
import {LayerListItem} from './LayerListItem';
import { updateLayer } from './workbenchReducer';
import { DISTORTION_ROTATIONAL, DISTORTION_TRANSLATIONAL } from './workbenchReducer';

describe('layer list item', () => {
  describe('rotational layer', () => {
    it('renders rotational layer', () => {
      const { asFragment } = render(
        <LayerListItem
          id="1"
          layerData={{
            name: 'layer name',
            type: DISTORTION_ROTATIONAL,
            rotationalangle: 10,
            rotationaloriginx: 20,
            rotationaloriginy: 30,
          }}
        />
      );
  
      expect(asFragment()).toMatchSnapshot();
    })

    it('properly dispatches change of angle, originx, originy', () => {
      const dispatch = jest.fn();

      render(
        <LayerListItem
          id="1"
          layerData={{
            name: 'layer name',
            type: DISTORTION_ROTATIONAL,
            rotationalangle: 10,
            rotationaloriginx: 20,
            rotationaloriginy: 30,
          }}
          dispatch={dispatch}
        />
      )

      fireEvent.change(screen.getByRole('slider'), {target: {value: '15'}});
      expect(dispatch.mock.calls[0][0]).toStrictEqual(updateLayer('1', {rotationalangle: '15'}));

      fireEvent.change(screen.getByLabelText('OriginX'), {target: {value: '25'}});
      expect(dispatch.mock.calls[1][0]).toStrictEqual(updateLayer('1', {rotationaloriginx: '25'}));

      fireEvent.change(screen.getByLabelText('OriginY'), {target: {value: '35'}});
      expect(dispatch.mock.calls[2][0]).toStrictEqual(updateLayer('1', {rotationaloriginy: '35'}));
    })
  })

  describe('translational layer', () => {
    it('renders translational layer', () => {
      const { asFragment } = render(
        <LayerListItem
          id="1"
          layerData={{
            name: 'layer name',
            type: DISTORTION_TRANSLATIONAL,
            translationalx: 20,
            translationaly: 30,
          }}
        />
      );
  
      expect(asFragment()).toMatchSnapshot();
    })

    it('properly dispatches change of translate x, translate y', () => {
      const dispatch = jest.fn();

      render(
        <LayerListItem
          id="1"
          layerData={{
            name: 'layer name',
            type: DISTORTION_TRANSLATIONAL,
            translationalx: 20,
            translationaly: 30,
          }}
          dispatch={dispatch}
        />
      )

      fireEvent.change(screen.getByLabelText('TransX'), {target: {value: '25'}});
      expect(dispatch.mock.calls[0][0]).toStrictEqual(updateLayer('1', {translationalx: '25'}));

      fireEvent.change(screen.getByLabelText('TransY'), {target: {value: '35'}});
      expect(dispatch.mock.calls[1][0]).toStrictEqual(updateLayer('1', {translationaly: '35'}));
    })
  });
})