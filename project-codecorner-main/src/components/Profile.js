/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCookies } from 'react-cookie';
import '../style/Profile.css';
import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { getUser, getNumPosts } from '../modules/api';
import Header from './Header';
import FilterButton from './FilterButton';

function Profile() {
  const [, handleUsername] = useState('');
  const [firstName, handleFirstName] = useState('');
  const [lastName, handleLastName] = useState('');
  const [bio, handleBio] = useState('');
  const [affiliation, handleAffiliation] = useState('');
  const [gradYear, handleGradYear] = useState('');
  const [numPosts, handleNumPosts] = useState(0);
  const [techStack, handleTechStack] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLogOut = () => {
    removeCookie('username');
    setShow(false);
  };

  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(['username']);
  if (!cookies.username) {
    window.open('/');
  }
  async function user() {
    const fetchedUser = await getUser(cookies.username);
    handleFirstName(fetchedUser.firstName);
    handleLastName(fetchedUser.lastName);
    handleUsername(cookies.username);
    handleAffiliation(fetchedUser.affiliation);
    handleTechStack(fetchedUser.techStack);
    handleGradYear(fetchedUser.gradYear);
    handleBio(fetchedUser.bio);

    const postCount = await getNumPosts(cookies.username);
    handleNumPosts(postCount);
  }

  useEffect(() => {
    user();
  }, []);

  const ovals = [];
  for (const [, value] of techStack.entries()) {
    ovals.push(
      <div className="oval">
        {value}
      </div>,
    );
  }
  return (

    <div className="container">
      <Header />
      <Card style={{ width: '70rem', height: '80 rem', marginTop: '40px' }}>
        <div className="postHeader">
          <div className="circle">
            <p className="initials">
              {firstName.charAt(0)}
              {lastName.charAt(0)}
            </p>
          </div>
          <div className="headerTextLayout">
            <div className="headerText1">
              {firstName}
              {' '}
              {lastName}
            </div>
            <div className="headerText2">
              {affiliation}
              {' '}
              {gradYear}
            </div>
          </div>
          <div className="right">
            <FilterButton onClick={handleShow} testId="feed" text="Log Out" />
          </div>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Log Out</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you would like to log out?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              No
            </Button>
            <Button variant="secondary" onClick={handleLogOut}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
        <Card.Body style={{ border: '1.5rem' }}>
          <Card style={{ width: '68rem', height: '4.5rem' }}>
            <div className="headerTextLayoutFour">
              <div className="headerTextLayoutFour"> About</div>

            </div>
            <div className="headerTextLayoutTwo">
              <div className="headerText3">
                {' '}
                {bio}
              </div>
            </div>
          </Card>

          <Card style={{ width: '68rem', height: '6.5rem' }}>
            <div className="headerTextLayoutFour">
              <div className="headerTextLayoutFive"> Tech Stack</div>

            </div>
            <div className="ovalTogether">
              {ovals}
            </div>
          </Card>
          <Card style={{ width: '68rem', height: '10rem' }}>
            <div className="headerTextLayoutSix">
              <div className="headerTextLayoutSix"> Statistics</div>

            </div>
            <div className="headerTextLayoutTwo">
              <div className="headerText3">
                Number of Projects Posted:
                {' '}
                {numPosts}
              </div>
            </div>
          </Card>

        </Card.Body>
      </Card>
    </div>
  );
}

export default Profile;
