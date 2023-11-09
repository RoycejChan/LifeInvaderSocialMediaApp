import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { likePost } from "../likePost.jsx";
import profilePFP from "../../../../assets/defaultpfp.png";
import { sendaReply } from "../replyPost.jsx";

import { db } from "../../../../FB-config/Firebase-config.js";
import { doc, collection, getDoc, query, deleteDoc, getDocs } from "firebase/firestore";

import "./viewPost.css";

import { Alert } from "@mui/material";
import SideBar from "../../../sidebar/sidebar.jsx";
import UsersBar from "../../../usersbar/usersbar.jsx";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ForumIcon from '@mui/icons-material/Forum';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ViewPost = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;
    const post = location.state.post;
    const [OP, setOP] = useState(false);

    const [currentPost, setPost] = useState({});
    const [postReplies, setPostReplies] = useState([]);
    const [userReply, setUserReply] = useState("");
    const [currentFormattedDate, setCurrentDate] = useState("");
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    const [isLiked, setIsLiked] = useState(false); // For the main post
    const [temporaryLikes, setTemporaryLikes] = useState(0); // Temporary like count changes for the main post


    const [logMsg, setLogMsg] = useState('');
    const [displayLog, setLog] = useState(false);


    const addNewReply = async () => {
        try {
            
            const replyData = {
                User: user,
                Username: user.username,
                Message: userReply,
                Date: currentFormattedDate,
            };

            // Clear the userReply state
            setUserReply("");

            // Add the reply to the db
            await sendaReply(post, user, userReply, currentFormattedDate)
            .then(()=>{  
                setUserReply("")
        });

            // Update the UI by adding the new reply to the postReplies state
            setPostReplies((prevReplies) => [...prevReplies, replyData]);


        } catch (error) {
            console.error("Error adding a reply:", error);
        }
    };

    useEffect(() => {
        fetchReplies();
        setCurrentDate(`${month}/${day} ${hours}:${minutes}`);
        if (user.uid == post.userId) {
            setOP(true);
        }
    }, []);

    const fetchReplies = async () => {
        try {
          //reference the persons posts
          const postDocRef = doc(db, 'posts', post.id);
          const repliesCollectionRef = collection(postDocRef, 'replies');
  
          const querySnapshotreplies = await getDocs(repliesCollectionRef); 
          const repliesData = [];
          querySnapshotreplies.forEach((doc) => {
            const reply = {
              id: doc.id, 
              ...doc.data(), 
            };
            repliesData.push(reply);
                  });
          setPostReplies(repliesData);
          return repliesData;
        } catch (error) {
          console.error("Error fetching replies:", error);
          return [];
        }
      };

      const likeaPost = async (post) => {
        const likeState = await likePost(post, user);
    
        if (likeState) {
            // If the post is liked, increase the like count and set isLiked to true to make icon red
            setTemporaryLikes((prevLikes) => prevLikes + 1);
            setIsLiked(true);
        } else {
            // If the post is unliked, decrease the like count and set isLiked to false to make icon go back to original color
            setTemporaryLikes((prevLikes) => prevLikes - 1);
            setIsLiked(false);
        }
    };

    const viewProfile = async (replyUser) => {
        const docRef = doc(db, "users", replyUser.User.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let user = replyUser.User;
            navigate('/profile', { state: { user } });
        } else {
            console.log("No such document!");
            alert("There was an error viewing this user's profile.");
        }
    };

//DELETE POST, displays confirmation popup
    const [open, setOpen] = useState(false);
    const confirmDeletePost = () => {
        // const docRef = doc(db, 'posts', post.id )
        setOpen(true);
    }
    const deletePost = async () => {
        try {
            await deleteDoc(doc(db, 'posts', post.id));
            setOpen(false);
            setLogMsg("Post successfully deleted");
            setLog(true);
            setTimeout(() => {
                setLog(false);
                setLogMsg("");
                navigate('/homepage');
            }, 1000);
        } catch (error) {
            console.error("Error deleting post:", error);
            setLogMsg("Error deleting post");
            setLog(true);
        }
    }
    

    const handleClose = () => {
        setOpen(false);
    }



    return (
        <div className="homepage">
        <SideBar/>
        
        <div className="profile-container">
            {displayLog ? 
                    <Alert variant="filled" severity="error" className="alertBox"
                            style={{position: 'absolute', top:'0%', left:'40%', fontSize: "1.3rem", zIndex:'999' }}>
                        {logMsg}
            </Alert> : <></>}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Confirm you want to delete this post"}
                </DialogTitle>
        
                <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={deletePost} autoFocus>
                    Delete
                </Button>
                </DialogActions>
            </Dialog>

            <div className="originalPost">
                <div className="originalPostUser">
                    <div className="pfp-img-container-post">
                        <img src={profilePFP} alt="PFP" />
                    </div>
                    <div>
                        <h3>  {post.Username}</h3>
                    </div>
                </div>
                <TextField
                    // label={post.Message}
                    spellCheck="false"
                    value={post.Message}
                    fullWidth
                    id="filled-multiline-static"
                    multiline
                    variant="filled"
                    color="none"
                    InputLabelProps={{ className: "textField_label" } }
                    className="viewPost-original-msg"
                    inputProps={{ style: { color: "white", padding: "0rem .5rem .5rem .5rem", fontSize: "1.5rem", backgroundColor:'none' } , maxLength: 400,  } }
                    focused 
                    />
                <div className="viewPost-btns">
                    <div className="left-viewPost">
                    <Button variant="text" onClick={() => likeaPost(post)}>
                        <ThumbUpIcon className="post-btn like-icon" style={isLiked ? { color: "darkred" } : {}} />
                        <p className="postLikes">{post.likes + temporaryLikes}</p>
                    </Button>
                    <ForumIcon className="post-btn viewPost-comment-btn"/>
                    </div>

                    {OP ? <Button variant="text" onClick={() => {(confirmDeletePost())}}><DeleteIcon className="post-btn"/></Button> : <></>}
                </div>
            </div>

            <div className="userreply">
                <TextField
                    id="filled-multiline-static"
                    label="Write Comment ..."
                    multiline
                    maxRows={2}
                    value={userReply}
                    placeholder={`What do you have to say about this post ${user.username}`}
                    variant="standard"
                    onChange={(e) => setUserReply(e.target.value)}
                    inputProps={{ style: { color: "white", padding: ".5rem" } , maxLength: 400 } }
                    InputLabelProps={{className: "textField_label"}}
                    fullWidth
                />
                <div className="userreply-footer">
                <p>{userReply.length}/400</p>
                <button variant="contained" onClick={() => { addNewReply() }} className="addComment">ADD COMMENT</button>
                </div>
            </div>

            <ul>
                    {postReplies.map((postReply) => (
            <div key={postReply.id} className="apost">
                            
                            <div className="mainpost">
                                <div className="upperpost">
                                <div className="pfp-img-container">
                                <img src={profilePFP} alt="PFP" />
                            </div>
                                    <div className="usertagspost">
                                    <p className="usernameTag" onClick={() => viewProfile(postReply)}>@{postReply.Username}</p>
                                    <p className="replying-to">Replying to @{post.Username}</p>
                                    </div>
                                </div>
                                <p className="post-message">{postReply.Message}</p>
                                <hr className="post-separator" />
                            </div>
                        </div>
                    ))}
                </ul>
            </div>

            <UsersBar/>
        </div>
    );
}

export default ViewPost;