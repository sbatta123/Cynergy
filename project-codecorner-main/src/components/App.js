import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';
import { NotificationsProvider } from '../contexts/Notifications/NotificationsContext';
import Router from './Router';

function App() {
  return (
    <NotificationsProvider>
      <div className="App">
        <Router />
        <ToastContainer />
      </div>
    </NotificationsProvider>
  );
}

export default App;
