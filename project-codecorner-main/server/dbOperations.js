/* eslint-disable no-param-reassign */
// import MongoDB driver
const { MongoClient, ObjectId } = require('mongodb');

// connect to the DB and return the connection object
const connect = async (url) => {
  try {
    const conn = (await MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )).db();
    // eslint-disable-next-line no-console
    console.log(`Connected to the database: ${conn.databaseName}`);
    return conn;
  } catch (error) {
    throw new Error('could not connect to the db');
  }
};

// login
async function getUserInfo(db, user) {
  try {
    let output;
    const userInDatabase = await db.collection('User').findOne({ username: `${user.username}` });
    if (userInDatabase) {
      if (userInDatabase.password === user.password) {
        output = userInDatabase;
      } else {
        output = 401;
      }
    } else {
      output = 404;
    }
    return output;
  } catch (error) {
    throw new Error('could not get user info');
  }
}

// register
async function registerUser(db, user) {
  try {
    let output;
    const usernameInDatabase = await db.collection('User').findOne({ username: `${user.username}` });
    if (usernameInDatabase) {
      return 0;
    }
    const emailInDatabase = await db.collection('User').findOne({ email: `${user.email}` });
    if (emailInDatabase) {
      return 1;
    }
    const result = await db.collection('User').insertOne(user);
    if (result.acknowledged) {
      output = user;
    } else {
      throw new Error('could not insert user into db');
    }
    return output;
  } catch (error) {
    throw new Error('could not register user');
  }
}

// posts
async function getPosts(db, filter) {
  try {
    const posts = await db.collection('Post').find(filter).sort({ timestamp: -1 }).toArray();
    return posts;
  } catch (err) {
    throw new Error('could not get posts');
  }
}

async function createPost(db, data) {
  try {
    await db.collection('Post').insertOne(data);
  } catch (err) {
    throw new Error('could not create post');
  }
}

// messages
async function getMessages(db, recipientId, senderId) {
  try {
    recipientId = new ObjectId(recipientId);
    senderId = new ObjectId(senderId);
    const filter = [{
      $match: {
        $or: [
          {
            recipients: recipientId,
            sender: senderId,
          },
          {
            recipients: senderId,
            sender: recipientId,
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
    const messages = await db.collection('Message').aggregate(filter).sort({ timeStamp: -1 }).toArray();
    return messages;
  } catch (err) {
    throw new Error('could not get messages');
  }
}

async function getConversations(db, userId) {
  try {
    userId = new ObjectId(userId);
    // get users that are contacted
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
    return (conversations);
  } catch (err) {
    throw new Error('could not get messages');
  }
}

async function createMessage(db, data) {
  try {
    data.sender = new ObjectId(data.sender);
    data.recipients = data.recipients.map((id) => new ObjectId(id));
    data.timeStamp = new Date().getTime();
    return await db.collection('Message').insertOne(data);
  } catch (err) {
    throw new Error('could not create message');
  }
}

async function resetPassword(db, user) {
  try {
    let output;
    const userInDatabase = await db.collection('User').findOne({ username: `${user.username}` });
    if (userInDatabase) {
      db.collection('User').updateOne(
        { username: `${user.username}` },
        { $set: { password: `${user.newPassword}` } },
      );
      output = 200;
    } else {
      output = 404;
    }
    return output;
  } catch (error) {
    throw new Error('could not reset password');
  }
}

// posts
async function getUser(db, userInput) {
  try {
    const user = await db.collection('User').findOne({ username: userInput[0] });
    if (user) {
      return user;
    }
    return 404;
  } catch (err) {
    throw new Error('could not get user info');
  }
}

module.exports = {
  connect,
  getUserInfo,
  registerUser,
  getPosts,
  createPost,
  getMessages,
  createMessage,
  resetPassword,
  getUser,
  getConversations,
};
