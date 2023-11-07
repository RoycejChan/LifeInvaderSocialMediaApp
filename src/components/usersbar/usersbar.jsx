import React, { useState, useEffect } from "react"
import { db } from "../../FB-config/Firebase-config.js" 
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';

import { useNavigate } from "react-router-dom";


import Button from '@mui/material/Button';

import "./usersbar.css"

const UsersBar = () => {
  const navigate = useNavigate();
  const [randomUsers, setRandomUsers] = useState([]); 

  const getRandomUsers = async (db, collectionName, numUsers) => {
    try {
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);
  
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
    //  Fisher-Yates shuffle
      for (let i = users.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [users[i], users[j]] = [users[j], users[i]];
      }
  
      // Get the first 'numUsers' randomized users
      const randomUsers = users.slice(0, numUsers);
      setRandomUsers(randomUsers);
    } catch (error) {
      console.error('Error getting random users:', error);
      return [];
    }
  };
  
  useEffect(() => {
    // Use useEffect to fetch random users when the component mounts for suggested useres bar
    getRandomUsers(db, "users", 5);
  }, []);


  //when user clicks a profile, change homescreen to that persons profile page
  const viewProfile = async (user) => {
    const docRef = doc(db, "users", user.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      navigate('/profile', { state: { user }, });
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      alert("There was an error viewing this user's profile.")
    }
  }


    return (
      <>

        <div className="usersbar">
          <h1 className="usersbar-header">
            Stalk these users
          </h1>
          <div className="post-separator"></div>
              <ul className="suggestedUsers">
              {randomUsers.map((user) => (
                <div key={user.uid}>
                  <div className="randUser" >
                    <div className="randUser-info">
                      <p>{user.username}</p>
                      <p className="randUser-username" onClick={()=>viewProfile(user)}>@{user.username}</p>
                    </div>
                    <Button variant="text" className="stalk-Randuser" onClick={()=>viewProfile(user)}>Stalk</Button>
                  </div>
                  <div className="post-separator"></div>
                </div>
              ))}
              </ul>

        </div>

  
      </>
      )
  }
  
  export default UsersBar