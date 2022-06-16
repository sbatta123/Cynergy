/* eslint-disable no-underscore-dangle */
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import React, { useState, useEffect } from 'react';
import '../style/Messaging.css';
import {
  Col, Container, ListGroup, Row,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import moment from 'moment';
import {
  getMessages, createMessage, getConversations, getUser,
} from '../modules/api';
import Header from './Header';
import utils from '../modules/utils';
import { useNotifications } from '../contexts/Notifications/NotificationsContext';

function Messaging() {
  const [cookies] = useCookies(['currentUser']);
  const { username } = useParams();
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const notifications = useNotifications();
  // eslint-disable-next-line no-shadow
  const fetchUser = async (username) => {
    const userResponse = await getUser(username);
    return userResponse;
  };

  // eslint-disable-next-line no-shadow
  const fetchMessages = async (userId) => {
    const messagesResponse = await getMessages(
      userId,
      cookies.currentUser._id,
    );
    setMessages(messagesResponse);
  };

  const sendMessage = async (sender, recipients, message) => {
    const messagesResponse = await createMessage({
      sender, recipients, message,
    });
    return messagesResponse.data.data;
  };

  const fetchConversations = async () => {
    const conversationsResponse = await getConversations(
      cookies.currentUser._id,
    );
    setConversations(conversationsResponse);
  };

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async (e) => {
    const ENTER = 13;
    if (e.keyCode !== ENTER) return;
    const _newMessage = await sendMessage(cookies.currentUser._id, [userId], newMessage);
    setNewMessage('');
    setMessages([_newMessage, ...messages]);
  };

  // eslint-disable-next-line no-shadow
  const isMe = (user) => user._id === cookies.currentUser._id;

  const renderConversationItem = (item) => {
    const otherUser = !isMe(item.sender) ? item.sender : item.recipient;
    // eslint-disable-next-line no-debugger
    debugger;
    return (
      <Nav.Link href={`/messaging/${otherUser?.username}`}>

        <ListGroup.Item key={item.id} className="conversation-list-item">
          <Row className="align-items-center">
            <Col>
              <div className="avatar">
                <div className="circle">
                  <p className="initials">{otherUser && utils.getNameInitials(otherUser)}</p>
                </div>
              </div>
            </Col>
            <Col sm={8}>
              <div className="username">{otherUser?.username ? otherUser.username : 'guest'}</div>
              <small className="message">{item.message}</small>
            </Col>
          </Row>
        </ListGroup.Item>
      </Nav.Link>
    );
  };
  const renderMessage = (item) => {
    let classNames = ['message-item'];
    if (item.sender?._id === cookies.currentUser._id) {
      classNames = [...classNames, 'message-sent'];
    } else {
      classNames = [...classNames, 'message-received'];
    }
    return (
      <div key={item._id} className={classNames.join(' ')}>
        <div className="avatar">
          <div className="circle">
            <p className="initials">{item.sender?.username}</p>
          </div>
        </div>
        <div className="message-body">
          <div className="message">{item.message}</div>
          <div className="timestamp"><small>{moment(item.timeStamp).format('MM/DD/YYYY hh:mm a')}</small></div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    fetchUser(username).then((user) => {
      setUser(user);
      setUserId(user._id);
    });
  }, [username]);

  useEffect(() => {
    fetchConversations();
    if (userId) {
      fetchMessages(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (!user) return;
    const latestNotification = notifications[notifications.length - 1];
    if (latestNotification?.payload?.messageId) {
      const exists = messages.find((m) => m._id === latestNotification.payload.messageId._id);
      if (!exists) {
        const newMessages = [latestNotification.payload.messageId, ...messages];
        setMessages(newMessages);
      }
    }
  }, [user, notifications]);

  return (
    <div className="main-container">
      <Header />
      <Container fluid className="messaging-container">
        <Row style={{ height: '100%' }}>
          <Col sm={4}>
            <ListGroup>
              {conversations.map(renderConversationItem)}
            </ListGroup>
          </Col>
          <Col sm={8}>
            {userId && (
            <Container as={Card} className="conversation-container p-4">
              <div className="conversation-header">
                <div className="avatar">
                  <div className="circle">
                    <p className="initials">{utils.getNameInitials(user)}</p>
                  </div>
                </div>
                <div className="username">
                  <strong>{utils.getFullName(user)}</strong>
                  {' '}
                  |
                  {' '}
                  {utils.getAffiliation(user)}
                </div>
              </div>
              <div className="conversation-content">
                <div className="conversation-messages">
                  {(messages?.map(renderMessage))}
                </div>
              </div>
              <div className="conversation-textarea-wrapper">
                <Form.Control type="text" value={newMessage} onChange={handleNewMessageChange} onKeyDown={handleSendMessage} />
              </div>
            </Container>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Messaging;
