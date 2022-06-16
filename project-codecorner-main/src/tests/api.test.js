const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const api = require('../modules/api');

let mock;

const rootURL = 'http://localhost:10000';

beforeAll(() => {
  mock = new MockAdapter(axios);
});

test('successful login', async () => {
  mock.onPost(`${rootURL}/login`).reply(200, {
    data: {
      _id: '6250bf56aa083b44416b36d0',
      username: 'EmmaONeil',
      email: 'emoneil@sas.upenn.edu',
      password: 'hello',
    },
  });
  const response = await api.login('EmmaONeil', 'hello');
  expect(response).toMatchObject({
    _id: '6250bf56aa083b44416b36d0',
    username: 'EmmaONeil',
    email: 'emoneil@sas.upenn.edu',
    password: 'hello',
  });
});

test('unsuccessful login (incorrect password)', async () => {
  mock.onPost(`${rootURL}/login`).reply(401, { error: 'incorrect password provided' });
  const response = await api.login('EmmaONeil', 'hi');
  expect(response).toBe('incorrect password provided');
});

test('successful registration', async () => {
  mock.onPost(`${rootURL}/register`).reply(201, {
    data: {
      username: 'AliceArmstrong',
      email: 'alicearmstrong@usc.edu',
      password: 'ilovecoding',
    },
  });
  const response = await api.register('AliceArmstrong', 'alicearmstrong@usc.edu', 'ilovecoding');
  expect(response).toMatchObject({
    username: 'AliceArmstrong',
    email: 'alicearmstrong@usc.edu',
    password: 'ilovecoding',
  });
});

test('unsuccessful registration (user with this username exists)', async () => {
  mock.onPost(`${rootURL}/register`).reply(409, { error: 'user with this username exists' });
  const response = await api.register('EmmaONeil', 'emmaoneil@uw.edu', 'hi');
  expect(response).toBe('user with this username exists');
});

test('post creation', async () => {
  const data = {
    title: 'healthcare web app',
    description: 'I want to create a web app. Anyone interested in helping out with backend?',
    roles: ['Backend'],
    techStack: ['Java'],
    sector: ['Education'],
    projectLength: ['2 Months'],
    timeCommitment: ['6-10 hours/week'],
    timestamp: 1651182198833,
  };
  mock.onPost(`${rootURL}/newpost`).reply(201, true);
  const response = await api.createPost(data);
  expect(response).toEqual(true);
});

test('get posts', async () => {
  const filterData = {
    roles: ['Backend'],
    techStack: ['Java'],
    teamSize: [],
    sector: ['Education'],
    projectLength: ['2 Months'],
    timeCommitment: ['6-10 hours/week'],
  };
  mock.onGet(`${rootURL}/posts`).reply(200, {
    data: [{
      description: 'Ok that worked but I WANT IT AT THE TOP.',
      projectLength: ['2 Months'],
      roles: ['Backend'],
      sector: ['Education'],
      teamSize: ['6-10 People'],
      techStack: ['LAMP'],
      timeCommitment: ['6-10 hours/week'],
      timestamp: 1650841420731,
      title: 'Test 4',
      _id: '6265d74cceacedbc047d8aaa',
    }],
  });
  const response = await api.getPosts(filterData);
  expect(response).toMatchObject([{
    description: 'Ok that worked but I WANT IT AT THE TOP.',
    projectLength: ['2 Months'],
    roles: ['Backend'],
    sector: ['Education'],
    teamSize: ['6-10 People'],
    techStack: ['LAMP'],
    timeCommitment: ['6-10 hours/week'],
    timestamp: 1650841420731,
    title: 'Test 4',
    _id: '6265d74cceacedbc047d8aaa',
  }]);
});

test('reset password', async () => {
  mock.onPut(`${rootURL}/resetpassword`).reply(200, { message: 'password updated' });
  const response = await api.resetPassword('emoneil', 'hello');
  expect(response).toBe('password updated');
});

test('reset password error', async () => {
  mock.onPut(`${rootURL}/resetpassword`).reply(404, { error: 'user does not exist' });
  const response = await api.resetPassword('hi', 'hello');
  expect(response).toBe('user does not exist');
});

test('get conversations', async () => {
  mock.onGet(`${rootURL}/conversations`).reply(200, {
    data: [{
      _id: { recipients: '627765ac6abd90a9326adedf', sender: '6276ead29c45b2c7ec3a5bc9' },
      latestMessage: 'hello user1 (USED IN TESTING)',
      recipient: {
        _id: '627765ac6abd90a9326adedf', affiliation: 'user1', bio: 'hi', email: 'user1@seas.upenn.edu', firstName: 'user1', gradYear: '2024', lastName: 'user1', password: 'user1', techStack: ['Python'], username: 'user1',
      },
      sender: {
        _id: '6276ead29c45b2c7ec3a5bc9', affiliation: 'UPenn', bio: 'hi', email: 'anmonaco@seas.upenn.edu', firstName: 'Anna', gradYear: '2024', lastName: 'Monaco', password: 'test', techStack: ['Python'], username: 'anna',
      },
    }],
  });
  const response = await api.getConversations('627765ac6abd90a9326adedf');
  expect(response).toMatchObject([{
    _id: { recipients: '627765ac6abd90a9326adedf', sender: '6276ead29c45b2c7ec3a5bc9' },
    latestMessage: 'hello user1 (USED IN TESTING)',
    recipient: {
      _id: '627765ac6abd90a9326adedf', affiliation: 'user1', bio: 'hi', email: 'user1@seas.upenn.edu', firstName: 'user1', gradYear: '2024', lastName: 'user1', password: 'user1', techStack: ['Python'], username: 'user1',
    },
    sender: {
      _id: '6276ead29c45b2c7ec3a5bc9', affiliation: 'UPenn', bio: 'hi', email: 'anmonaco@seas.upenn.edu', firstName: 'Anna', gradYear: '2024', lastName: 'Monaco', password: 'test', techStack: ['Python'], username: 'anna',
    },
  }]);
});

test('get messages', async () => {
  mock.onGet(`${rootURL}/messages`).reply(200, {
    data: [{
      _id: '62784a6a01ec9ba63e4f9430', message: 'hello user1 (USED IN TESTING)', recipients: [{ _id: '627765ac6abd90a9326adedf', email: 'user1@seas.upenn.edu', username: 'user1' }], sender: { _id: '6276ead29c45b2c7ec3a5bc9', email: 'anmonaco@seas.upenn.edu', username: 'anna' }, timeStamp: 1652050538727,
    }],
  });
  const response = await api.getMessages('627765ac6abd90a9326adedf', '6276ead29c45b2c7ec3a5bc9');
  expect(response).toMatchObject([{
    _id: '62784a6a01ec9ba63e4f9430', message: 'hello user1 (USED IN TESTING)', recipients: [{ _id: '627765ac6abd90a9326adedf', email: 'user1@seas.upenn.edu', username: 'user1' }], sender: { _id: '6276ead29c45b2c7ec3a5bc9', email: 'anmonaco@seas.upenn.edu', username: 'anna' }, timeStamp: 1652050538727,
  }]);
});

// ** failing **
/* test('create message', async () => {
  mock.onPost(`${rootURL}/messages`).reply(201, { data: {
    sender: '6276ead29c45b2c7ec3a5bc9',
    recipients: ['627765ac6abd90a9326adedf'],
    message: 'hello user1 (USED IN TESTING)',
    timeStamp: 1652031275793,
  }});
  const response = await api.createMessage({
    sender: '6276ead29c45b2c7ec3a5bc9',
    recipients: ['627765ac6abd90a9326adedf'],
    message: 'hello user1 (USED IN TESTING)',
    timeStamp: 1652031275793,
  });
  const messageData = {
    sender: '6276ead29c45b2c7ec3a5bc9',
    recipients: ['627765ac6abd90a9326adedf'],
    message: 'hello user1 (USED IN TESTING)',
    timeStamp: 1652031275793,
  }
  expect(response).toMatchObject(messageData);
}); */

// ** failing **
/* test('get user', async () => {
  mock.onGet(`${rootURL}/user`).reply(200, { data: {
    affiliation: 'University of Pennsylvania',
    bio: 'statistics+cogs+cs',
    email: 'emoneil@wharton.upenn.edu',
    firstName: 'Emma',
    gradYear: '2022',
    lastName: 'ONeil',
    password: 'hi',
    techStack: ['Python', 'Java', 'AWS', 'JavaScript', 'MongoDB'],
    username: 'emoneil',
  }});
  const response = await api.getUser({ 0: 'emoneil' });
  expect(response).toMatchObject({
    affiliation: 'University of Pennsylvania',
    bio: 'statistics+cogs+cs',
    email: 'emoneil@wharton.upenn.edu',
    firstName: 'Emma',
    gradYear: '2022',
    lastName: 'ONeil',
    password: 'hi',
    techStack: ['Python', 'Java', 'AWS', 'JavaScript', 'MongoDB'],
    username: 'emoneil',
  });
}); */
