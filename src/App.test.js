import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the portfolio site hero heading', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const heading = screen.getByText(/Building Digital Experiences That Drive Results/i);
  expect(heading).toBeInTheDocument();
});
