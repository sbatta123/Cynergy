/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-spread */
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Post.css';
import React from 'react';

function Post({ data, currentUser }) {
  // db.getPosts() will scan the post database
  // and get a list of json's where each json contains post information
  const elements = [];
  elements.push.apply(elements, data.projectLength);
  elements.push.apply(elements, data.roles);
  elements.push.apply(elements, data.sector);
  elements.push.apply(elements, data.teamSize);
  elements.push.apply(elements, data.techStack);
  elements.push.apply(elements, data.timeCommitmemt);
  const items = [];
  for (const [, value] of elements.entries()) {
    items.push(
      <div className="label">
        <div className="labelText">{value}</div>
      </div>,
    );
  }

  return (
    <h2 className="container">
      <Card style={{ width: '40rem' }}>
        <div className="postHeader">
          <Nav.Link href={`/profile/${data.username}`}>
            <div className="circle">
              <p className="initials">
                {data.firstName.charAt(0)}
                {data.lastName.charAt(0)}
              </p>

            </div>
          </Nav.Link>
          <div className="headerTextLayout">
            <div className="headerText1">{data.title}</div>
            <div className="headerText2">
              {' '}
              {data.firstName}
              {' '}
              {data.lastName}
              {' '}
              |
              {' '}
              {data.affiliation}
              {' '}
            </div>
          </div>
          <div className="postText">
            {!currentUser
              && (
              <Nav.Link href={`/messaging/${data.username}`}>
                message user
              </Nav.Link>
              )}
          </div>

        </div>
        <div className="labelLayout">
          {items}
        </div>
        <Card.Body>
          <div className="postText">
            {data.description}
          </div>
        </Card.Body>
      </Card>
    </h2>
  );
}

export default Post;
