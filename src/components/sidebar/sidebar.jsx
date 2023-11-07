import React from "react"
import { useNavigate, Link } from "react-router-dom";

import { auth } from "../../FB-config/Firebase-config";
import { signOut } from "firebase/auth";
import { useUser } from "../usercontext";

import Auth from "../../LoginAuth/auth";
import './sidebar.css'
import Profile from "./profile/profile";

import Button from '@mui/material/Button';
import BugReportIcon from '@mui/icons-material/BugReport';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MailIcon from '@mui/icons-material/Mail';
import LogoutIcon from '@mui/icons-material/Logout';


const SideBar = () => {

  const { userData, setUser } = useUser();
  const user = userData;
  const navigate = useNavigate();
  

const toProfile = () => {
  navigate('/profile', { state: { user } });

}

const logout = () => {
  signOut(auth).then(()=> {
    setUser(null)
    navigate('/');
  }).catch((err) => {
    console.log(err);
  })
}

    return (
              <div className="Sidebar">
                    
                <List>
                  <Link to="/homepage">
                    <ListItem>
                    <Button variant="text">
                      <ListItemIcon>
                        <HomeIcon className="sideBar-Icon"/>
                      </ListItemIcon>
                      <ListItemText
                        primary="Home" className="sideBar-Icon"
                      />
                      </Button>
                    </ListItem>
                    </Link>

                    <ListItem>
                    <Button variant="text"  onClick={()=>{toProfile()}}>
                      <ListItemIcon>
                        <PersonIcon className="sideBar-Icon"/>
                      </ListItemIcon>
                      <ListItemText
                        primary="Profile" className="sideBar-Icon"
                      />
                      </Button>
                    </ListItem>

                    <ListItem>
                    <Button variant="text">
                      <ListItemIcon>
                        <PersonIcon className="sideBar-Icon"/>
                      </ListItemIcon>
                      <ListItemText
                        primary="Users" className="sideBar-Icon"
                      />
                      </Button>
                    </ListItem>

                    <Link to="/">
                      <ListItem>
                          <Button variant="text" onClick={()=>{logout()}}>
                              <ListItemIcon>
                                <LogoutIcon className="sideBar-Icon"/>
                              </ListItemIcon>
                              <ListItemText
                                primary="Logout" className="sideBar-Icon"
                              />
                          </Button>
                      </ListItem>
                    </Link>
                </List>
              </div>
    
  
      )
  }
  
  export default SideBar