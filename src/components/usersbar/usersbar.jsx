import React, { useState, useEffect } from "react"
import { db } from "../../FB-config/Firebase-config.js" 
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';


import Button from '@mui/material/Button';

import "./usersbar.css"

const UsersBar = () => {
  const [randomUsers, setRandomUsers] = useState([]); 

  const getRandomUsers = async (db, collectionName, numUsers) => {
    try {
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);
  
      // Convert the querySnapshot to an array of user documents
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
    // Use useEffect to fetch random users when the component mounts
    getRandomUsers(db, "users", 5);
  }, []);

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
                  <div className="randUser">
                    <div className="randUser-info">
                      <p>{user.username}</p>
                      <p className="randUser-username">@{user.username}</p>
                    </div>
                    <Button variant="text" className="stalk-Randuser">Stalk</Button>
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