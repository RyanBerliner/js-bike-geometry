import { render, screen } from '@testing-library/react';
import {ImageUpload} from '../ImageUpload';
import {Simulate} from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

import {setImgDetails, setImgUrl} from '../workbenchReducer';

describe('image upload', () => {
  it('renders properly without image details', () => {
    const { asFragment } = render(<ImageUpload />);
    expect(asFragment()).toMatchSnapshot();
  })

  it('renders properly with image details', () => {
    const { asFragment } = render(<ImageUpload imageUrl="src" imageDetails={{height:1,width:2}} />);
    expect(asFragment()).toMatchSnapshot();
  })

  it('properly dispatches image upload on new upload', () => {
    const dispatch = jest.fn();
    window.URL.createObjectURL = jest.fn(() => 'blob-url')

    const file = new File(['test-image'], 'test-image.jpeg', {type: 'image/jpeg'})
    
    render(<ImageUpload dispatch={dispatch} />)

    const input = screen.getByLabelText('Select an image')
    Simulate.change(input, { target: { files: [file] } })
    expect(dispatch.mock.calls[0][0]).toStrictEqual(setImgUrl('blob-url'));

    const image = screen.getByTestId('load-image');
    Simulate.load(image, { target: { naturalHeight: 1, naturalWidth: 2, } });
    expect(dispatch.mock.calls[1][0]).toStrictEqual(setImgDetails({height:1,width:2}));
  })

  it('properly dispatches on image remove, revokes obj url', async () => {
    const dispatch = jest.fn();
    window.URL.revokeObjectURL = jest.fn()

    render(<ImageUpload dispatch={dispatch} imageUrl="src" imageDetails={{height:1,width:2}} />)
    await userEvent.click(screen.getByText(/remove/i));

    expect(window.URL.revokeObjectURL).toHaveBeenCalled();
    expect(dispatch.mock.calls[0][0]).toStrictEqual(setImgUrl(null));
    expect(dispatch.mock.calls[1][0]).toStrictEqual(setImgDetails(null));
  })

  it('focus input when imageSrc set to null, excluding first render', () => {
    const {rerender} = render(<ImageUpload imageUrl={null} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByLabelText('Select an image')).not.toBe(document.activeElement);

    rerender(<ImageUpload imageUrl="src" />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByLabelText('Select an image')).not.toBe(document.activeElement);

    rerender(<ImageUpload imageUrl={null} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByLabelText('Select an image')).toBe(document.activeElement);
  });
})