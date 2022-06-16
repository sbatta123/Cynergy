/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
import {
  Card, Modal, Button,
} from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import FilterButton from './FilterButton';
import Post from './Post';
import '../style/Homepage.css';
import { createPost, getPosts, getUser } from '../modules/api';
import Header from './Header';

function Homepage() {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies(['username']);
  const [userCookie] = useCookies(['currentUser']);
  // modal
  const [rolesArr, setRolesArr] = useState([]);
  const [stackArr, setStackArr] = useState([]);
  const [teamArr, setTeamArr] = useState([]);
  const [sectorArr, setSectorArr] = useState([]);
  const [lengthArr, setLengthArr] = useState([]);
  const [timeArr, setTimeArr] = useState([]);
  const [title, handleTitle] = useState('');
  const [description, handleDescription] = useState('');

  // homepage
  const [, handleUsername] = useState('');
  const [firstName, handleFirstName] = useState('');
  const [lastName, handleLastName] = useState('');
  const [, handleBio] = useState('');
  const [affiliation, handleAffiliation] = useState('');
  const [, handleGradYear] = useState('');

  async function user() {
    const fetchedUser = await getUser(cookies.username);
    if (fetchedUser) {
      handleFirstName(fetchedUser.firstName);
      handleLastName(fetchedUser.lastName);
      handleUsername(cookies.username);
      handleAffiliation(fetchedUser.affiliation);
      handleGradYear(fetchedUser.gradYear);
      handleBio(fetchedUser.bio);
    }
  }
  useEffect(() => {
    user();
  }, []);

  const handleRole = (value) => {
    if (rolesArr.includes(value)) {
      rolesArr.splice(rolesArr.indexOf(value), 1);
    } else {
      setRolesArr((arr) => [...arr, value]);
    }
  };

  const handleStack = (value) => {
    if (stackArr.includes(value)) {
      stackArr.splice(stackArr.indexOf(value), 1);
    } else {
      setStackArr((arr) => [...arr, value]);
    }
  };

  const handleTeam = (value) => {
    if (teamArr.includes(value)) {
      teamArr.splice(teamArr.indexOf(value), 1);
    } else {
      setTeamArr((arr) => [...arr, value]);
    }
  };

  const handleSector = (value) => {
    if (sectorArr.includes(value)) {
      sectorArr.splice(sectorArr.indexOf(value), 1);
    } else {
      setSectorArr((arr) => [...arr, value]);
    }
  };

  const handleLength = (value) => {
    if (lengthArr.includes(value)) {
      lengthArr.splice(lengthArr.indexOf(value), 1);
    } else {
      setLengthArr((arr) => [...arr, value]);
    }
  };

  const handleTime = (value) => {
    if (timeArr.includes(value)) {
      timeArr.splice(timeArr.indexOf(value), 1);
    } else {
      setTimeArr((arr) => [...arr, value]);
    }
  };

  const resetState = () => {
    setRolesArr([]);
    setStackArr([]);
    setTeamArr([]);
    setSectorArr([]);
    setLengthArr([]);
    setTimeArr([]);
    handleTitle('');
    handleDescription('');
  };

  // eslint-disable-next-line no-shadow
  function modal(s, handleClose) {
    let elements = ['Frontend', 'Backend', 'Full Stack'];
    const role = [];
    for (const [, value] of elements.entries()) {
      role.push(
        // <div class="filter" onClick = {filterClick()}>
        //     <div class="filterText">{value}</div>
        // </div>
        <FilterButton onClick={handleRole} testId="modal" text={value} />,
      );
    }

    elements = ['Python', 'Ruby on Rails', 'Java', 'AWS', 'LAMP', 'JavaScript', 'Django', 'Swift', 'MongoDB'];
    const techStack = [];
    for (const [, value] of elements.entries()) {
      techStack.push(
        <FilterButton onClick={handleStack} testId="modal" text={value} />,
      );
    }

    elements = ['1-5 People', '6-10 People', '11+ People'];
    const teamSize = [];
    for (const [, value] of elements.entries()) {
      teamSize.push(
        <FilterButton onClick={handleTeam} testId="modal" text={value} />,
      );
    }

    elements = ['Medicine', 'Education', 'Charity', 'Sports', 'News', 'Gaming'];
    const sector = [];
    for (const [, value] of elements.entries()) {
      sector.push(
        <FilterButton onClick={handleSector} testId="modal" text={value} />,
      );
    }

    elements = ['1 Month', '2 Months', '3-6 Months', '6-12 Months', '12+ Months'];
    const projectLength = [];
    for (const [, value] of elements.entries()) {
      projectLength.push(
        <FilterButton onClick={handleLength} testId="modal" text={value} />,
      );
    }

    elements = ['1-5 hours/week', '6-10 hours/week', '11-15 hours/week', '16+ hours/week'];
    const timeCommitment = [];
    for (const [, value] of elements.entries()) {
      timeCommitment.push(
        <FilterButton onClick={handleTime} testId="modal" text={value} />,
      );
    }
    return (
      <>
        {/* <Button variant="primary" onClick={handleShow}>
          Launch static backdrop modal
        </Button> */}

        <Modal
          size="lg"
          show={s}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            Post a project...
          </Modal.Header>
          <Modal.Body style={{ width: '90rem', height: '50rem' }}>
            <div className="newPostContainer">
              <Card style={{ width: '20rem', height: '45rem' }}>
                <Card.Body>
                  <div className="filterLayout">
                    <div className="filterTitle"> Role </div>
                    <div className="labelLayout">
                      {role}
                    </div>
                    <div className="filterTitle"> Tech Stack </div>
                    <div className="labelLayout">
                      {techStack}
                    </div>
                    <div className="filterTitle"> Team Size </div>
                    <div className="labelLayout">
                      {teamSize}
                    </div>
                    <div className="filterTitle"> Sector </div>
                    <div className="labelLayout">
                      {sector}
                    </div>
                    <div className="filterTitle"> Project Length </div>
                    <div className="labelLayout">
                      {projectLength}
                    </div>
                    <div className="filterTitle"> Time Committment </div>
                    <div className="labelLayout">
                      {timeCommitment}
                    </div>
                  </div>
                </Card.Body>
              </Card>
              <div className="newPostHeader">
                <div className="circle">
                  <p className="initials">
                    {firstName.charAt(0)}
                    {lastName.charAt(0)}
                  </p>
                </div>
                <div className="headerTextLayout">
                  <div className="headerText1">
                    <input className="form-control form-control-lg no-border" type="text" placeholder="Name your project." onChange={(e) => handleTitle(e.target.value)} />
                  </div>
                  <div className="headerText2">
                    {' '}
                    {firstName}
                    {' '}
                    {lastName}
                    {' '}
                    |
                    {' '}
                    {affiliation}
                    {' '}
                  </div>
                  <input className="form-control bigInput" type="text" placeholder="Describe your project here." onChange={(e) => handleDescription(e.target.value)} />

                </div>

              </div>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="secondary" onClick={handlePost}>
              Post
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  const [modalShow, setModalShow] = useState(false);

  function handleClose() {
    setModalShow(false);
    resetState();
  }

  function handlePost() {
    const timeStamp = Date.now();
    let data;
    if (userCookie.currentUser) {
      // eslint-disable-next-line no-underscore-dangle
      const userId = userCookie.currentUser._id;
      data = {
        firstName,
        lastName,
        username: cookies.username,
        affiliation,
        title,
        description,
        roles: rolesArr,
        techStack: stackArr,
        teamSize: teamArr,
        sector: sectorArr,
        projectLength: lengthArr,
        timeCommitment: timeArr,
        timestamp: timeStamp,
        userId,
        // eslint-disable-next-line no-dupe-keys
        username: userCookie.currentUser.username,
      };
    } else {
      data = {};
    }

    createPost(data);
    setPosts((arr) => [data, ...arr]);
    handleClose();
  }

  // homepage
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedPost = await getPosts();
      setPosts(fetchedPost);
    }
    fetchData();
  }, []);

  async function handleFilter() {
    const filterData = {
      roles: rolesFilter,
      techStack: stackFilter,
      teamSize: teamFilter,
      sector: sectorFilter,
      projectLength: lengthFilter,
      timeCommitment: timeFilter,
    };
    const fetchedPost = await getPosts(filterData);
    setPosts(fetchedPost);
  }

  const [rolesFilter, setRolesFilter] = useState([]);
  const [stackFilter, setStackFilter] = useState([]);
  const [teamFilter, setTeamFilter] = useState([]);
  const [sectorFilter, setSectorFilter] = useState([]);
  const [lengthFilter, setLengthFilter] = useState([]);
  const [timeFilter, setTimeFilter] = useState([]);

  const handleRoleFilter = (value) => {
    if (rolesFilter.includes(value)) {
      rolesFilter.splice(rolesFilter.indexOf(value), 1);
    } else {
      setRolesFilter((arr) => [...arr, value]);
    }
  };

  const handleStackFilter = (value) => {
    if (stackFilter.includes(value)) {
      stackFilter.splice(stackFilter.indexOf(value), 1);
    } else {
      setStackFilter((arr) => [...arr, value]);
    }
  };

  const handleTeamFilter = (value) => {
    if (teamFilter.includes(value)) {
      teamFilter.splice(teamFilter.indexOf(value), 1);
    } else {
      setTeamFilter((arr) => [...arr, value]);
    }
  };

  const handleSectorFilter = (value) => {
    if (sectorFilter.includes(value)) {
      sectorFilter.splice(sectorFilter.indexOf(value), 1);
    } else {
      setSectorFilter((arr) => [...arr, value]);
    }
  };

  const handleLengthFilter = (value) => {
    if (lengthFilter.includes(value)) {
      lengthFilter.splice(lengthFilter.indexOf(value), 1);
    } else {
      setLengthFilter((arr) => [...arr, value]);
    }
  };

  const handleTimeFilter = (value) => {
    if (timeFilter.includes(value)) {
      timeFilter.splice(timeFilter.indexOf(value), 1);
    } else {
      setTimeFilter((arr) => [...arr, value]);
    }
  };

  let elements = ['Frontend', 'Backend', 'Full Stack'];
  const role = [];
  for (const [, value] of elements.entries()) {
    role.push(
      // <div class="filter" onClick = {filterClick()}>
      //     <div class="filterText">{value}</div>
      // </div>
      <FilterButton onClick={handleRoleFilter} testId="feed" text={value} />,
    );
  }

  elements = ['Python', 'Ruby on Rails', 'Java', 'AWS', 'LAMP', 'JavaScript', 'Django', 'Swift', 'MongoDB'];
  const techStack = [];
  for (const [, value] of elements.entries()) {
    techStack.push(
      <FilterButton onClick={handleStackFilter} testId="feed" text={value} />,
    );
  }

  elements = ['1-5 People', '6-10 People', '11+ People'];
  const teamSize = [];
  for (const [, value] of elements.entries()) {
    teamSize.push(
      <FilterButton onClick={handleTeamFilter} testId="feed" text={value} />,
    );
  }

  elements = ['Medicine', 'Education', 'Charity', 'Sports', 'News', 'Gaming'];
  const sector = [];
  for (const [, value] of elements.entries()) {
    sector.push(
      <FilterButton onClick={handleSectorFilter} testId="feed" text={value} />,
    );
  }

  elements = ['1 Month', '2 Months', '3-6 Months', '6-12 Months', '12+ Months'];
  const projectLength = [];
  for (const [, value] of elements.entries()) {
    projectLength.push(
      <FilterButton onClick={handleLengthFilter} testId="feed" text={value} />,
    );
  }

  elements = ['1-5 hours/week', '6-10 hours/week', '11-15 hours/week', '16+ hours/week'];
  const timeCommitment = [];
  for (const [, value] of elements.entries()) {
    timeCommitment.push(
      <FilterButton onClick={handleTimeFilter} testId="feed" text={value} />,
    );
  }

  const itemList = [];
  if (userCookie.currentUser) {
    // eslint-disable-next-line no-underscore-dangle
    let currentUser = userCookie.currentUser._id;

    for (const [, value] of posts.entries()) {
      currentUser = userCookie.currentUser.username === value.username
      // eslint-disable-next-line no-underscore-dangle
      || userCookie.currentUser._id === value?.userId;
      itemList.push(
        <Post data={value} currentUser={currentUser} />,
      );
    }
  }

  return (
    <div>
      <Header />
      <div className="container">
        <div className="filterContainer">
          <Card style={{
            width: '20rem', height: '50rem', marginTop: '20px', marginBottom: '20px',
          }}
          >
            <Card.Body>
              <div className="filterTitle"> Role </div>
              <div className="labelLayout">
                {role}
              </div>
              <div className="filterTitle"> Tech Stack </div>
              <div className="labelLayout">
                {techStack}
              </div>
              <div className="filterTitle"> Team Size </div>
              <div className="labelLayout">
                {teamSize}
              </div>
              <div className="filterTitle"> Project Sector </div>
              <div className="labelLayout">
                {sector}
              </div>
              <div className="filterTitle"> Project Length </div>
              <div className="labelLayout">
                {projectLength}
              </div>
              <div className="filterTitle"> Time Committment </div>
              <div className="labelLayout">
                {timeCommitment}
              </div>
              {/* eslint-disable-next-line react/jsx-no-bind */}
              <Button variant="secondary" onClick={handleFilter}>
                Filter
              </Button>
            </Card.Body>
          </Card>
        </div>
        <div className="feed">
          <div
            className="postButton"
            onClick={() => {
              setModalShow(true);
              // eslint-disable-next-line no-console
              console.log(modalShow);
            }}
          >
            <div className="postButtonText">
              post about a project...
            </div>
          </div>
          {itemList}
        </div>
      </div>
      {modal(modalShow, handleClose)}
    </div>
  );
}

export default Homepage;
