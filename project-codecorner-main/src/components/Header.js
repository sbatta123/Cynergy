import React, { useState, useEffect } from 'react';
import {
  Navbar, Nav, Container,
} from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { getUser } from '../modules/api';
import logo from '../assets/cynergy_logo.png';

function Header() {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies(['username']);
  const [username, handleUsername] = useState('');
  const [firstName, handleFirstName] = useState('');
  const [lastName, handleLastName] = useState('');

  async function user() {
    const fetchedUser = await getUser(cookies.username);
    if (fetchedUser) {
      handleUsername(cookies.username);
      handleFirstName(fetchedUser.firstName);
      handleLastName(fetchedUser.lastName);
    }
  }
  useEffect(() => {
    user();
  }, []);
  return (
    <Navbar bg="light" expand="lg" style={{ backgroundColor: 'white', height: '70px' }}>
      <Container fluid>
        <img src={logo} alt="" width="50px" height="50px" />
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="my-2 my-lg-0 ms-auto"
            style={{ maxHeight: '50px', align: 'right' }}
            navbarScroll
          >

            <Nav.Link href={`/messaging/${username}`}>Message</Nav.Link>
            <Nav.Link as={Link} to="/homepage">Home</Nav.Link>
          </Nav>
          <Nav.Link href="/profile">
            <div className="circle">
              <p className="initials">
                {firstName.charAt(0)}
                {lastName.charAt(0)}
              </p>
            </div>
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
