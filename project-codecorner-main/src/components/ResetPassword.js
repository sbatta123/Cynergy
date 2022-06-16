import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import '../style/Login.css';
import logo from '../assets/cynergy_logo.png';
import { resetPassword } from '../modules/api';

function Login() {
  const [username, handleUsername] = useState('');
  const [newPassword, handleNewPassword] = useState('');
  const [showSuccess, handleShowSuccess] = useState(false);
  const [successMessage, handleSuccessMessage] = useState('');
  const [showError, handleShowError] = useState(false);
  const [errorMessage, handleErrorMessage] = useState('');

  async function handleResetPassword(event) {
    event.preventDefault();
    const resetPasswordOutput = await resetPassword(username, newPassword);
    if (resetPasswordOutput === 'password updated') {
      handleSuccessMessage(resetPasswordOutput);
      handleShowSuccess(true);
    } else {
      handleErrorMessage(resetPasswordOutput);
      handleShowError(true);
    }
  }

  return (
    <div className="container">
      <h1 className="title">Cynergy</h1>
      <div className="score_container">
        {showSuccess ? (
          <Alert variant="success" onClose={() => handleShowSuccess(false)} dismissible>
            <Alert.Heading>{successMessage}</Alert.Heading>
          </Alert>
        ) : (<div />)}
        {showError ? (
          <Alert variant="danger" onClose={() => handleShowError(false)} dismissible>
            <Alert.Heading>{errorMessage}</Alert.Heading>
          </Alert>
        ) : (<div />)}
        <img src={logo} alt="cynergy logo" />
        <Card className="login_container">
          <form onSubmit={handleResetPassword}>
            <Form.Group className="mb-3">
              <Form.Control placeholder="Enter username" onChange={(e) => handleUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control placeholder="Enter password" type="password" onChange={(e) => handleNewPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </form>
        </Card>
      </div>
      <a href="/">Return to Login</a>
    </div>
  );
}

export default Login;
