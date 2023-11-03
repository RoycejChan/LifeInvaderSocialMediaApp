import React, { useState, useEffect, useContext } from "react"
import { useUser } from "../usercontext.jsx";

import { db } from "../../FB-config/Firebase-config.js" 
import { collection, doc, getDocs, setDoc, addDoc } from 'firebase/firestore';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ForumIcon from '@mui/icons-material/Forum';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';


import "./mainfeed.css"
import pfp from "../../assets/defaultpfp.png"

const MainFeed = () => {
  const { userData, setUser } = useUser();
  const user = userData;
  console.log(user);

  const [newpost, setNewPost] = useState("");


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
      const postsCollectionRef = collection(db, 'posts'); 
      const querySnapshot = await getDocs(postsCollectionRef); 
      const postsData = []; 
      
      querySnapshot.forEach((doc) => {

        // For each document, get the data and add it to the postsData array
        const post = {
          id: doc.id, // Document ID
          ...doc.data(), // Post data
        };

        postsData.push(post);
      });
  
      return postsData;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };


 const addPost = async () => {
  const currentDate = new Date();

  // Add the post to the general 'posts' collection
  const generalPostRef = doc(collection(db, 'posts')); // Automatically generate a unique ID for the general posts collection

  await setDoc(generalPostRef, {
    Username: user.username,
    Message: newpost,
    Date: currentDate,
  });
  // Step 1: Get a reference to the user's document
  const userDocRef = doc(db, 'users', user.uid);
  
  // Step 2: Get a reference to the user's 'posts' subcollection
  const userPostsCollectionRef = collection(userDocRef, 'posts');
  
  await addDoc(userPostsCollectionRef, {
    Username: user.username,
    Message: newpost,
    Date: currentDate,
  });

  console.log(newpost);
};

    return (
    
      // MAIN FEED CONTAINER
      <div className="mainfeed">

        {/* POST SOMETHING */}
        <div className="userpost">
            <TextField
              id="filled-multiline-static"
              label="Post something ..."
              multiline
              rows={4}
              placeholder={`What's on your mind ${user.username}`}
              variant="standard"
              onChange={(e) => setNewPost(e.target.value)}
              inputProps={{ style: { color: "white" } }}
              InputLabelProps={{className:"textField_label"}}

            />
            <Button variant="outlined" onClick={()=>{addPost()}} className="addPost">Invade</Button>
        </div>

        {/* POST FEED */}
            <div className="postfeed">
              <ul>
              {posts.map((post) => (
                      <div key={post.id} className="apost">
                        <div className="pfp-img-container">
                          <img src={pfp} alt="PFP" />
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
      )
  }
  
  export default MainFeed