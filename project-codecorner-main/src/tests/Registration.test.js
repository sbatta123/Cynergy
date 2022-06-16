/**
* @jest-environment jsdom
*/
import React from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Registration from '../components/Registration';

test('user clicks submit button with incorrect email inputted', async () => {
  render(
    <MemoryRouter>
      <Registration />
    </MemoryRouter>,
  );
  const user = {
    firstName: 'Sarah',
    lastName: 'Batta',
    username: 'sbatta',
    email: 's@gmail.com',
    password: 'hi',
    affiliation: 'upenn',
    gradYear: '2024',
    bio: 'hey, I am a NETS major',
  };
  const firstnameInput = screen.getByPlaceholderText(/Enter first name/i);
  const lastInput = screen.getByPlaceholderText(/Enter last name/i);
  const usernameInput = screen.getByPlaceholderText(/Enter username/i);
  const emailInput = screen.getByPlaceholderText(/Enter email/i);
  const passwordInput = screen.getByPlaceholderText(/Enter password/i);
  const affilitationInput = screen.getByPlaceholderText(/Enter affiliation/i);
  const gradInput = screen.getByPlaceholderText(/Enter graduation year/i);
  const bioInput = screen.getByPlaceholderText(/Enter a bio/i);
  const buttonSubmit = screen.getByText('Submit');
  userEvent.type(firstnameInput, user.firstName);
  userEvent.type(lastInput, user.lastName);
  userEvent.type(usernameInput, user.username);
  userEvent.type(emailInput, user.email);
  userEvent.type(passwordInput, user.password);
  userEvent.type(affilitationInput, user.affiliation);
  userEvent.type(gradInput, user.gradYear);
  userEvent.type(bioInput, user.bio);
  userEvent.click(buttonSubmit);
  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email. Please make sure your email is affiliated with an academic institution.');
  });
});

test('user clicks submit button with incorrect username inputted', async () => {
  render(
    <MemoryRouter>
      <Registration />
    </MemoryRouter>,
  );
  const user = {
    firstName: 'Sarah',
    lastName: 'Batta',
    username: 'sbatta@@',
    email: 's@seas.upenn.edu',
    password: 'hi',
    affiliation: 'upenn',
    gradYear: '2024',
    bio: 'hey, I am a NETS major',
  };
  const firstnameInput = screen.getByPlaceholderText(/Enter first name/i);
  const lastInput = screen.getByPlaceholderText(/Enter last name/i);
  const usernameInput = screen.getByPlaceholderText(/Enter username/i);
  const emailInput = screen.getByPlaceholderText(/Enter email/i);
  const passwordInput = screen.getByPlaceholderText(/Enter password/i);
  const affilitationInput = screen.getByPlaceholderText(/Enter affiliation/i);
  const gradInput = screen.getByPlaceholderText(/Enter graduation year/i);
  const bioInput = screen.getByPlaceholderText(/Enter a bio/i);
  const buttonSubmit = screen.getByText('Submit');
  userEvent.type(firstnameInput, user.firstName);
  userEvent.type(lastInput, user.lastName);
  userEvent.type(usernameInput, user.username);
  userEvent.type(emailInput, user.email);
  userEvent.type(passwordInput, user.password);
  userEvent.type(affilitationInput, user.affiliation);
  userEvent.type(gradInput, user.gradYear);
  userEvent.type(bioInput, user.bio);
  userEvent.click(buttonSubmit);
  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid username. Please make sure your username is alphanumeric.');
  });
});

test('user clicks submit button with blank fields inputted', async () => {
  render(
    <MemoryRouter>
      <Registration />
    </MemoryRouter>,
  );
  const user = {
    firstName: '',
    lastName: 'Batta',
    username: 'sbatta',
    email: 's@seas.upenn.edu',
    password: 'hi',
    affiliation: 'upenn',
    gradYear: '2024',
    bio: 'hey, I am a NETS major',
  };
  const firstnameInput = screen.getByPlaceholderText(/Enter first name/i);
  const lastInput = screen.getByPlaceholderText(/Enter last name/i);
  const usernameInput = screen.getByPlaceholderText(/Enter username/i);
  const emailInput = screen.getByPlaceholderText(/Enter email/i);
  const passwordInput = screen.getByPlaceholderText(/Enter password/i);
  const affilitationInput = screen.getByPlaceholderText(/Enter affiliation/i);
  const gradInput = screen.getByPlaceholderText(/Enter graduation year/i);
  const bioInput = screen.getByPlaceholderText(/Enter a bio/i);
  const buttonSubmit = screen.getByText('Submit');
  userEvent.type(firstnameInput, user.firstName);
  userEvent.type(lastInput, user.lastName);
  userEvent.type(usernameInput, user.username);
  userEvent.type(emailInput, user.email);
  userEvent.type(passwordInput, user.password);
  userEvent.type(affilitationInput, user.affiliation);
  userEvent.type(gradInput, user.gradYear);
  userEvent.type(bioInput, user.bio);
  userEvent.click(buttonSubmit);
  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Please make sure all fields are filled out.');
  });
});
