import React, { useState, useEffect, useContext, createContext} from "react"
import { useUser } from "../../../usercontext.jsx";
import { useLocation } from "react-router-dom";
import { likePost } from "../likePost.jsx";
import  profilePFP from "../../../../assets/defaultpfp.png";
import { sendaReply } from "../replyPost.jsx";
import { useNavigate } from "react-router-dom";

import { db } from "../../../../FB-config/Firebase-config.js";
import { setDoc, addDoc, doc, deleteDoc, collection, getDocs, getDoc } from "firebase/firestore";

import "./viewPost.css"



import SideBar from "../../../sidebar/sidebar.jsx";
import UsersBar from "../../../usersbar/usersbar.jsx";

import TextField from '@mui/material/TextField';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import Button from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ForumIcon from '@mui/icons-material/Forum';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';

const ViewPost = () => {

    const navigate = useNavigate();

    


    const location = useLocation();
    const user = location.state.user; 
    const post = location.state.post; 
    console.log(user)
    const [currentPost, setPost] = useState({});
    const [postReplies, setPostReplies] = useState([]);

   const [userReply, setUserReply] = useState("");
// //OPEN MESSAGE REPLY POPUP
// const replyToaMsg = async (post) => {
//     const [replyMsg, setReplyMsg] = useState("");
//   const [replying, isReplying] = useState(false);
//   const [userReplyingTo, setUserReplyingTo] = useState("");
//   const [postReplyingTo, setPostReplyingTo] = useState({});
//     if(!replying) {
//       console.log(post.Username)
//       setPostReplyingTo(post);
//       setUserReplyingTo(post.Username);
//       const month = currentDate.getMonth() + 1; // Months are zero based? like array
//         const day = currentDate.getDate();
//         const year = currentDate.getFullYear();
//         const hours = currentDate.getHours();
//         const minutes = currentDate.getMinutes();
//     }
//     // Create a formatted date string in the "month/day/year. hours/minutes" format
//         setformattedDate(`${month}/${day}/${year} ${hours}:${minutes}`); 
        
     
// //     } else {
//       isReplying(false);
//       setReplyMsg("");
//     }
//   }
//   //SEND MSG TO DB, adds msg to post -> replies subcollection & user who sent it -> replies subcollection
  const addNewReply = async () => {
  
    await sendaReply(post, user, userReply)
    .then(()=> {
      console.log("You replied to a message");
      setReplyMsg("");
    });
  }

useEffect(() => {
    // const fetchPosts = async () => {


    // //   const postsData = await getPosts();
    // //   setPosts(postsData);
    // };

    fetchPosts();
  }, []);


const fetchPosts = async () => {
    try {

      //reference the persons posts
      const postDocRef = doc(db, 'posts', post.id);
      setPost(postDocRef);
      const postDataCollectionRef = collection(postDocRef, 'replies');
      const querySnapshot = await getDocs(postDataCollectionRef); 
      const postReplies = []; 
      
      querySnapshot.forEach((doc) => {

        const post = {
          id: doc.id, 
          ...doc.data(), 
        };

        postReplies.push(post);
              });
    
      setPostReplies(postReplies)

      return postReplies;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  const likeaPost = async (post) => {
    await likePost(post, user)
};

const viewProfile = async (user) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      navigate('/profile', { state: { user } });
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      alert("There was an error viewing this user's profile.")
    }
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
                            <h4 onClick={()=> {console.log(post)}}>{post.Username}</h4>
                        </div>
                </div>
                        <TextField    
                            label={post.Message}
                            disabled
                            fullWidth
                            maxRows={4}
                            inputProps={{ style: { color: "white"} }}

                            >
                            
                            </TextField>
                            <div className="viewPost-btns">
                                <Button variant="text" onClick={()=>likeaPost(post)}>
                                    <ThumbUpIcon className="post-btn like-icon"/>
                                    <p className="postLikes">{post.likes}</p>
                                </Button>
                                <ForumIcon className="post-btn"/>
                            </div>
                </div>


             {/* POST REPLY */}
        <div className="userreply">
            <TextField
              id="filled-multiline-static"
              label="Write Comment ..."
              multiline
              maxRows={2}
              placeholder={`What do you have to say about this post ${user.username}`}
              variant="standard"
              onChange={(e) => setUserReply(e.target.value)}
              inputProps={{ style: { color: "white", padding: ".5rem" } }}
              InputLabelProps={{className:"textField_label"}}
              fullWidth

            />
            <button variant="contained" onClick={()=>{addNewReply()}} className="addComment">Add Comment</button>
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
                                <p className="usernameTag" onClick={()=>viewProfile(user)}>@{postReply.Username}</p>
                              </div>
                          </div>
                          <p className="post-message">{postReply.Message}</p>
                          <hr className="post-separator" /> {/* Add a horizontal line at the bottom of each post */}
                        </div>
                      </div>
                ))}
              </ul>

            </div>

        <UsersBar/>
        </div>
    )
}


export default ViewPost