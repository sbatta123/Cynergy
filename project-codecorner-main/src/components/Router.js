import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Login from './Login';
import Homepage from './Homepage';
import Registration from './Registration';
import ResetPassword from './ResetPassword';
import Post from './Post';
import Profile from './Profile';
import OtherProfile from './OtherProfile';
import Messaging from './Messaging';

export default function Router() {
  const [cookies] = useCookies(['username']);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/post" element={<Post />} />
        <Route
          exact
          path="/profile"
          element={!cookies.username ? <Login /> : <Profile />}
        />
        <Route
          path="/profile/:username"
          element={!cookies.username ? <Login /> : <OtherProfile />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messaging/:username" element={<Messaging />} />
        <Route path="/messaging" element={<Messaging />} />
      </Routes>
    </BrowserRouter>
  );
}
