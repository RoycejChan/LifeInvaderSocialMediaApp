import React from "react"
import { useNavigate, Link } from "react-router-dom";

import { auth } from "../../FB-config/Firebase-config";
import { signOut } from "firebase/auth";
import { useUser } from "../usercontext";

import './sidebar.css'

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';


const SideBar = () => {

  const { userData, setUser } = useUser();
  const user = userData;
  const navigate = useNavigate();
  

//Navigates to profile page component with the user thats clicked on data
const toProfile = () => {navigate('/profile', { state: { user } });}


const toUsers = () => {navigate('/users', { state: { user } });}

//logs out
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
                    <Button variant="text" onClick={()=>toUsers()}>
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