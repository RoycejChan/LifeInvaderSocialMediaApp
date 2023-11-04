import React, { useState, useEffect, useContext } from "react"
import { useUser } from "../usercontext.jsx";
import { getPosts } from "./postLogic/getPosts.jsx";
import { addPost } from "./postLogic/addPost.jsx";
import { likePost } from "./postLogic/likePost.jsx";
import { sendaReply } from "./postLogic/replyPost.jsx";

import { db } from "../../FB-config/Firebase-config.js" 
import { collection, doc, getDocs, setDoc, addDoc, getCountFromServer } from 'firebase/firestore';

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
  const currentDate = new Date(); //for future references
  const [formattedDate, setformattedDate] = useState(0)

  const [newpost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  
  const [replyMsg, setReplyMsg] = useState("");
  const [replying, isReplying] = useState(false);
  const [userReplyingTo, setUserReplyingTo] = useState("");
  const [postReplyingTo, setPostReplyingTo] = useState({});

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
    await addPost(user, newpost)
    .then(()=>{console.log("Added a new post")});
};
//Like a post, increment like amount, logic in liekpost.jsx
const likeaPost = async (post) => {
  await likePost(post, user)
  .then(console.log("you like a post"));
};
//OPEN MESSAGE REPLY POPUP
const replyToaMsg = async (post) => {
  
  if(!replying) {
    console.log(post.Username)
    setPostReplyingTo(post);
    setUserReplyingTo(post.Username);
    const month = currentDate.getMonth() + 1; // Months are zero based? like array
      const day = currentDate.getDate();
      const year = currentDate.getFullYear();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();

  // Create a formatted date string in the "month/day/year. hours/minutes" format
      setformattedDate(`${month}/${day}/${year} ${hours}:${minutes}`); 
      
    isReplying(true);
   
  } else {
    isReplying(false);
    setReplyMsg("");
  }
}
//SEND MSG TO DB, adds msg to post -> replies subcollection & user who sent it -> replies subcollection
const sendReply = async () => {
  console.log(postReplyingTo); // .id = post id of posts collection not users collection  FIXME: also add like collection to user, not the general posts collection

  await sendaReply(postReplyingTo, user, formattedDate, replyMsg)
  .then(console.log("you replied to a message"));


}





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
                            <Button variant="text" onClick={()=>replyToaMsg(post, user.username)}>
                              <ForumIcon className="post-btn"/>
                            </Button>
                            <Button variant="text" onClick={()=>likeaPost(post)}>
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
              {replying ?
              <>
                <div className="reply-container">
                  <div className="reply-header">
                    <h4>Replying to {userReplyingTo}</h4>
                    <Button onClick={()=>replyToaMsg()}>X</Button>
                  </div>
                  <TextField
                    id="outlined-multiline-static"
                    placeholder="What do you have to say about this post?"
                    label="Reply Message"
                    multiline
                    rows={4}
                    required
                    fullWidth
                    onChange={(e)=> setReplyMsg(e.target.value)}
                 />
                 <div className="reply-footer">
                    <h4>{formattedDate}</h4>
                    <div className="reply-btn">
                      <Button onClick={()=>sendReply()}>Reply<SendIcon/></Button>
                    </div>
                 </div>
                </div>
              </>
              :
              <></>
              } 
            </div>



      </div>
      )
  }
  
  export default MainFeed