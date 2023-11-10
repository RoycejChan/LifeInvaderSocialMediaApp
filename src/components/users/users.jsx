import React, { useState, useEffect, useContext, createContext} from "react"
import { useLocation } from "react-router-dom";
import { db } from "../../FB-config/Firebase-config.js";
import { collection, doc, getCountFromServer, getDocs } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../usercontext.jsx";
import Auth from "../../LoginAuth/auth.jsx";
import { signOut } from "firebase/auth";

import SideBar from "../sidebar/sidebar.jsx";
import UsersBar from "../usersbar/usersbar.jsx";
// import profilePFP from "../../../../assets/defaultpfp.png"
import Button from '@mui/material/Button';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ShuffleIcon from '@mui/icons-material/Shuffle';
const Users = () => {
  const { userData, setUser } = useUser();
    const location = useLocation();
    const user = location.state.user; 
    const navigate = useNavigate();


    const [users, setUsers] = useState([])

    useEffect(() => {
      fetchUsers();
    }, []);
  
  
    const fetchUsers = async () => {
      try {

        //reference the persons posts
        const userDocRef = doc(db, 'users');
        const userSnapshot = await getDocs(userDocRef);
        const usersList = []; 
        userSnapshot.forEach((user) => {
          const auser = {
            username: user.username
          };
          usersList.push(auser);
          console.log(auser)
                });


        setUsers(usersList);
      
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }

    };


    



    const goBack = () => {
      navigate('/homepage')
    }

    //Navs to post thats clicked
    const navToPost = (post) => {
      navigate("/viewPost", { state: { post, user } });
    };

const [value, setValue] = useState('recents');
const handleChange = (event, newValue) => {
  setValue(newValue);
};
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
        <div className="homepage">
        <SideBar/>
            <div className="profile-container">
             Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut nihil ex soluta voluptate itaque aspernatur quis inventore voluptates quidem sint nam maiores placeat facere, exercitationem ipsum laboriosam sunt minima incidunt?
              HELLo
            </div>


        <UsersBar/>
        <div className="bottom-profile-nav">
        <BottomNavigation  value={value} onChange={handleChange} className="bottom-nav-profile">
      <Link to="/homepage">
      <BottomNavigationAction
        label="Home"
        value="Home"
        icon={<HomeIcon fontSize='large'/>}
      />
      </Link>
      <BottomNavigationAction
        onClick={()=>{toProfile()}}
        label="Profile"
        value="Profile"
        icon={<PersonIcon fontSize='large'/>}
      />
      <BottomNavigationAction
        label="Users"
        value="Users"
        icon={<PersonIcon fontSize='large'/>}
      />
    <BottomNavigationAction
        onClick={()=>{logout()}}
        label="Logout"
        value="Logout"
        icon={<LogoutIcon fontSize='large'/>}
      />
      
    </BottomNavigation>
    </div>
        </div>
    )
}

export default Users