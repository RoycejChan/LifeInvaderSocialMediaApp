import React, { useState, useEffect, useContext, createContext} from "react"
import { useUser } from "../../../usercontext.jsx";
import { useLocation } from "react-router-dom";

import SideBar from "../../../sidebar/sidebar.jsx";
import UsersBar from "../../../usersbar/usersbar.jsx";

import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import Button from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ForumIcon from '@mui/icons-material/Forum';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';

const ViewPost = () => {
    const location = useLocation();
    const userData = location.state.user; 
   



    return (
        <div className="homepage">
        <SideBar/>

        
            <div className="profile-container">
</div>


        <UsersBar/>
        </div>
    )
}

export default ViewPost