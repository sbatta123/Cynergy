/* eslint-disable no-restricted-syntax */
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import '../style/Profile.css';
import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { getUser, getNumPosts } from '../modules/api';
import Header from './Header';

function OtherProfile() {
  const params = useParams();
  const [, handleUsername] = useState('');
  const [firstName, handleFirstName] = useState('');
  const [lastName, handleLastName] = useState('');
  const [bio, handleBio] = useState('');
  const [affiliation, handleAffiliation] = useState('');
  const [gradYear, handleGradYear] = useState('');
  const [techStack, handleTechStack] = useState([]);
  const [error, setError] = useState(false);
  const [showError, handleShowError] = useState(false);
  const [numPosts, handleNumPosts] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(['username']);

  async function user() {
    handleUsername(params.username);
    const fetchedUser = await getUser(params.username);
    if (!fetchedUser) {
      setError(true);
      handleShowError(true);
      // return back to homepage hyperlink
    }
    handleFirstName(fetchedUser.firstName);
    handleLastName(fetchedUser.lastName);
    handleUsername(cookies.username);
    handleAffiliation(fetchedUser.affiliation);
    handleTechStack(fetchedUser.techStack);
    handleGradYear(fetchedUser.gradYear);
    handleBio(fetchedUser.bio);

    const postCount = await getNumPosts(params.username);
    handleNumPosts(postCount);
  }
  useEffect(() => {
    user();
  }, []);

  // const items = [];
  // for (const [index, value] of elements.entries()) {
  //     items.push(
  //         <div class="headerTextLayoutTwo">
  //             {value}
  //         </div>
  //     )
  //   }
  const ovals = [];
  for (const [, value] of techStack.entries()) {
    ovals.push(
      <div className="oval">
        {value}
      </div>,
    );
  }
  if (error) {
    return (
      <div>
        {showError ? (
          <Alert variant="danger" onClose={() => handleShowError(false)} dismissible>
            <Alert.Heading>Could not find user.</Alert.Heading>
          </Alert>
        ) : (<div />)}
        <a href="/homepage">Return to homepage.</a>
      </div>
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
        </div>
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
                {numPosts}
              </div>
            </div>
          </Card>

        </Card.Body>
      </Card>
    </div>
  );
}

export default OtherProfile;
