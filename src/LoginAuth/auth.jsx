import React, { useState } from "react";
import { auth, GoogleProvider, db } from "../FB-config/Firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword ,signInWithPopup} from 'firebase/auth'; 
import {doc, setDoc, getDoc, getDocs, query, where, collection} from 'firebase/firestore'

import { Alert } from "@mui/material";
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import Homepage from "../components/homepage"
import { useUser } from "../components/usercontext"; 


export default function Auth() { 
    
        const { userData, setUser } = useUser(); // Use the useUser hook to access userData and setUser

        const [username, setUsername] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [notSignedUp, setUserLog] = useState(false);
        const [loginError, setLoginError] = useState(false);
        const [loginErrorMsg, setLoginErrorMsg] = useState(false);

        const getUsernameFromDatabase = async (uid) => {
            try {
              const userDocRef = doc(db, 'users', uid);
              const userDocSnapshot = await getDoc(userDocRef);
          
              if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                return userData.username; 
              }
            } catch (error) {
              console.error("Error getting username:", error);
            }
          
            return null; 
          };

          const signUp = async () => {
            try {
                // Check if the username already exists in the users database
                const usernameQuery = query(collection(db, 'users'), where('username', '==', username));
                const usernameQuerySnapshot = await getDocs(usernameQuery);
        
                if (usernameQuerySnapshot.size === 0) {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
                    const user = {
                        uid: userCredential.user.uid,
                        username: username,
                    };
                    setUser(user);
        
                    const userDocRef = doc(db, 'users', userCredential.user.uid);
                    await setDoc(userDocRef, {
                        email: userCredential.user.email,
                        username: username,
                    });
        
                    // Clear the form inputs after signup
                    setUsername("");
                    setEmail("");
                    setPassword("");
                } else {
                    // Username already exists
                    setLoginError(true);
                    setLoginErrorMsg("Username is already taken");
                    setTimeout(() => {
                        setLoginError(false);
                        setLoginErrorMsg("");
                    }, 5000);
                }
            } catch (error) {
                const errorCode = error.code;
                if (errorCode === 'auth/email-already-in-use') {
                    // Email is already in use
                    setLoginError(true);
                    setLoginErrorMsg("Email is already in use");
                } else {
                    // Pass to short
                    setLoginError(true);
                    setLoginErrorMsg("You password should be at least 6 characters long");
                }
                setTimeout(() => {
                    setLoginError(false);
                    setLoginErrorMsg("");
                }, 5000);
            }
        };
    

        const signIn = async () => {
                try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
               
                    const username = await getUsernameFromDatabase(userCredential.user.uid);

                     setUser({
                        uid: userCredential.user.uid,
                        email: userCredential.user.email,
                        username: username
                    });
                
            } catch (error) {
                setLoginError(true);
                setLoginErrorMsg("Wrong username or password")
                setTimeout(() => {
                    setLoginError(false);
                    setLoginErrorMsg("")
                }, 5000); // 5000 milliseconds = 5 seconds
            }
        }

        const googleSignIn = async () => {
            try {
            await signInWithPopup(auth, GoogleProvider )
            } catch (err){
                console.error(err);
            }
        }
        
        if (userData) {
            return <Homepage/>
        }

    return ( 
        <>
        
        {notSignedUp ?   
        
            <div className="Login-Container">
                 {loginError ? 
                <Alert variant="filled" severity="error" className="alertBox"
                          >
                    {loginErrorMsg}
                </Alert> : <></>}
                <Paper elevation={3} square={false} className="centered-paper">
                    <h1>Life Invader 📷</h1>
                    <h1 className="signUp-header">Sign Up</h1>
                    
                    <TextField 
                        id="outlined-basic" label="Username" variant="outlined"
                        name="username" type="text" placeholder="username ..." required onChange={(e)=> setUsername(e.target.value)}
                        className="login-input"
                    />
                
                    <TextField 
                        id="outlined-basic" label="Email" variant="outlined"
                        name="email" type="email" placeholder="Email ..." required onChange={(e)=> setEmail(e.target.value)}
                        className="login-input"
                    />
                
                    <TextField 
                        id="outlined-basic" label="Password" variant="outlined"
                        name="password" type="password" placeholder="Password ..." required onChange={(e)=> setPassword(e.target.value)}
                        className="login-input"
                    />
                    
                    <Button 
                        onClick={()=> signUp()} variant="outlined" 
                        className="signUp-btn"
                        >Sign up
                    </Button>
                    
                    <div className="alt-signUp-btns-container">
                        <Button 
                            onClick={()=> googleSignIn()} variant="text"
                            className="alt-signUp-btn"
                        >
                        Google
                        </Button>
                    </div>
                    <p>
                        Already have an account?<button onClick={()=>setUserLog(false)} className="change-login">Log In</button> instead!
                    </p>
                    <p>{loginError}</p>
                </Paper>
            </div>
: 
           
        <div className="Login-Container">

            {loginError ? 
                <Alert variant="filled" severity="error" className="alertBox"
                          style={{position: 'absolute', top:'5%', left:'50', fontSize: "1.3rem" }}>
                    {loginErrorMsg}
                </Alert> : <></>}
                        
        <Paper elevation={3} square={false} width="" className="centered-paper">
            <h1>Life Invader 📷</h1>
            <h1 className="signUp-header">Log In</h1>
            
            <TextField 
                id="outlined-basic" label="Email" variant="outlined"
                name="email" type="email" placeholder="Email ..." required onChange={(e)=> setEmail(e.target.value)}
                className="login-input"
            />

            <TextField 
                id="outlined-basic" label="Password" variant="outlined"
                name="password" type="password" placeholder="Password ..." required onChange={(e)=> setPassword(e.target.value)}
                className="login-input"
            />
            
            <Button 
                onClick={()=> signIn()} variant="outlined" 
                className="signUp-btn"
                >Log In
            </Button>
            
            <div className="alt-signUp-btns-container">
                <Button 
                    onClick={()=> googleSignIn()} variant="text"
                    className="alt-signUp-btn"
                >
                Google
                </Button>
            </div>
            <p>
                Don't have an account?<button onClick={()=>setUserLog(true)} className="change-login">Register</button> Instead!
            </p>
            <p>{loginError}</p>
        </Paper>
        </div>

    
       
}
        </>
    )
}