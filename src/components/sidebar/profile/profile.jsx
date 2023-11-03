import React, { useState, useEffect, useContext, createContext} from "react"
import "./profile.css"
import { useUser } from "../../usercontext.jsx";
import { useLocation } from "react-router-dom";
import { db } from "../../../FB-config/Firebase-config.js";
import { collection, doc, getDocs } from "firebase/firestore";

import SideBar from "../sidebar.jsx";
import UsersBar from "../../usersbar/usersbar.jsx";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import profilePFP from "../../../assets/defaultpfp.png"
import Button from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ForumIcon from '@mui/icons-material/Forum';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';

const Profile = () => {
    const location = useLocation();
    const userData = location.state.user; 
    // const { userData, setUser } = useUser();
    // const user = userData; // for viewing local own profile ??
    console.log(userData)

    const [posts, setPosts] = useState([]);


    useEffect(() => {
      // Fetch posts when the component mounts
      const fetchData = async () => {
        const postsData = await fetchPosts();
        setPosts(postsData);
      };
  
      fetchData();
    }, []);
  
    
    const fetchPosts = async () => {
      try {

        const userDocRef = doc(db, 'users', userData.uid);
        // Step 2: Get a reference to the user's 'posts' subcollection
        const userPostsCollectionRef = collection(userDocRef, 'posts');
        const querySnapshot = await getDocs(userPostsCollectionRef); 
        const postsData = []; 
        querySnapshot.forEach((doc) => {
  
          // For each document, get the data and add it to the postsData array
          const post = {
            id: doc.id, // Document ID
            ...doc.data(), // Post data
          };
  
          postsData.push(post);
          console.log(post);
        });
    
        return postsData;
      } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
      }
    };



    return (
        <div className="homepage">
        <SideBar/>

        
            <div className="profile-container">
                    <div className="profile-header">
                        <Button variant="text" className="back-to-home-page"><KeyboardBackspaceRoundedIcon className="back-to-home-page"/></Button>
                        <div className="profile-header-details">
                            <h3 className="profile-header-username">{userData.username}</h3>
                            <p className="profile-postAmount">23 Posts</p>
                        </div>
                        <Button variant="outlined" sx={{ color: '#176daf' }} className="editProfile">Edit Profile</Button>
                    </div>

                    <div className="profile-details">
                        <div className="profile-user-tags">
                            <h2 className="profile-name">{userData.username}</h2>
                            <h4 className="profile-username">@{userData.username}</h4>
                            <p className="profile-bio">
                                    Hi I like to play sports and workout.
                                    My IG is @BabyChan
                            </p>
                        </div>

                        <div className="profile-pfp">
                            <img src={profilePFP} alt="pfp" />
                        </div>
                    </div>


{/* STILL WORKING BELOW JUST PASTED */}
                    <div className="postfeed">
              <ul>
              {posts.map((post) => (
                      <div key={post.id} className="apost">
                        <div className="pfp-img-container">
                          <img src={profilePFP} alt="PFP" />
                        </div>
                        <div className="mainpost">
                          <div className="upperpost">
                            <p className="replying-to">Replying to @Elon</p>
                              <div className="usertags">
                                <p>{post.Username}</p>
                                <p className="usernameTag">@{post.Username}</p>
                              </div>
                          </div>
                          <p className="post-message">{post.Message}</p>
                          <div className="post-btns">
                            <Button variant="text"><ForumIcon className="post-btn"/></Button>
                            <Button variant="text"><ThumbUpIcon className="post-btn"/></Button>
                            <Button variant="text"><RepeatOneIcon className="post-btn"/></Button>
                          </div>
                          <hr className="post-separator" /> {/* Add a horizontal line at the bottom of each post */}
                        </div>
                      </div>
                ))}
              </ul>
            </div>

            </div>


        <UsersBar/>
        </div>
    )
}

export default Profile