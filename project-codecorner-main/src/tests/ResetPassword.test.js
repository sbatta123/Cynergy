/**
* @jest-environment jsdom
*/

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ResetPassword from '../components/ResetPassword';

test('user resets password', async () => {
  render(
    <MemoryRouter>
      <ResetPassword />
    </MemoryRouter>,
  );
  const user = {
    username: 'emoneil',
    newPassword: 'hi',
  };
  const usernameInput = screen.getByPlaceholderText(/Enter username/i);
  const newPasswordInput = screen.getByPlaceholderText(/Enter password/i);
  const buttonSubmit = screen.getByText('Submit');
  userEvent.type(usernameInput, user.username);
  userEvent.type(newPasswordInput, user.newPassword);
  userEvent.click(buttonSubmit);

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('password updated');
  });
});

test('user resets password but user does not exist', async () => {
  render(
    <MemoryRouter>
      <ResetPassword />
    </MemoryRouter>,
  );
  const user = {
    username: 'notexistentuser',
    newPassword: 'hi',
  };
  const usernameInput = screen.getByPlaceholderText(/Enter username/i);
  const newPasswordInput = screen.getByPlaceholderText(/Enter password/i);
  const buttonSubmit = screen.getByText('Submit');
  userEvent.type(usernameInput, user.username);
  userEvent.type(newPasswordInput, user.newPassword);
  userEvent.click(buttonSubmit);

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('user does not exist');
  });
});
