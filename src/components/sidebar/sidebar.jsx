import React from "react"

import './sidebar.css'

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


    return (

          <div className="Sidebar">
                
            <List>
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
                <ListItem>
                <Button variant="text">

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
                    <NotificationsIcon className="sideBar-Icon"/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Notifications" className="sideBar-Icon"
                  />
                  </Button>
                </ListItem>
                <ListItem>
                <Button variant="text">

                  <ListItemIcon>
                    <MailIcon className="sideBar-Icon"/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Messages" className="sideBar-Icon"
                  />
                  </Button>
                </ListItem>
                <ListItem>
                <Button variant="text">

                  <ListItemIcon>
                    <SearchIcon className="sideBar-Icon"/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Search" className="sideBar-Icon"
                  />
                  </Button>
                </ListItem>
                <ListItem>
                <Button variant="text">

                  <ListItemIcon>
                    <LogoutIcon className="sideBar-Icon"/>
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout" className="sideBar-Icon"
                  />
                  </Button>
                </ListItem>
            </List>
          </div>

  
      )
  }
  
  export default SideBar