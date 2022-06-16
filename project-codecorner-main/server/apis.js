/* eslint-disable no-await-in-loop */
const { ObjectId } = require('mongodb');
const lib = require('./dbOperations');

module.exports = (db, io, webapp) => {
  // Root endpoint
  webapp.get('/', (req, res) => {
    res.json({ message: 'Welcome to Cynergy' });
  });

  // login endpoint
  webapp.post('/login', async (req, resp) => {
    // check the username was provided
    if (!req.body.username || req.body.username.length === 0) {
      resp.status(404).json({ error: 'username not provided' });
      return;
    }
    // check the password was provided
    if (!req.body.password || req.body.password.length === 0) {
      resp.status(404).json({ error: 'password not provided' });
      return;
    }
    try {
      const result = await lib.getUserInfo(
        db,
        { username: req.body.username, password: req.body.password },
      );
      if (result === 401) {
        resp.status(401).json({ error: 'incorrect password provided' });
        return;
      }
      if (result === 404) {
        resp.status(404).json({ error: 'user does not exist' });
        return;
      }
      resp.status(200).json({ data: result });
    } catch (err) {
      resp.status(500).json({ error: 'could not log in, try again later' });
    }
  });

  // registration endpoint
  webapp.post('/register', async (req, resp) => {
    // check the username was provided
    if (!req.body.username || req.body.username.length === 0) {
      resp.status(404).json({ error: 'username not provided' });
      return;
    }
    // check the email was provided
    if (!req.body.email || req.body.email.length === 0) {
      resp.status(404).json({ error: 'email not provided' });
      return;
    }
    // check the password was provided
    if (!req.body.password || req.body.password.length === 0) {
      resp.status(404).json({ error: 'password not provided' });
      return;
    }

    // check the affiliation was provided
    if (!req.body.affiliation || req.body.affiliation.length === 0) {
      resp.status(404).json({ error: 'affiliation not provided' });
      return;
    }

    // check the tech stack was provided
    if (!req.body.techStack || req.body.techStack.length === 0) {
      resp.status(404).json({ error: 'tech stack not provided' });
      return;
    }

    try {
      const result = await lib.registerUser(
        db,
        {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          affiliation: req.body.affiliation,
          techStack: req.body.techStack,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          gradYear: req.body.gradYear,
          bio: req.body.bio,
        },
      );
      if (result === 0) {
        resp.status(409).json({ error: 'user with this username exists' });
      } else if (result === 1) {
        resp.status(409).json({ error: 'user with this email exists' });
      } else {
        resp.status(201).json({ data: result });
      }
    } catch (err) {
      resp.status(500).json({ error: 'could not register, try again later' });
    }
  });

  // get posts
  webapp.get('/posts', async (req, resp) => {
    try {
      const posts = await lib.getPosts(db, req.query);
      resp.status(200).json({ data: posts });
      return;
    } catch (err) {
      resp.status(500).json({ error: 'could not get posts, try again later' });
    }
  });

  // create post
  webapp.post('/newpost', async (req, resp) => {
    if (!req.body.data || req.body.data.length === 0) {
      resp.status(400).json({ error: 'invalid input, object invalid' });
      return;
    }

    try {
      await lib.createPost(db, req.body.data);
      resp.status(201).json({ data: req.body.data });
      return;
    } catch (err) {
      resp.status(500).json({ error: err });
    }
  });

  // get messages
  webapp.get('/messages', async (req, resp) => {
    try {
      const { recipientId, senderId } = req.query;
      const messages = await lib.getMessages(db, recipientId, senderId);
      resp.status(200).json({ data: messages });
    } catch (err) {
      resp.status(500).json({ error: 'could not get messages, try again later' });
    }
  });

  // create message
  webapp.post('/messages', async (req, resp) => {
    try {
      const message = await lib.createMessage(db, req.body.data);

      // create a new notification
      // eslint-disable-next-line no-restricted-syntax
      for (const recepient of req.body.data.recipients) {
        const data = {
          title: 'New Message Received',
          userId: recepient,
          unread: true,
          payload: {
            messageId: message.insertedId,
          },
        };

        let notification = await db.collection('Notification').insertOne(data);
        notification = await db.collection('Notification').findOne({ _id: notification.insertedId });
        notification.payload.messageId = await db.collection('Message').findOne({ _id: notification.payload.messageId });
        notification.payload.messageId.sender = await db.collection('User').findOne({ _id: notification.payload.messageId.sender }, { _id: 1, username: 1, email: 1 });
        notification.payload.messageId.recipients = await db.collection('User').find({ _id: { $in: notification.payload.messageId.recipients } }, { _id: 1, username: 1, email: 1 }).toArray();
        io.emit(`notifications/${recepient}`, notification);
      }
      // eslint-disable-next-line no-underscore-dangle
      req.body.data._id = message.insertedId;
      req.body.data.sender = await db.collection('User').findOne({ _id: new ObjectId(req.body.data.sender) }, { _id: 1, username: 1, email: 1 });

      req.body.data.recipients = await db.collection('User').find({ _id: { $in: req.body.data.recipients } }, { _id: 1, username: 1, email: 1 }).toArray();
      resp.status(201).json({ data: req.body.data });
    } catch (err) {
      resp.status(500).json({ error: 'could not create message, try again later' });
    }
  });

  webapp.put('/resetpassword', async (req, resp) => {
    // check the username was provided
    if (!req.body.username || req.body.username.length === 0) {
      resp.status(404).json({ error: 'username not provided' });
      return;
    }
    // check the new password was provided
    if (!req.body.newPassword || req.body.newPassword.length === 0) {
      resp.status(404).json({ error: 'new password not provided' });
      return;
    }
    try {
      const result = await lib.resetPassword(
        db,
        { username: req.body.username, newPassword: req.body.newPassword },
      );
      if (result === 404) {
        resp.status(404).json({ error: 'user does not exist' });
      } else {
        resp.status(200).json({ message: 'password updated' });
      }
    } catch (err) {
      resp.status(500).json({ error: 'could not reset password, try again later' });
    }
  });

  // get user info
  webapp.get('/user', async (req, resp) => {
    try {
      const user = await lib.getUser(db, req.query);
      if (user !== 404) {
        resp.status(200).json({ data: user });
        return;
      }
      resp.status(404).json({ error: 'user does not exist' });
      return;
    } catch (err) {
      resp.status(500).json({ error: 'could not get user, try again later' });
    }
  });

  // get conversations
  webapp.get('/conversations', async (req, resp) => {
    try {
      const { userId } = req.query;
      const conversations = await lib.getConversations(db, userId);
      resp.status(200).json({ data: conversations });
    } catch (err) {
      resp.status(500).json({ error: 'could not get conversations, try again later' });
    }
  });

  // Default response for any other request
  webapp.use((_req, res) => {
    res.status(404);
  });
};
