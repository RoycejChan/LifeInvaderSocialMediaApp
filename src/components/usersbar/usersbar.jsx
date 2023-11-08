import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

import { db } from "../../FB-config/Firebase-config.js" 
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';

import Button from '@mui/material/Button';

import "./usersbar.css"

const UsersBar = () => {
  const navigate = useNavigate();
  const [randomUsers, setRandomUsers] = useState([]); 


  //5 RANDOM USERS TO DISPLAY IN 'suggested users to follow side bar'
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
  
      const randomUsers = users.slice(0, numUsers);
      setRandomUsers(randomUsers);
    } catch (error) {
      console.error('Error getting random users:', error);
      return [];
    }
  };
  
  useEffect(() => {
    getRandomUsers(db, "users", 5);
  }, []);


  const viewProfile = async (viewUser) => {
    const docRef = doc(db, "users", viewUser.id);
    const docSnap = await getDoc(docRef);
    const user = {
      email: viewUser.email,
      uid: viewUser.id,
      username: viewUser.username
    }
    if (docSnap.exists()) {
      navigate('/profile', { state: { user }, });
    } else {
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
                <>
                  <div className="randUser" key={user.uid}>
                    <div className="randUser-info">
                      <p>{user.username}</p>
                      <p className="randUser-username" onClick={()=>viewProfile(user)}>@{user.username}</p>
                    </div>
                    <Button variant="text" className="stalk-Randuser" onClick={()=>viewProfile(user)}>Stalk</Button>
                  </div>
                  <div className="post-separator"></div>
                </>
              ))}
              </ul>

        </div>

  
      </>
      )
  }
  
  export default UsersBar