import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header with name', () => {
  render(<App />);
  const headerElement = screen.getByText(/Hello, I'm Charles./i);
  expect(headerElement).toBeInTheDocument();
});

test('renders navigation menu', () => {
  render(<App />);
  const navbar = screen.getByRole('navigation');
  const navItems = navbar.querySelectorAll('li');
  
  expect(navItems[0]).toHaveTextContent('Home');
  expect(navItems[1]).toHaveTextContent('Skills');
  expect(navItems[2]).toHaveTextContent('Experience');
});

test('renders contact buttons', () => {
  render(<App />);
  const contactButton = screen.getByRole('link', { name: /contact me/i });
  const downloadButton = screen.getByRole('link', { name: /download cv/i });
  
  expect(contactButton).toHaveAttribute('href', '#contact');
  expect(downloadButton).toHaveAttribute('href', '/files/CharlesCV.pdf');
});
