import React, { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { useUser } from "../usercontext.jsx";
import { getPosts } from "./postLogic/getPosts.jsx";
import ViewPost from "./postLogic/viewPost/viewPost.jsx";
import { addPost } from "./postLogic/addPost.jsx";
import { likePost } from "./postLogic/likePost.jsx";
import { sendaReply } from "./postLogic/replyPost.jsx";

import { db } from "../../FB-config/Firebase-config.js" 
import { collection, doc, getDocs, setDoc, addDoc, getCountFromServer } from 'firebase/firestore';

import { Alert } from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ForumIcon from '@mui/icons-material/Forum';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import SendIcon from '@mui/icons-material/Send';


import "./mainfeed.css"
import "./replyBox.css"
import pfp from "../../assets/defaultpfp.png"

const MainFeed = () => {
  const { userData, setUser } = useUser();
  const user = userData; //user credentials
  const navigate = useNavigate();

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
    if (newpost.length < 2) {
      alert("Your message is too short")
      return;
    } else {
    await addPost(user, newpost)
    .then(()=>{console.log("Added a new post")});
}};
const [showAlert, setShowAlert] = useState(null);
//Like a post, increment like amount, logic in liekpost.jsx
const likeaPost = async (post) => {
  await likePost(post, user)
}
  ;





const navToPost = (post) => {
  navigate('/viewPost', { state: { post, user } });
}




    return (
      // MAIN FEED CONTAINER
      <div className="mainfeed">

        {/* POST SOMETHING */}
        <div className="userpost">
            <TextField
              id="filled-multiline-static"
              label="Post something ..."
              color='secondary'
              multiline
              maxRows={4}
              placeholder={`What's on your mind ${user.username}`}
              variant="standard"
              onChange={(e) => setNewPost(e.target.value)}
              inputProps={{ style: { color: "white", padding: ".5rem" } }}
              InputLabelProps={{className:"textField_label"}}


            />
            <Button variant="contained" onClick={()=>{addNewPost()}} className="addPost" required>Invade</Button>
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
                              <div className="usertags">
                                <h3 className="usernameTag">@{post.Username}</h3>
                              </div>
                          </div>
                          <p className="post-message" onClick={()=>navToPost(post)}>{post.Message}</p>
                          <div className="post-btns">
                            <Button variant="text" onClick={()=>navToPost(post, user)}>
                              <ForumIcon className="post-btn"/>
                              <p className="postLikes">{post.replies}</p>
                            </Button>
                            <Button variant="text" onClick={()=>likeaPost(post)}>
                                <ThumbUpIcon className="post-btn like-icon"/>
                                <p className="postLikes">{post.likes}</p>
                            </Button>
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