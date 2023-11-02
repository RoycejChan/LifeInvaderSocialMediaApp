import React from "react"
import "./profile.css"
import { useLocation } from 'react-router-dom';

import SideBar from "../sidebar.jsx";
import UsersBar from "../../usersbar/usersbar.jsx";
// import { useUser } from "../../usercontext.jsx";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

const Profile = (user) => {
    const location = useLocation();
    const userData = location.state.user;
  
    console.log(userData);
    console.log(userData.username);
    return (
        <div className="homepage">
        <SideBar/>

        
            <div className="profile-container">
                    <div className="profile-header">
                        <Button variant="text" className="back-to-home-page"><KeyboardBackspaceRoundedIcon className="back-to-home-page"/></Button>
                        <div className="profile-header-details">
                            <h3 className="profile-header-username">{userData.username}</h3>
                            <p className="profile-postAmount">23 Posts</p>
                        </div>
                        <Button variant="outlined" sx={{ color: '#176daf' }} className="editProfile">Edit Profile</Button>
                    </div>

            </div>


        <UsersBar/>
        </div>
    )
}

export default Profile