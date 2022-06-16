import axios from 'axios';
import utils from './utils';

const { rootURL } = utils;

export async function login(user, userPassword) {
  let output;
  try {
    const response = await axios.post(`${rootURL}/login`, {
      username: user,
      password: userPassword,
    });
    if (response.status === 200) {
      return response.data.data;
    }
  } catch (error) {
    output = error.response.data.error;
  }
  return output;
}

export async function register(
  user,
  userEmail,
  userPassword,
  affiliation,
  techStack,
  firstName,
  lastName,
  gradYear,
  bio,
) {
  let output;
  try {
    const response = await axios.post(`${rootURL}/register`, {
      username: user,
      email: userEmail,
      password: userPassword,
      affiliation,
      techStack,
      firstName,
      lastName,
      gradYear,
      bio,
    });
    if (response.status === 201) {
      output = response.data.data;
    }
  } catch (error) {
    output = error.response.data.error;
  }
  return output;
}

export async function getPosts(filterData) {
  try {
    const response = await axios.get(`${rootURL}/posts`, { params: filterData });
    return response.data.data;
  } catch (err) {
    throw new Error('something went wrong');
  }
}

export async function createPost(data) {
  try {
    await axios.post(`${rootURL}/newpost`, { data });
    return true;
  } catch (err) {
    throw new Error('something went wrong');
  }
}

export async function getMessages(recipientId, senderId) {
  try {
    const response = await axios.get(`${rootURL}/messages`, { params: { recipientId, senderId } });
    return response.data.data;
  } catch (err) {
    throw new Error('something went wrong');
  }
}

export async function createMessage(data) {
  try {
    return await axios.post(`${rootURL}/messages`, { data });
  } catch (err) {
    throw new Error('something went wrong');
  }
}

export async function getConversations(userId) {
  try {
    const response = await axios.get(`${rootURL}/conversations`, { params: { userId } });
    return response.data.data;
  } catch (err) {
    throw new Error('something went wrong');
  }
}
export async function resetPassword(user, userNewPassword) {
  let output;
  try {
    const response = await axios.put(`${rootURL}/resetpassword`, {
      username: user,
      newPassword: userNewPassword,
    });
    if (response.status === 200) {
      output = response.data.message;
    }
  } catch (error) {
    output = error.response.data.error;
  }
  return output;
}
export async function getUser(username) {
  try {
    const response = await axios.get(`${rootURL}/user`, { params: username });
    return response.data.data;
  } catch (err) {
    throw new Error('something went wrong');
  }
}

export async function getNumPosts(user) {
  try {
    const response = await axios.get(`${rootURL}/numPosts`, { params: { user } });
    return response.data.data;
  } catch (err) {
    throw new Error('something went wrong');
  }
}
