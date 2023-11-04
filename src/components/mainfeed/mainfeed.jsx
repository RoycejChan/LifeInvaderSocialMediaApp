import React, { useState, useEffect, useContext } from "react"
import { useUser } from "../usercontext.jsx";
import { getPosts } from "./postLogic/getPosts.jsx";
import { addPost } from "./postLogic/addPost.jsx";
import { likePost } from "./postLogic/likePost.jsx";


import { db } from "../../FB-config/Firebase-config.js" 
import { collection, doc, getDocs, setDoc, addDoc, getCountFromServer } from 'firebase/firestore';

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

  const [newpost, setNewPost] = useState("");


  const [posts, setPosts] = useState([]);


//on page load, fetch posts from db, and display it,
// logic fetchPosts function in getPosts.jsx
  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await getPosts();
      setPosts(postsData);
    };

    fetchPosts();
  }, []);


//Adds new post, logic is in addPost.jsx
  const addNewPost = async () => {
    await addPost(user, newpost);
};

//Like a post, increment like amount, logic in liekpost.jsx
const likeaPost = async (postId) => {
  await likePost(postId, user.username);
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
            <Button variant="outlined" onClick={()=>{addNewPost()}} className="addPost">Invade</Button>
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
                            <Button variant="text" onClick={()=>likeaPost(post.id)}>
                                <ThumbUpIcon className="post-btn like-icon"/>
                                <p className="postLikes">{post.likeCount}</p>
                            </Button>
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