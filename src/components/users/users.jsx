import React, { useState, useEffect, useContext, createContext} from "react"
import "./users.css"
import { useLocation } from "react-router-dom";
import { db } from "../../FB-config/Firebase-config.js";
import { collection, doc, getCountFromServer, getDocs, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../usercontext.jsx";
import { auth } from "../../FB-config/Firebase-config.js";
import { signOut } from "firebase/auth";

import SideBar from "../sidebar/sidebar.jsx";
import UsersBar from "../usersbar/usersbar.jsx";
import pfp from "../../assets/defaultpfp.png"
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
        const userDocRef = collection(db, 'users');
        const userSnapshot = await getDocs(userDocRef);
        const usersList = []; 
        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          const auser = {
            uid: doc.id, // Include the document ID
            username: userData.username,
            profilePic: userData.profileImage
          };
          usersList.push(auser);
        });


        setUsers(usersList);
      
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }

    };

const [value, setValue] = useState('recents');
const handleChange = (event, newValue) => {
  setValue(newValue);
};
const toProfile = () => {navigate('/profile', { state: { user } });

}
const logout = () => {
signOut(auth).then(()=> {
  setUser(null)
  navigate('/');
}).catch((err) => {
  console.log(err);
})
}
const viewProfile = async (user1) => {
  const docRef = doc(db, "users", user1.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
      let user = user1;
      navigate('/profile', { state: { user } });
  } else {
      alert("There was an error viewing this user's profile.");
  }
};

    return (
        <div className="homepage">
        <SideBar/>
        {/* <div className="profile-container"></div> copy css for this  */}
            <div className="users-container">
              <div className="users-width">
              {users.map((user)=> (

                <div className="oneUser" key={user.uid}>
                   <div className="pfp-img-container">
                      <img src={user.profilePic ? user.profilePic : pfp} alt="PFP" />
                   </div>
                  <p>{user.username}</p>
                  <Button variant="contained" onClick={() => viewProfile(user)}>Stalk</Button>
                </div>


              ))}
                  </div>
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