/**
* @jest-environment jsdom
*/
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import TestRenderer from 'react-test-renderer';
import userEvent from '@testing-library/user-event';
import App from '../components/App';

// npm start frontend and npm start backend before running these tests

test('renders title', () => {
  render(<App />);
  const linkElement = screen.getByText('Cynergy');
  expect(linkElement).toBeInTheDocument();
});

test('renders login screen login box content', () => {
  render(<App />);
  const loginUsernameInput = screen.getByPlaceholderText(/Enter username/i);
  expect(loginUsernameInput).toBeInTheDocument();
  const loginPasswordInput = screen.getByPlaceholderText(/Enter password/i);
  expect(loginPasswordInput).toBeInTheDocument();
  const submitButton = screen.getByText('Submit');
  expect(submitButton).toBeInTheDocument();
});

test('renders create account', () => {
  render(<App />);
  const linkElement = screen.getByText('Create Account');
  expect(linkElement).toBeInTheDocument();
});

test('renders reset password', () => {
  render(<App />);
  const linkElement = screen.getByText('Reset Password');
  expect(linkElement).toBeInTheDocument();
});

test('user info input', () => {
  render(<App />);
  userEvent.type(screen.getByPlaceholderText(/Enter username/i), 'EmmaONeil');
  expect(screen.getByPlaceholderText(/Enter username/i)).toHaveValue('EmmaONeil');

  userEvent.type(screen.getByPlaceholderText(/Enter password/i), 'cis350project');
  expect(screen.getByPlaceholderText(/Enter password/i)).toHaveValue('cis350project');
});

test('snapshot testing', () => {
  const component = TestRenderer.create(<App />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('user clicks submit button with incorrect password inputted', async () => {
  render(
    <App />,
  );
  const user = {
    user: 'EmmaONeil',
    password: 'notpassword',
  };
  const usernameInput = screen.getByPlaceholderText(/Enter username/i);
  const passwordInput = screen.getByPlaceholderText(/Enter password/i);
  const buttonSubmit = screen.getByText('Submit');
  userEvent.type(usernameInput, user.user);
  userEvent.type(passwordInput, user.password);

  userEvent.click(buttonSubmit);
  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('incorrect password provided');
  });
});

test('user clicks submit button with correct password inputted', async () => {
  render(
    <App />,
  );
  const user = {
    user: 'EmmaONeil',
    password: 'hello',
  };
  const usernameInput = screen.getByPlaceholderText(/Enter username/i);
  const passwordInput = screen.getByPlaceholderText(/Enter password/i);
  const buttonSubmit = screen.getByText('Submit');
  userEvent.type(usernameInput, user.user);
  userEvent.type(passwordInput, user.password);

  userEvent.click(buttonSubmit);

  await waitFor(() => {
    const submitButton = screen.queryByText('Submit');
    expect(submitButton).not.toBeInTheDocument();
  });
});
