const { ObjectId } = require('mongodb');

const dbModule = require('../dbOperations');

const config = require('../db-config');

let db;

test('get user info', async () => {
  // connect to the db
  db = await dbModule.connect(config.url);
  // call getUserInfo
  const user = await dbModule.getUserInfo(db, { username: 'emoneil', password: 'hi' });
  // get user in db
  const userDB = await db.collection('User').findOne({ username: 'emoneil' });
  expect(user).toEqual(userDB);
});

test('register user', async () => {
  // connect to the db
  db = await dbModule.connect(config.url);
  // delete emoneil from db
  await db.collection('User').deleteOne({ username: 'emoneil' });
  // call registerUser
  await dbModule.registerUser(db, {
    username: 'emoneil',
    email: 'emoneil@wharton.upenn.edu',
    password: 'hi',
    affiliation: 'University of Pennsylvania',
    techStack: ['Python', 'Java', 'AWS', 'JavaScript', 'MongoDB'],
    firstName: 'Emma',
    lastName: 'ONeil',
    gradYear: '2022',
    bio: 'statistics+cogs+cs',
  });
  // find user in db
  const user = await db.collection('User').findOne({ username: 'emoneil' });
  // test that user is emoneil
  expect(user.username).toEqual('emoneil');
});

test('reset password', async () => {
  // connect to the db
  db = await dbModule.connect(config.url);
  // call resetPassword
  const output = await dbModule.resetPassword(db, { username: 'EmmaONeil', newPassword: 'hi' });
  // get user in db
  const userDB = await db.collection('User').findOne({ username: 'EmmaONeil' });
  expect(output).toEqual(200);
  expect(userDB.password).toEqual('hi');

  // set back
  await dbModule.resetPassword(db, { username: 'EmmaONeil', newPassword: 'hello' });
});

test('get user', async () => {
  // connect to the db
  db = await dbModule.connect(config.url);
  // call getUser
  const output = await dbModule.getUser(db, ['emoneil', null]);
  // get user in db
  const userDB = await db.collection('User').findOne({ username: 'emoneil' });
  expect(output).toMatchObject(userDB);
});

test('get posts', async () => {
  // connect to the db
  db = await dbModule.connect(config.url);
  const filter = {
    roles: [],
    techStack: [],
    teamSize: [],
    sector: [],
    projectLength: ['2 Months'],
    timeCommitment: [],
  };
  // call getPosts
  const output = await dbModule.getPosts(db, filter);
  // get posts in db
  const posts = await db.collection('Post').find(filter).sort({ timestamp: -1 }).toArray();
  expect(output).toMatchObject(posts);
});

test('create post', async () => {
  // connect to the db
  db = await dbModule.connect(config.url);
  const data = {
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
  };
  // call createPost
  await dbModule.createPost(db, data);
  // find post in the db
  const newPost = await db.collection('Post').findOne({ description: 'testing creating post' });
  // test that newPost is the post inserted
  expect(newPost.description).toEqual('testing creating post');
  await db.collection('Post').deleteOne({ description: 'testing creating post' });
});

test('get messages', async () => {
  // connect to the db
  db = await dbModule.connect(config.url);
  // call getMessages
  const output = await dbModule.getMessages(db, '627765ac6abd90a9326adedf', '6276ead29c45b2c7ec3a5bc9');

  const filter = [{
    $match: {
      $or: [
        {
          recipients: new ObjectId('627765ac6abd90a9326adedf'),
          sender: new ObjectId('6276ead29c45b2c7ec3a5bc9'),
        },
        {
          recipients: new ObjectId('6276ead29c45b2c7ec3a5bc9'),
          sender: new ObjectId('627765ac6abd90a9326adedf'),
        },
      ],
    },
  }, {
    $lookup: {
      from: 'User',
      localField: 'sender',
      foreignField: '_id',
      as: 'sender',
    },
  }, {
    $addFields: {
      sender: { $arrayElemAt: ['$sender', 0] },
    },
  },
  {
    $lookup: {
      from: 'User',
      localField: 'recipients',
      foreignField: '_id',
      as: 'recipients',
    },
  }, {
    $project: {
      message: 1,
      timeStamp: 1,
      sender: {
        _id: 1,
        username: 1,
        email: 1,
      },
      recipients: {
        _id: 1,
        username: 1,
        email: 1,
      },
    },
  }];
  // get messages in db
  const messages = await db.collection('Message').aggregate(filter).sort({ timeStamp: -1 }).toArray();
  expect(output).toMatchObject(messages);
});

/* test('get conversations', async () => {
  // connect to the db
  db = await dbModule.connect(config.url);
  // call getConversations
  const output = await dbModule.getConversations(db, '627765ac6abd90a9326adedf');

  const userId = new ObjectId('627765ac6abd90a9326adedf');
  // get conversations in db
  const conversations = await db.collection('Message').aggregate([

    {
      $match: {
        $or: [
          { sender: userId },
          { recipients: userId },
        ],
      },
    },
    { $sort: { timeStamp: -1 } },
    { $unwind: { path: '$recipients', preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { sender: '$sender', recipients: '$recipients' },
        latestMessage: { $first: '$message' },

      },
    },
    {
      $lookup: {
        from: 'User',
        localField: '_id.recipients',
        foreignField: '_id',
        as: 'recipient',
      },
    },
    {
      $lookup: {
        from: 'User',
        localField: '_id.sender',
        foreignField: '_id',
        as: 'sender',
      },
    },
    {
      $addFields: {
        sender: {
          $arrayElemAt: [
            '$sender',
            0,
          ],
        },

        recipient: {
          $arrayElemAt: [
            '$recipient',
            0,
          ],
        },
      },
    },
  ]).toArray();

  expect(output).toMatchObject(conversations);
}); */

/* test('create message', async () => {
  // connect to the db
  db = await dbModule.connect(config.url);

  const data = {
    sender: '6276ead29c45b2c7ec3a5bc9',
    recipients: ['627765ac6abd90a9326adedf'],
    message: 'hello user1 (USED IN TESTING)',
    timeStamp: 1652031275793,
  };
  // call createMessage
  await dbModule.createMessage(db, data);
  // find message in the db
  const newMessage = await db.collection('newMessage').findOne(
    {
      sender: ObjectId('6276ead29c45b2c7ec3a5bc9'),
      recipients: [ObjectId('627765ac6abd90a9326adedf')],
      message: 'hello user1 (USED IN TESTING)',
      timeStamp: 1652031275793,
    },
  );
  // test that newMessage is the message inserted
  expect(newMessage.message).toEqual('hello user1 (USED IN TESTING)');
  await db.collection('Message').deleteOne(data);
}); */
