import { render, screen } from '@testing-library/react';
import App from './App';

test('renders react app', () => {
  render(<App />);
  const el = screen.getByText(/App/i);
  expect(el).toBeInTheDocument();
});
