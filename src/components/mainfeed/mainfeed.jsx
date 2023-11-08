import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../usercontext.jsx";
import { getPosts } from "./postLogic/getPosts.jsx";
import { addPost } from "./postLogic/addPost.jsx";
import { likePost } from "./postLogic/likePost.jsx";

import { db } from "../../FB-config/Firebase-config.js";
import { doc, getDoc } from "firebase/firestore";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ForumIcon from "@mui/icons-material/Forum";

import "./mainfeed.css";
import "./replyBox.css";
import pfp from "../../assets/defaultpfp.png";

const MainFeed = () => {
  const { userData, setUser } = useUser();
  const user = userData; //user credentials
  const navigate = useNavigate();

  const [newpost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLiked, setIsLiked] = useState({}); // Individual like state for each post
  const [temporaryLikes, setTemporaryLikes] = useState({}); // Temporary like count changes

  // on page load, fetch posts from db, and display it
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsData = await getPosts();
      // Sort the posts by the "created" timestamp field in ascending order
      const sortedPosts = postsData.sort((a, b) => a.created - b.created);
      // Reverse the order to display most recent on top
      const reversedPosts = sortedPosts.reverse();
      setPosts(reversedPosts);
  
      // Initialize like state for each post to false
      const initialLikeState = {};
      reversedPosts.forEach((post) => {
        initialLikeState[post.id] = false;
      });
      setIsLiked(initialLikeState);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  // Adds new post, logic is in addPost.jsx
  const addNewPost = async () => {
    if (newpost.length < 2) {
      alert("Your message is too short");
      return;
    } else {
      const postToAdd = {
        id: Math.random().toString(36).substring(7), // Generate a random post ID
        Username: user.username,
        Message: newpost,
        replies: 0, 
        likes: 0,
      };
  
      // Clone the current like state to avoid modifying the state directly
      const updatedLikeState = { ...isLiked };
      updatedLikeState[postToAdd.id] = false;
      setIsLiked(updatedLikeState);
  
      // Temporary like count changes (initialize likes to 0)
      setTemporaryLikes((prevLikes) => {
        const updatedLikes = { ...prevLikes };
        updatedLikes[postToAdd.id] = 0;
        return updatedLikes;
      });
  
      await addPost(user, newpost).then(() => {
        setNewPost(""); // Clear the new post input field
        setPosts((prevPosts) => [postToAdd, ...prevPosts]);
      });
    }
  };

  const likeaPost = async (post) => {
    // Clone the current like state to avoid modifying the state directly
    const updatedLikeState = { ...isLiked };
    const likeState = await likePost(post, user);
    updatedLikeState[post.id] = likeState;
    setIsLiked(updatedLikeState);
  
    // Temporary like count changes (increment or decrement)
    setTemporaryLikes((prevLikes) => {
      const updatedLikes = { ...prevLikes };
      if (likeState) {
        updatedLikes[post.id] = (updatedLikes[post.id] || 0) + 1;
      } else {
        if (updatedLikes[post.id] > 0) {
          updatedLikes[post.id] -= 1;
        }
      }
      return updatedLikes;
    });
  };

  const navToPost = (post) => {
    navigate("/viewPost", { state: { post, user } });
  };

  
  const viewProfile = async (postuser) => {
    const docRef = doc(db, "users", postuser.userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        let user = postuser.User;
        navigate('/profile', { state: { user } });
    } else {
        console.log("No such document!");
        alert("There was an error viewing this user's profile.");
    }
};


  return (
    // MAIN FEED CONTAINER
    <div className="mainfeed">


      {/* POST SOMETHING */}
      <div className="userpost">
        <TextField
          id="filled-multiline-static"
          label="Post something ..."
          color="secondary"
          multiline
          maxRows={4}
          placeholder={`What's on your mind ${user.username}`}
          variant="standard"
          onChange={(e) => setNewPost(e.target.value)}
          inputProps={{ style: { color: "white", padding: ".5rem" } , maxLength: 400 } }
          InputLabelProps={{ className: "textField_label" } }
          
        />
        <div className="userpost-footer">
        <Button
          variant="contained"
          onClick={() => addNewPost()}
          className="addPost"
          required
        >
          Invade
        </Button>
        <p>{newpost.length}/400</p>
        </div>
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
                    <h3 className="usernameTag" onClick={() => viewProfile(post)}>@{post.Username}</h3>
                  </div>
                </div>
                <p className="post-message" onClick={() => navToPost(post)}>
                  {post.Message}
                </p>
                <div className="post-btns">
                  <Button variant="text" onClick={() => navToPost(post, user)}>
                    <ForumIcon className="post-btn" />
                    <p className="postLikes">{post.replies}</p>
                  </Button>
                  <Button variant="text" onClick={() => likeaPost(post)}>
                    <ThumbUpIcon
                      className="post-btn like-icon"
                      style={isLiked[post.id] ? { color: "red" } : {}}
                    />
                    <p className="postLikes">
                      {post.likes + (temporaryLikes[post.id] || 0)}
                    </p>
                  </Button>
                </div>
                <hr className="post-separator" />
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainFeed;
