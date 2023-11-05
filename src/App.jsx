import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './LoginAuth/auth.jsx';
import Profile from './components/sidebar/profile/profile.jsx';
import Homepage from './components/homepage.jsx';
import { UserProvider } from './components/usercontext'; // Import your userProvider context to share with all components
import ViewPost from './components/mainfeed/postLogic/viewPost/viewPost.jsx';

import './App.css'


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
        </Routes>
        </UserProvider>

      </Router>
    </>
  )
}

export default App
