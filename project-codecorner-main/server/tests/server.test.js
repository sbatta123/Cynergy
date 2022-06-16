const request = require('supertest');

const config = require('../db-config');

const webapp = require('../server');

const dbLib = require('../dbOperations');

beforeAll(async () => {
  webapp.listen();
  await dbLib.connect(config.url);
});

describe('/login endpoint tests', () => {
  test('/login endpoint status code and response 404', () => request(webapp).post('/login', { 'Content-Type': 'application/json' }).send({ test: 'hey' })
    .expect(404)
    .then((response) => {
      expect(JSON.parse(response.text).error).toBe('username not provided');
    }));

  test('status code 200 and response', () => request(webapp).post('/login', { 'Content-Type': 'application/json' }).send({ username: 'emoneil', password: 'hi' })
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).data.username).toContain('emoneil');
    }));

  test('status code 401', () => request(webapp).post('/login', { 'Content-Type': 'application/json' }).send({ username: 'emoneil', password: 'hello' })
    .expect(401)
    .then((response) => {
      expect(JSON.parse(response.text).error).toContain('incorrect password provided');
    }));

  test('status code 404 user does not exist', () => request(webapp).post('/login', { 'Content-Type': 'application/json' }).send({ username: 'jason', password: 'hi' })
    .expect(404)
    .then((response) => {
      expect(JSON.parse(response.text).error).toContain('user does not exist');
    }));
});

describe('/register endpoint tests', () => {
  test('/register endpoint status code and response 404', () => request(webapp).post('/register', { 'Content-Type': 'application/json' }).send({ test: 'hey' })
    .expect(404)
    .then((response) => {
      expect(JSON.parse(response.text).error).toBe('username not provided');
    }));

  /* test('status code 201 and response', async () => {
    const db = await dbLib.connect(config.url);
    await db.collection('User').deleteOne({ username: 'emoneil' });
    return request(webapp).post('/register', { 'Content-Type': 'application/json' }).send(
      {
        username: 'emoneil',
        email: 'emoneil@wharton.upenn.edu',
        password: 'hi',
        affiliation: 'University of Pennsylvania',
        techStack: ['Python', 'Java', 'AWS', 'JavaScript', 'MongoDB'],
        firstName: 'Emma',
        lastName: 'ONeil',
        gradYear: '2022',
        bio: 'statistics+cogs+cs',
      },
    )
      .expect(201)
      .then((response) => {
        expect(JSON.parse(response.text).data.username).toContain('emoneil');
      });
  }); */

  test('status code 409 user with this username exists', () => request(webapp).post('/register', { 'Content-Type': 'application/json' }).send(
    {
      username: 'EmmaONeil',
      email: 'emoneil@sas.upenn.edu',
      password: 'hi',
      affiliation: 'University of Pennsylvania',
      techStack: ['Python', 'Java', 'AWS', 'JavaScript', 'MongoDB'],
      firstName: 'Emma',
      lastName: 'ONeil',
      gradYear: '2022',
      bio: 'statistics+cogs+cs',
    },
  )
    .expect(409)
    .then((response) => {
      expect(JSON.parse(response.text).error).toContain('user with this username exists');
    }));
});

describe('/resetpassword endpoint tests', () => {
  test('/resetpassword endpoint status code and response 404', () => request(webapp).put('/resetpassword', { 'Content-Type': 'application/json' }).send({ test: 'hey' })
    .expect(404)
    .then((response) => {
      expect(JSON.parse(response.text).error).toBe('username not provided');
    }));

  test('status code 200 and response', () => request(webapp).put('/resetpassword', { 'Content-Type': 'application/json' }).send({ username: 'EmmaONeil', newPassword: 'hi' })
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).message).toContain('password updated');
      request(webapp).put('/resetpassword', { 'Content-Type': 'application/json' }).send({ username: 'EmmaONeil', newPassword: 'hello' });
    }));

  test('status code 404 user does not exist', () => request(webapp).put('/resetpassword', { 'Content-Type': 'application/json' }).send({ username: 'alice', newPassword: 'hi' })
    .expect(404)
    .then((response) => {
      expect(JSON.parse(response.text).error).toContain('user does not exist');
    }));
});

/* describe('/user endpoint test', () => {
  const username = ['emoneil'];
  test('status code 200 and response', () =>
  request(webapp).get('/user', { 'Content-Type': 'application/json' }).query(username)
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).data).toMatchObject({
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
    }));
}); */

describe('/posts endpoint test', () => {
  test('status code 200 and response', () => request(webapp).get('/posts', { 'Content-Type': 'application/json' }).query({
    roles: [],
    techStack: [],
    teamSize: [],
    sector: [],
    projectLength: ['2 Months'],
    timeCommitment: [],
  })
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).data).toMatchObject([
        {
          _id: '627aa56f2d52cf1b60ffeeb5',
          firstName: 'Riya',
          lastName: 'Setty',
          username: 'riyasetty',
          affiliation: 'University of Pennsylvania',
          title: 'MAJOR SLAY',
          description: 'hey guys welcome to my youtube channel',
          roles: ['Backend'],
          techStack: ['Swift'],
          teamSize: ['6-10 People'],
          sector: ['News'],
          projectLength: ['2 Months'],
          timeCommitment: ['6-10 hours/week'],
          timestamp: 1652204910936,
          userId: '626f7a4397ae67dd8dc87d30',
        },
        {
          _id: '627a9d05a0bb38c9687d0593',
          firstName: 'Test5',
          lastName: 'Test5',
          username: 'test5',
          affiliation: 'penn',
          title: 'messaging app',
          description: 'i want an app that has messaging',
          roles: [],
          techStack: [],
          teamSize: [],
          sector: [],
          projectLength: ['2 Months'],
          timeCommitment: ['6-10 hours/week'],
          timestamp: 1652202757608,
          userId: '6278e24cf9083ef53a2608b7',
        },
        {
          _id: '627a957b2d52cf1b60ffeeb3',
          firstName: 'test3',
          lastName: 'test3',
          username: 'test3',
          affiliation: 'n/a',
          title: 'Website for fundraiser',
          description: 'I am looking to create a website to raise money for cancer research.',
          roles: ['Full Stack'],
          techStack: ['AWS', 'Python', 'Swift'],
          teamSize: ['6-10 People'],
          sector: ['Charity'],
          projectLength: ['2 Months'],
          timeCommitment: ['6-10 hours/week'],
          timestamp: 1652200827397,
          userId: '6278e24cf9083ef53a2608b7',
        },
        {
          _id: '6276bf7a14d9ac878c6c2dce',
          firstName: 'Riya',
          lastName: 'Setty',
          username: 'riyasetty',
          affiliation: 'University of Pennsylvania',
          title: 'Testing no more hardcoded posts',
          description: 'test test test',
          roles: ['Backend'],
          techStack: ['Python', 'AWS', 'LAMP'],
          teamSize: ['6-10 People'],
          sector: ['Education'],
          projectLength: ['2 Months'],
          timeCommitment: ['11-15 hours/week'],
          timestamp: 1651949434123,
        },
      ]);
    }));
});

describe('/newpost endpoint test', () => {
  test('status code 400 and response', () => request(webapp).post('/newpost', { 'Content-Type': 'application/json' }).send({})
    .expect(400)
    .then((response) => {
      expect(JSON.parse(response.text).error).toBe('invalid input, object invalid');
    }));

  test('status code 200 and response', () => request(webapp).post('/newpost', { 'Content-Type': 'application/json' }).send({
    data: {
      firstName: 'Emma',
      lastName: 'Watson',
      username: 'emmawatson',
      affiliation: 'University of Pennsylvania',
      title: 'testing postsss',
      description: 'testing creating post',
      projectLength: ['1 Month'],
      roles: ['Frontend'],
      sector: ['Education'],
      teamSize: ['6-10 People'],
      techStack: ['Python'],
      timeCommitment: ['1-5 hours/week'],
      timestamp: 1652035750873,
    },
  })
    .expect(201)
    .then((response) => {
      expect(JSON.parse(response.text).data).toMatchObject({
        firstName: 'Emma',
        lastName: 'Watson',
        username: 'emmawatson',
        affiliation: 'University of Pennsylvania',
        title: 'testing postsss',
        description: 'testing creating post',
        projectLength: ['1 Month'],
        roles: ['Frontend'],
        sector: ['Education'],
        teamSize: ['6-10 People'],
        techStack: ['Python'],
        timeCommitment: ['1-5 hours/week'],
        timestamp: 1652035750873,
      });
    }));
});

/* describe('/conversations endpoint test', () => {
  test('status code 200 and response', () =>
  request(webapp).get('/conversations', { 'Content-Type': 'application/json' })
    .query({ userId: '627765ac6abd90a9326adedf' })
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).data).toMatchObject(
        [{
          _id: { recipients: '627765ac6abd90a9326adedf', sender: '6276ead29c45b2c7ec3a5bc9' },
          latestMessage: 'hello user1 (USED IN TESTING)',
          sender: {
            _id: '6276ead29c45b2c7ec3a5bc9', affiliation: 'UPenn', bio: 'hi',
            email: 'anmonaco@seas.upenn.edu', firstName: 'Anna',
            gradYear: '2024', lastName: 'Monaco', password: 'test',
            techStack: ['Python'], username: 'anna',
          },
        }, { _id: { recipients: '62786408187d0392c36d6556',
        sender: '627765ac6abd90a9326adedf' }, latestMessage: 'new message' }],
      );
    }));
}); */

describe('/messages get endpoint test', () => {
  test('status code 200 and response', () => request(webapp).get('/messages', { 'Content-Type': 'application/json' })
    .query({ recipientId: '627765ac6abd90a9326adedf', senderId: '6276ead29c45b2c7ec3a5bc9' })
    .expect(200)
    .then((response) => {
      expect(JSON.parse(response.text).data).toMatchObject(
        [{
          _id: '6279f49fc79f64429d925b62', message: 'hello user1 (USED IN TESTING)', recipients: [], sender: { _id: '6276ead29c45b2c7ec3a5bc9', email: 'anmonaco@seas.upenn.edu', username: 'anna' }, timeStamp: 1652159647331,
        }, {
          _id: '627979ebe300bb5961d03b74', message: 'hello user1 (USED IN TESTING)', recipients: [], sender: { _id: '6276ead29c45b2c7ec3a5bc9', email: 'anmonaco@seas.upenn.edu', username: 'anna' }, timeStamp: 1652128235874,
        }],
      );
    }));
});

/* describe('/messages post endpoint test', () => {
  test('status code 200 and response', () => request(webapp).post('/messages',
  { 'Content-Type': 'application/json' })
    .send({
      sender: '6276ead29c45b2c7ec3a5bc9',
      recipients: ['627765ac6abd90a9326adedf'],
      message: 'hello user1 (USED IN TESTING)',
      timeStamp: 1652031275793,
    })
    .expect(201)
    .then((response) => {
      expect(JSON.parse(response.text).data).toMatchObject({
        sender: '6276ead29c45b2c7ec3a5bc9',
        recipients: ['627765ac6abd90a9326adedf'],
        message: 'hello user1 (USED IN TESTING)',
        timeStamp: 1652031275793,
      });
    }));
}); */
