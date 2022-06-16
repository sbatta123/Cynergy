import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import React, { useState, useEffect } from 'react';
import '../style/Login.css';
import logo from '../assets/cynergy_logo.png';
import { login } from '../modules/api';

function Login() {
  const [username, handleUsername] = useState('');
  const [password, handlePassword] = useState('');
  const [showError, handleShowError] = useState(false);
  const [errorMessage, handleErrorMessage] = useState('');
  const [, setCookie] = useCookies(['username']);
  // const [cookies, setCookie] = useCookies(['currentUser']);
  const [numTries, setNumTries] = useState(0);
  const [loading, handleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('Loading', loading);
  }, [loading]);
  async function handleLogin(event) {
    event.preventDefault();
    const loginOutput = await login(username, password);
    // eslint-disable-next-line no-prototype-builtins
    if (loginOutput.hasOwnProperty('username')) {
      setCookie('currentUser', JSON.stringify(loginOutput), { path: '/' });
      setCookie('username', username, { path: '/' });
      navigate('/homepage');
    } else if (numTries < 3) {
      handleErrorMessage(loginOutput);
      handleShowError(true);
      setNumTries(numTries + 1);
    } else {
      handleErrorMessage('You have exceeded the allowed number of login attempts. Please try again in 1 minute.');
      handleShowError(true);
      handleLoading(true);
      setTimeout(() => {
        handleLoading(false);
        handleShowError(false);
      }, '60000');
      setNumTries(0);
    }
  }

  return (
    <div className="container">
      <h1 className="title">Cynergy</h1>
      <div className="score_container">
        {showError ? (
          <Alert variant="danger" onClose={() => handleShowError(false)} dismissible>
            <Alert.Heading>{errorMessage}</Alert.Heading>
          </Alert>
        ) : (<div />)}
        <img src={logo} alt="cynergy logo" />
        <Card className="login_container">
          <form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Control id="username" placeholder="Enter username" onChange={(e) => handleUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control id="password" placeholder="Enter password" type="password" onChange={(e) => handlePassword(e.target.value)} />
            </Form.Group>
            {loading ? (
              <div>
                <div>
                  <Spinner animation="border" />
                  {' '}
                </div>
                <div>Please wait 1 minute before attempting login again.</div>
              </div>
            ) : (
              <Button variant="primary" type="submit">
                Submit
              </Button>
            )}

          </form>
        </Card>
      </div>
      <a href="/register">Create Account</a>
      <a href="/resetpassword">Reset Password</a>
    </div>
  );
}

export default Login;

// on registration page, link back to login
// on login page, don't let user attempt too many times (in rubric)
