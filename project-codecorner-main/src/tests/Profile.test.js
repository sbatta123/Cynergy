/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../components/Profile';

test('renders profile components', () => {
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>,
  );
  let linkElement = screen.getByText('About');
  expect(linkElement).toBeInTheDocument();
  linkElement = screen.getByText('Tech Stack');
  expect(linkElement).toBeInTheDocument();
  linkElement = screen.getByText('Statistics');
  expect(linkElement).toBeInTheDocument();
});
