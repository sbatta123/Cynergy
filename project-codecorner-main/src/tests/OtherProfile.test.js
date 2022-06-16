/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import OtherProfile from '../components/OtherProfile';

test('renders other profile components', () => {
  render(
    <MemoryRouter>
      <OtherProfile />
    </MemoryRouter>,
  );
  let linkElement = screen.getByText('About');
  expect(linkElement).toBeInTheDocument();
  linkElement = screen.getByText('Tech Stack');
  expect(linkElement).toBeInTheDocument();
  linkElement = screen.getByText('Statistics');
  expect(linkElement).toBeInTheDocument();
});
