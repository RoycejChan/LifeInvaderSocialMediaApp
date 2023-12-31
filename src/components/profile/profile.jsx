import React, { useState, useEffect} from "react"
import { useLocation } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";

import SideBar from "../sidebar/sidebar.jsx";
import UsersBar from "../usersbar/usersbar.jsx";
import profilePFP from "../../assets/defaultpfp.png"
import { useUser } from "../usercontext.jsx";

import "./profile.css"

import { db } from "../../FB-config/Firebase-config.js";
import { collection, doc, getDocs, updateDoc, getDoc } from "firebase/firestore";
import { auth } from "../../FB-config/Firebase-config.js";
import { signOut } from "firebase/auth";
import { storage } from "../../FB-config/Firebase-config.js";
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage'

import { v4 } from 'uuid' // some library used to generate random string of letters for image uploads.
                          //users might have same image names ex. imgpfp.png1 or coverImage.png1 or portfolio.pdf, common image names,
                          // the library helps to generate and add random string to the end of the img string name to prevent duplicates.

import Button from '@mui/material/Button';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ClearIcon from '@mui/icons-material/Clear';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import Backdrop from '@mui/material/Backdrop';
import { TextField } from "@mui/material";
import { Alert } from "@mui/material";

const Profile = () => {
  const { userData, setUser } = useUser();
    const currentUser = userData;
    const location = useLocation();

    const user = location.state.user;
    const navigate = useNavigate();

    const [replies, setReplies] = useState([]);
    const [posts, setPosts] = useState([]);
    const [feed, setFeed] = useState("posts"); //the tab the user is on, posts or replies tab of a profile
    const [postCount, setPostCount] = useState(0);
    const [lonelyPage, setLonelyPage] = useState(false); //if user has no posts
    const [noReplies, setNoReplies] = useState(false); //if user has no replies

    const [profileImage, setProfileImage] = useState(null);
    const [imageUpload, setImageUpload] = useState(null) 

    const [open, setOpen] = useState(false); //state of editing profile popup for bio
    const [profileBio, setProfileBio] = useState('');
    const [bio, setNewBio] = useState('');

    const [value, setValue] = useState('recents'); // Changes value text for mobile navbar

    const [logMsg, setLogMsg] = useState('');
    const [displayLog, setLog] = useState(false);

    useEffect(() => { //when user uploads new pfp, executes upload to db, then uploads it to ui in next useeffect
        upload();
    }, [imageUpload])


    useEffect(() => {  //code executes if user changes profile they're viewing, or if they change their bio/pfp

      const userRef = doc(db, 'users', user.uid);
      getDoc(userRef)
      .then((doc) => {
        if (doc.exists()) {
          // Access the specific field from the document data
          const profileImage = doc.data().profileImage;
          const profileBio = doc.data().profileBio;
          setProfileImage(profileImage);
          setProfileBio(profileBio);
        } else {
          console.log('Document does not exist');
        }
      })
      .catch((error) => {
        console.error('Error getting document:', error);
      });
      setPostCount(0);
      fetchReplies();
      fetchPosts();
    }, [user, profileBio, profileImage]); 
  
    
    const fetchPosts = async () => {
      try {

        //reference the persons posts
        const userDocRef = doc(db, 'users', user.uid);

        //reference posts subcollection in userdata.uid user
        const userPostsCollectionRef = collection(userDocRef, 'posts');
        const countSnapshot = await getDocs(userPostsCollectionRef);
        const userPostCount = countSnapshot.size;
        if (userPostCount == 0) {
            setLonelyPage(true);
            return false;
        }
        else {
        setLonelyPage(false);
        setPostCount(userPostCount);
        const querySnapshot = await getDocs(userPostsCollectionRef); 
        const postsData = []; 
        querySnapshot.forEach((doc) => {
          const post = {
            id: doc.id, 
            ...doc.data(), 
          };
          postsData.push(post);
                });


        setPosts(postsData);
        return postsData;
      
              }
      
      } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
      }


    };


    
    const fetchReplies = async () => {
      try {

        //reference the persons posts
        const userDocRef = doc(db, 'users', user.uid);


        const userRepliesCollectionRef = collection(userDocRef, 'replies');


        const querySnapshotreplies = await getDocs(userRepliesCollectionRef);
        const replyCount = querySnapshotreplies.size;
 
        const repliesData = [];

        if (replyCount == 0) {
          setNoReplies(true);
          return false;
      }
      else {
        setNoReplies();

        querySnapshotreplies.forEach((doc) => {
          const reply = {
            id: doc.id, 
            ...doc.data(), 
          };

          repliesData.push(reply);
                });
        setReplies(repliesData);
        return repliesData;
              }
      } catch (error) {
        console.error("Error fetching replies:", error);
        return [];
      }
    };

const goBack = () => {navigate('/homepage')}

    //Navs to post thats clicked
const navToPost = (post) => {navigate("/viewPost", { state: { post, user } });};

    
const calculateTimeAgo = (timestamp) => {
  const now = new Date();
  const postDate = timestamp.toDate(); // Convert Firestore timestamp to Date object

  const secondsAgo = Math.floor((now - postDate) / 1000);

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
  }
};

const handleChange = (event, newValue) => {setValue(newValue);}; // Changes value text for mobile navbar


const toProfile = () => {navigate('/profile', { state: { user } });}

const toUsers = () => {navigate('/users', { state: { user } });}

const logout = () => {
signOut(auth).then(()=> {
  setUser(null)
  navigate('/');
}).catch((err) => {
  console.log(err);
})
}


const upload = () => {

  if (imageUpload == null) return;

  let randomLetters = v4();
  let imageString = `${imageUpload.name}${randomLetters}`
  console.log(imageString);
  const imageRef = ref(storage, `images/${imageString}`)
  uploadBytes(imageRef, imageUpload).then(()=> {
    getDownloadURL(ref(storage, `images/${imageString}`))
    .then((url) => {

    const userDocRef = doc(db, 'users', user.uid);
    updateDoc(userDocRef, {
      profileImage: url, 
    })
      .then(() => {
        setLog(true);
        setProfileImage(url);
        setLogMsg("Profile Pic Updated");
        setTimeout(() => {
            setLog(false);
            setLogMsg("");
        }, 3000);
      })
      .catch((error) => {
        console.error('Error associating image with the user:', error);
      });

  })
  .catch((error) => {
    // Handle any errors
    console.log(error)
  });

  })
}

const handleClose = () => {
  setOpen(false);
};
const handleOpen = () => {
  setOpen(true);
};

const editBio = () => {

  const userDocRef = doc(db, 'users', user.uid);
  
  updateDoc(userDocRef, {
    profileBio: bio 
  })
    .then(() => {
      handleClose();
      setLog(true);
      setNewBio("");
      setProfileBio(bio);
      setLogMsg("Bio Updated");
      setTimeout(() => {
          setLog(false);
          setLogMsg("");
      }, 3000);
    })
    .catch((error) => {
      console.error('Error', error);
    });
}
    return (
        <div className="homepage">
        <SideBar/>
            <div className="profile-container">
              {displayLog ? 
                <Alert variant="filled" severity="success" className="alertBox">
                    {logMsg}
                </Alert> 
                : <></>
                }
                    <div className="profile-header">
                        <div className="profile-header-details">
                            <div className="profile-header-tags">
                              <Button onClick={()=>goBack()} className="goback-btn"><KeyboardReturnIcon/></Button>
                              <h4 className="profile-header-username">{user.username}</h4>
                              <p className="profile-postAmount">{postCount} Posts</p>
                            </div>

                          <div className="editProfile">
                              {currentUser.uid == user.uid 
                                ? 
                                <Button variant="outlined" sx={{ color: '#176daf', backgroundColor: '#161616' }} 
                                        className="editProfile" onClick={()=>handleOpen()}>Edit Profile</Button
                                > 
                                : <></> }
                            <Backdrop
                              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                              open={open}
                            >
                              <div className="editingBio">
                                <div className="editingBio-header">
                                  <h2>New Bio</h2>
                                  <ClearIcon onClick={()=>handleClose()}/>
                                </div>
                                <div className="bioInput">
                                  <TextField id="standard-basic"  
                                            variant="standard" fullWidth   
                                            color="warning" onChange={(e)=>setNewBio(e.target.value)}
                                            inputProps={{ maxLength: 100 } }
                                            value={bio}
                                            />                              
                                  <button onClick={()=>editBio()} className="bioChangeBtn">Update Bio</button>
                                </div>
                                  <p>{bio.length}/100</p>
                              </div>
                            </Backdrop>
                          </div>
                        </div>

                    <div className="profile-details">
                        <div className="profile-user-tags">
                            <h2 className="profile-name">{user.username}</h2>
                            <p className="profile-bio">
                              {profileBio ? profileBio : "No Bio."}
                            </p>
                        </div>
                        <div className="profile-pfp">
                            <label htmlFor="fileInput" className="alignadd">
                              {profileImage ? (
                                <div className="profile-pfp-container">
                                  <img src={profileImage} alt="pfp" className="pfp" />
                                  {currentUser.uid == user.uid ?
                                    <>
                                      <h1 className="changePFP">+</h1>
                                      <input id="fileInput" type="file" onChange={(event) => { setImageUpload(event.target.files[0]) }} style={{ display: 'none' }} /> 
                                    </>
                                  : <></> }
                                </div>
                                ) : (
                                <div className="profile-pfp-container">
                                  <img src={profilePFP} alt="pfp" className="pfp" />
                                  {currentUser.uid == user.uid ?
                                    <>
                                      <h1 className="changePFP">+</h1>
                                       <input id="fileInput" type="file" onChange={(event) => { setImageUpload(event.target.files[0]) }} style={{ display: 'none' }} /> 
                                    </>
                                  : <></> }
                                </div>
                              )}
                            </label>
                        </div>
                    </div>
                   
                    </div>



{/* STILL WORKING BELOW JUST PASTED */}
                    <div className="feed">
                      <div className="profile-nav">
                              <Button variant="text" sx={{ color: '#176daf' }} className="feedChange" onClick={()=>setFeed('posts')}><h3>Posts</h3></Button>
                              <Button variant="text" sx={{ color: '#176daf' }} className="feedChange" onClick={()=>setFeed('replies')}><h3>Replies</h3></Button>
                      </div>
                            {/* THIS IF USER HAS no posts */}
                        {feed == 'posts' ? (

                            (lonelyPage ? (
                              <div className="apost">
                                <h2 className="post-message" >Its lonely here ... </h2>
                            </div>
                            ) : (
                    
                          <ul>
                
                {posts.map((post) => {

                  return (
                      <div key={post.id} className="apost">
                   
                        <div className="mainpost">
                            <div className="upperpost">
                              <div className="pfp-img-container">
                                <img src={profileImage ? profileImage : profilePFP} alt="User PFP" />
                              </div>
                              <div className="usertags">
                                <p>@{post.Username}</p>
                                <p>{calculateTimeAgo(post.Date)}</p>
                              </div>
                          </div>
                          <p className="post-message" onClick={()=>{navToPost(post)}}>{post.Message}</p>
                          {/* IN FIRESTORE, REFERENCES SUBCOLLECTIONS OF A SUBCOLLECTION DOESNT EXIST, SO I CAN'T Access UserCollection->postSubCollection->Postlikes&&RepliesSubcollection to show like and replies count*/ }
                          {/* SO THERE IS NO POINT OF PUTTING A THE POST BUTTONS ON THE PROFILES PAGE */}
                          <hr className="post-separator" /> {/* Add a horizontal line at the bottom of each post */}
                        </div>
                      </div>
                  )})}
                            </ul>

              ))                

               ) : (
          //REPLIES TAB, just copied the post tab so classes are the same
          noReplies ? (
            <div className="apost">
              <h2 className="post-message" >This person hasnt responsed to anything ... </h2>
            </div>
           ) : (
          <ul>
          {replies.map((reply) => (
                  <div key={reply.id} className="apost">
                    <div className="pfp-img-container">
                      <img src={profilePFP} alt="PFP" />
                    </div>
                    <div className="mainpost">
                      <div className="upperpost">
                          <div className="usertags">
                            <p>{reply.User.username}</p>
                            <p>Replying to @{reply.post.Username}</p>
                          </div>
                      </div>
                      <p className="post-message" onClick={()=>{navToPost(reply)}}>{reply.Message}</p>
                      {/* IN FIRESTORE, REFERENCES SUBCOLLECTIONS OF A SUBCOLLECTION DOESNT EXIST, SO I CAN'T Access UserCollection->postSubCollection->Postlikes&&RepliesSubcollection to show like and replies count*/ }
                      {/* SO THERE IS NO POINT OF PUTTING A THE POST BUTTONS ON THE PROFILES PAGE */}
                      <hr className="post-separator" /> {/* Add a horizontal line at the bottom of each post */}
                    </div>
                  </div>
            ))}
          </ul>
          ))}
            </div>

            </div>


        <UsersBar/>
        <div className="bottom-profile-nav">
          <BottomNavigation  value={value} onChange={handleChange} className="bottom-nav-profile">
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
              onClick={()=>toUsers()}
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
        </div>
    )
}

export default Profile