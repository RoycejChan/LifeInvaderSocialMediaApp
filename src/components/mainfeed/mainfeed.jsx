import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../usercontext.jsx";
import { getPosts } from "./postLogic/getPosts.jsx";
import { addPost } from "./postLogic/addPost.jsx";
import { likePost } from "./postLogic/likePost.jsx";

import { db } from "../../FB-config/Firebase-config.js";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../../FB-config/Firebase-config.js";
import { signOut } from "firebase/auth";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ForumIcon from "@mui/icons-material/Forum";
import { Alert } from "@mui/material";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ShuffleIcon from '@mui/icons-material/Shuffle';

import "./mainfeed.css";
import "./replyBox.css";
import pfp from "../../assets/defaultpfp.png";
import { Padding } from "@mui/icons-material";

const MainFeed = () => {
  const { userData, setUser } = useUser();
  const user = userData; //user credentials
  const navigate = useNavigate();

  const [newpost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLiked, setIsLiked] = useState({}); // Individual like state for each post
  const [temporaryLikes, setTemporaryLikes] = useState({}); // Temporary like count changes


  const [logMsg, setLogMsg] = useState('');
  const [displayLog, setLog] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  // on page load, fetch posts from db, and display it
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    // Check the length of newpost to enable/disable the input
    if (newpost.length > 3) {
        setIsDisabled(false);
    } else {
        setIsDisabled(true);
    }
}, [newpost]);


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

        setLog(true);
        setLogMsg("Post made invadable");
        setTimeout(() => {
            setLog(false);
            setLogMsg("");
        }, 3000);

      });
    }
  };

  const likeaPost = async (post) => {
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
        let user = postuser.User;
        navigate('/profile', { state: { user } });
  }

  const toProfile = () => {
    navigate('/profile', { state: { user } });
  
  }

  const toUsers = () => {
    navigate('/users', { state: { user } });
  
  }
const logout = () => {
  signOut(auth).then(()=> {
    setUser(null)
    navigate('/');
  }).catch((err) => {
    console.log(err);
  })
}

// const calculateTimeAgo = (timestamp) => {
//   const now = new Date();
//   const postDate = timestamp.toDate(); // Convert Firestore timestamp to Date object

//   const secondsAgo = Math.floor((now - postDate) / 1000);

//   if (secondsAgo < 60) {
//     return `${secondsAgo} seconds ago`;
//   } else if (secondsAgo < 3600) {
//     const minutesAgo = Math.floor(secondsAgo / 60);
//     return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
//   } else if (secondsAgo < 86400) {
//     const hoursAgo = Math.floor(secondsAgo / 3600);
//     return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
//   } else {
//     const daysAgo = Math.floor(secondsAgo / 86400);
//     return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
//   }
// };
const [value, setValue] = useState('recents');
const handleChange = (event, newValue) => {
  setValue(newValue);
};
  return (
    // MAIN FEED CONTAINER
    <div className="mainfeed">

        {displayLog ? 
                <Alert variant="filled" severity="success" className="alertBox"
                          >
                    {logMsg}
        </Alert> : <></>}
      {/* POST SOMETHING */}
      <div className="userpost">
        <TextField
          id="filled-multiline-static"
          label="Post something ..."
          color="secondary"
          value={newpost}
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
          className={isDisabled ? "addPost disabledPostButton" : "addPost"}          required
          disabled={isDisabled}

        >
          Invade
        </Button>
        <p >{newpost.length}/400</p>
        </div>
      </div>


      {/* POST FEED */}
      <div className="postfeed">
        <ul>
          {posts.map((post) => (
            <div key={post.id} className="apost">
          
              <div className="mainpost">
       
                <div className="upperpost">
                <div className="pfp-img-container">
                <img src={pfp} alt="PFP" />
              </div>
                  <div className="usertags">
                    <h3 className="usernameTag" onClick={() => viewProfile(post)}>@{post.Username}</h3>
                    {/* <p>{calculateTimeAgo(post.Date)}</p> */}
                  </div>
                </div>
                <div className="post-msg">
                  <p className="post-message" onClick={() => navToPost(post)}>
                    {post.Message}
                  </p>
                </div>
                <div className="post-btns">
                  <Button variant="text" onClick={() => navToPost(post, user)}>
                    <ForumIcon className="post-btn" />
                    <p className="postLikes">{post.replies}</p>
                  </Button>
                  <Button variant="text" onClick={() => likeaPost(post)}>
                    <ThumbUpIcon
                      className="post-btn like-icon"
                      style={isLiked[post.id] ? { color: "darkred" } : {}}
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
      {/* sx={{ width: 500 }} */}
      <BottomNavigation  value={value} onChange={handleChange} className="bottom-nav">
      <Link to="/homepage">
      <BottomNavigationAction
        label="Home"
        value="Home"
        icon={<HomeIcon fontSize='large'/>}
      />
      </Link>
      <BottomNavigationAction
        onClick={()=>{toProfile()}}
        label="Profile"
        value="Profile"
        icon={<PersonIcon fontSize='large'/>}
      />
      <BottomNavigationAction
        onClick={()=>{toUsers()}}
        label="Users"
        value="Users"
        icon={<PersonIcon fontSize='large'/>}
      />
    <BottomNavigationAction
        onClick={()=>{logout()}}
        label="Logout"
        value="Logout"
        icon={<LogoutIcon fontSize='large'/>}
      />
      
    </BottomNavigation>
    </div>
  );
};

export default MainFeed;
