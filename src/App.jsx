import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './LoginAuth/auth.jsx';
import Profile from './components/profile/profile.jsx';
import Homepage from './components/homepage.jsx';
import { UserProvider } from './components/usercontext'; // Import your userProvider context to share with all components
import ViewPost from './components/mainfeed/postLogic/viewPost/viewPost.jsx';
import Users from './components/users/users.jsx';
import './App.css'
import './index.css'


function App() {
  return (
    <>
      <Router>
      <UserProvider>

        <Routes>
          <Route path="/" index element={<Auth/>}/>
          <Route path="/homepage" index element={<Homepage/>}/>
          <Route path= "/viewPost" element={<ViewPost/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/users" element={<Users/>}/>
        </Routes>
        </UserProvider>

      </Router>
    </>
  )
}

export default App
