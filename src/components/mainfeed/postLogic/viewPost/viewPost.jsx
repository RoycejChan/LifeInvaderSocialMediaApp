import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { likePost } from "../likePost.jsx";
import profilePFP from "../../../../assets/defaultpfp.png";
import { sendaReply } from "../replyPost.jsx";

import { db } from "../../../../FB-config/Firebase-config.js";
import { doc, collection, getDoc, query, deleteDoc, getDocs } from "firebase/firestore";

import "./viewPost.css";

import SideBar from "../../../sidebar/sidebar.jsx";
import UsersBar from "../../../usersbar/usersbar.jsx";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ForumIcon from '@mui/icons-material/Forum';
import DeleteIcon from '@mui/icons-material/Delete';


const ViewPost = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state.user;
    const post = location.state.post;
    console.log(post);
    console.log(user);    
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
                console.log("Nice");
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

    const deletePost = async () => {
        // const docRef = doc(db, 'posts', post.id )
        console.log(post)
        await deleteDoc(doc(db, 'posts', post.id )).then(()=>navigate('/homepage'));
    }



    return (
        <div className="homepage">
        <SideBar/>
        <div className="profile-container">
            <div className="originalPost">
                <div className="originalPostUser">
                    <div className="pfp-img-container">
                        <img src={profilePFP} alt="PFP" />
                    </div>
                    <div className="usertags">
                        <h4>  {post.Username}</h4>
                    </div>
                </div>
                <TextField
                    // label={post.Message}
                    value={post.Message}
                    disabled
                    fullWidth
                    maxRows={4}
                    id="filled-multiline-static"
                    multiline
                    variant="standard"
                    InputLabelProps={{ className: "textField_label" } }
                    className="viewPost-original-msg"

                    />
                <div className="viewPost-btns">
                    <div className="left-viewPost">
                    <Button variant="text" onClick={() => likeaPost(post)}>
                        <ThumbUpIcon className="post-btn like-icon" style={isLiked ? { color: "darkred" } : {}} />
                        <p className="postLikes">{post.likes + temporaryLikes}</p>
                    </Button>
                    <ForumIcon className="post-btn viewPost-comment-btn"/>
                    </div>

                    {OP ? <Button variant="text" onClick={() => {(deletePost())}}><DeleteIcon className="post-btn"/></Button> : <></>}
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
                            <div className="pfp-img-container">
                                <img src={profilePFP} alt="PFP" />
                            </div>
                            <div className="mainpost">
                                <div className="upperpost">
                                    <p className="replying-to">Replying to @{post.Username}</p>
                                    <div className="usertags">
                                        <p className="usernameTag" onClick={() => viewProfile(postReply)}>@{postReply.Username}</p>
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