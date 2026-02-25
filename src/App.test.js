import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portfolio site hero heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { level: 1, name: /Digital Experiences/i });
  expect(heading).toBeInTheDocument();
});
