/**
* @jest-environment jsdom
*/

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Homepage from '../components/Homepage';

test('user views homepage', async () => {
  render(
    <MemoryRouter>
      <Homepage />
    </MemoryRouter>,
  );

  await waitFor(() => {
    const role = screen.queryByText('Role');
    expect(role).toBeInTheDocument();
  });
});

test('user creates post', async () => {
  render(
    <MemoryRouter>
      <Homepage />
    </MemoryRouter>,
  );
  const postButton = screen.queryByText('post about a project...');
  userEvent.click(postButton);

  const backend = screen.queryByTestId('Backend-modal');
  const python = screen.queryByTestId('Python-modal');
  const medicine = screen.queryByTestId('Medicine-modal');
  const smallTeamSize = screen.queryByTestId('1-5 People-modal');
  const oneMonth = screen.queryByTestId('1 Month-modal');
  const leastHours = screen.queryByTestId('1-5 hours/week-modal');
  const post = screen.queryByText('Post');

  const titleInput = screen.getByPlaceholderText(/Name your project./i);
  const descriptionInput = screen.getByPlaceholderText(/Describe your project here./i);

  userEvent.type(titleInput, 'test');
  userEvent.type(descriptionInput, 'test description');

  userEvent.click(backend);
  userEvent.click(python);
  userEvent.click(medicine);
  userEvent.click(smallTeamSize);
  userEvent.click(oneMonth);
  userEvent.click(leastHours);
  userEvent.click(post);

  await waitFor(() => {
    const closeButton = screen.queryByText('Close');
    expect(closeButton).not.toBeInTheDocument();
  });
});

test('user filters posts', async () => {
  render(
    <MemoryRouter>
      <Homepage />
    </MemoryRouter>,
  );
  const frontend = screen.queryByText('Frontend');
  const backend = screen.queryByText('Backend');
  const python = screen.queryByText('Python');
  const medicine = screen.queryByText('Medicine');
  const smallTeamSize = screen.queryByText('1-5 People');
  const oneMonth = screen.queryByText('1 Month');
  const leastHours = screen.queryByText('1-5 hours/week');

  const filterButton = screen.queryByText('Filter');

  userEvent.click(frontend);
  userEvent.click(backend);
  userEvent.click(python);
  userEvent.click(medicine);
  userEvent.click(smallTeamSize);
  userEvent.click(oneMonth);
  userEvent.click(leastHours);
  userEvent.click(filterButton);

  await waitFor(() => {
    expect(filterButton).toBeInTheDocument();
  });
});
