import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('app', () => {
  it('renders new workbench by default', () => {
    render(<App />);
    expect(screen.getByTestId('workbench')).toBeInTheDocument();
    expect(screen.getByTestId('switch-workbench')).toHaveTextContent('View old workbench')
    expect(screen.getByText(/you are previewing the new workbench/i)).toBeInTheDocument();
  });

  it('has button that switches between workbenches', () => {
    render(<App />);
    const button = screen.getByTestId('switch-workbench');

    userEvent.click(button);
    expect(screen.getByTestId('old-workbench')).toBeInTheDocument();
    expect(screen.getByTestId('switch-workbench')).toHaveTextContent('View new workbench')
    expect(screen.getByText(/you are viewing the old workbench/i)).toBeInTheDocument();

    userEvent.click(button);
    expect(screen.getByTestId('workbench')).toBeInTheDocument();
    expect(screen.getByTestId('switch-workbench')).toHaveTextContent('View old workbench')
    expect(screen.getByText(/you are previewing the new workbench/i)).toBeInTheDocument();
  });
});