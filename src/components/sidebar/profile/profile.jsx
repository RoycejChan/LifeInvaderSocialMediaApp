import React from "react"
import SideBar from "../sidebar.jsx";
import UsersBar from "../../usersbar/usersbar.jsx";
import { useUser } from "../../usercontext.jsx";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const Profile = () => {
    const { userData } = useUser();
    const user = userData;
    console.log(userData);
    console.log(userData.username);
    console.log(user.username);
    return (
        <div className="homepage">
        <SideBar/>
            <div className="profile-container">
                    <div className="profile-header">
                        <p>{user.username}</p>
                    </div>
                

                <div className="profile-header">
                </div>
            </div>
        <UsersBar/>
        </div>
    )
}

export default Profile