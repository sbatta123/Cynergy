/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import socketIOClient from 'socket.io-client';
import React, {
  createContext, useContext, useState, useEffect,
} from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import utils from '../../modules/utils';

const { rootURL } = utils;

const NotificationsContext = createContext('notifications');

export function NotificationsProvider({ children }) {
  const [cookies] = useCookies(['currentUser']);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!cookies.currentUser) return;
    const socket = socketIOClient(rootURL);
    const userId = cookies.currentUser._id;
    socket.on('connection', (data) => {
      console.log('Socket connection', data);
      // setResponse(data);
    });

    socket.on(`notifications/${userId}`, (notitification) => {
      console.log('User notification received', notitification);
      const newNotitifications = [...notifications, notitification];
      setNotifications(newNotitifications);
      toast('New message received');
    });
  }, [cookies]);

  return (
    <NotificationsContext.Provider value={notifications}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
  const notifications = useContext(NotificationsContext);
  return notifications;
};
