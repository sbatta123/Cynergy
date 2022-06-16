import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import React, { useState } from 'react';
import '../style/Registration.css';
import logo from '../assets/cynergy_logo.png';
import { register } from '../modules/api';

function Registration() {
  const [username, handleUsername] = useState('');
  const [email, handleEmail] = useState('');
  const [password, handlePassword] = useState('');
  const [affiliation, handleAffiliation] = useState('');
  const [showError, handleShowError] = useState(false);
  const [errorMessage, handleErrorMessage] = useState('');
  const [techStack] = useState([]);
  const [firstName, handleFirstName] = useState('');
  const [lastName, handleLastName] = useState('');
  const [bio, handleBio] = useState('');
  const [gradYear, handleGradYear] = useState('');
  const [, setCookie] = useCookies(['username']);
  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    // need to add an if statement checking if username exists, can do this by querying database
    if (username === '' || email === '' || password === '' || affiliation === ''
    || firstName === '' || lastName === '' || gradYear === '') {
      handleErrorMessage('Please make sure all fields are filled out.');
      handleShowError(true);
    } else if (!username.match(/^[0-9a-z]+$/)) { // check that the input is alphanumeric
      handleErrorMessage('Invalid username. Please make sure your username is alphanumeric.');
      handleShowError(true);
    } else if (!email.match(/^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+).*edu$/)) {
      handleErrorMessage('Invalid email. Please make sure your email is affiliated with an academic institution.');
      handleShowError(true);
    } else if (Number.isNaN(gradYear)) {
      handleErrorMessage('Please make sure graduation year is numeric.');
      handleShowError(true);
    } else {
      const registerOutput = await register(
        username,
        email,
        password,
        affiliation,
        techStack,
        firstName,
        lastName,
        gradYear,
        bio,
      );
      // eslint-disable-next-line no-prototype-builtins
      if (registerOutput.hasOwnProperty('username')) {
        setCookie('username', username, { path: '/' });
        navigate('/homepage');
      } else {
        handleErrorMessage(registerOutput);
        handleShowError(true);
      }
    }
  }

  function handleCheck(event) {
    if (event.target.checked) {
      if (!techStack.includes(event.target.value)) {
        techStack.push(event.target.value);
      }
    } else {
      const index = techStack.indexOf(event.target.value);
      if (index > -1) {
        techStack.splice(index, 1);
      }
    }
    // const loginOutput = await login(username, password);
    // if (loginOutput.hasOwnProperty('username')) {
    //   setCookie('username', username, { path: '/' });
    //   navigate('/homepage');
    // } else {
    //   handleErrorMessage(loginOutput);
    //   handleShowError(true);
    // }
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
        <Card className="register_container">
          <form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Control placeholder="Enter first name" onChange={(e) => { handleFirstName(e.target.value); }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control placeholder="Enter last name" onChange={(e) => { handleLastName(e.target.value); }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control placeholder="Enter username" onChange={(e) => handleUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control placeholder="Enter email" type="email" onChange={(e) => handleEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control placeholder="Enter password" type="password" onChange={(e) => handlePassword(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control placeholder="Enter affiliation" onChange={(e) => { handleAffiliation(e.target.value); }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control placeholder="Enter graduation year" onChange={(e) => { handleGradYear(e.target.value); }} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control placeholder="Enter a bio" onChange={(e) => { handleBio(e.target.value); }} />
            </Form.Group>
            Tech Stack
            <Form.Group className="mb-3">
              <Form.Check
                inline
                value="Python"
                label="Python"
                name="group1"
                type="checkbox"
                id="pythonCheck"
                onChange={(e) => handleCheck(e)}
              />
              <Form.Check
                inline
                value="Ruby on Rails"
                label="Ruby on Rails"
                name="group1"
                type="checkbox"
                id="rubyCheck"
                onChange={(e) => handleCheck(e)}
              />
              <Form.Check
                inline
                value="Java"
                label="Java"
                name="group1"
                type="checkbox"
                id="javaCheck"
                onChange={(e) => handleCheck(e)}
              />
              <Form.Check
                inline
                value="AWS"
                label="AWS"
                name="group1"
                type="checkbox"
                id="awsCheck"
                onChange={(e) => handleCheck(e)}
              />
              <Form.Check
                inline
                value="LAMP"
                label="LAMP"
                name="group1"
                type="checkbox"
                id="lampCheck"
                onChange={(e) => handleCheck(e)}
              />
              <Form.Check
                inline
                value="JavaScript"
                label="JavaScript"
                name="group1"
                type="checkbox"
                id="javascriptCheck"
                onChange={(e) => handleCheck(e)}
              />
              <Form.Check
                inline
                value="Django"
                label="Django"
                name="group1"
                type="checkbox"
                id="djangoCheck"
                onChange={(e) => handleCheck(e)}
              />
              <Form.Check
                inline
                label="Swift"
                value="Swift"
                name="group1"
                type="checkbox"
                id="swiftCheck"
                onChange={(e) => handleCheck(e)}
              />
              <Form.Check
                inline
                value="MongoDB"
                label="MongoDB"
                name="group1"
                type="checkbox"
                id="mongoCheck"
                onChange={(e) => handleCheck(e)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Registration;
