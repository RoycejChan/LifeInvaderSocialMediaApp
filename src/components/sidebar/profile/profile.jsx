import React, { useState, useEffect, useContext, createContext} from "react"
import "./profile.css"
import { useLocation } from "react-router-dom";
import { db } from "../../../FB-config/Firebase-config.js";
import { collection, doc, getCountFromServer, getDocs } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../usercontext.jsx";
import { auth } from "../../../FB-config/Firebase-config.js";
import { signOut } from "firebase/auth";

import SideBar from "../sidebar.jsx";
import UsersBar from "../../usersbar/usersbar.jsx";
import profilePFP from "../../../assets/defaultpfp.png"
import Button from '@mui/material/Button';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ShuffleIcon from '@mui/icons-material/Shuffle';
const Profile = () => {
  const { userData, setUser } = useUser();
    const location = useLocation();
    const user = location.state.user; 
    const navigate = useNavigate();

    const [replies, setReplies] = useState([]);
    const [posts, setPosts] = useState([]);
    const [feed, setFeed] = useState("posts");
    const [postCount, setPostCount] = useState(0);
    const [lonelyPage, setLonelyPage] = useState(false);
    const [noReplies, setNoReplies] = useState(false);
    useEffect(() => {
      // // Fetch posts when the component mounts
      // const fetchData = async () => {
      //   const postsData = await fetchPosts();
      //   setPosts(postsData);
      // };
  
      // fetchData();
      setPostCount(0);
      fetchReplies();
      fetchPosts();
    }, [user]);
  
    
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
        setLonelyPage(false)
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

    const goBack = () => {
      navigate('/homepage')
    }

    //Navs to post thats clicked
    const navToPost = (post) => {
      navigate("/viewPost", { state: { post, user } });
    };

    
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
const [value, setValue] = useState('recents');
const handleChange = (event, newValue) => {
  setValue(newValue);
};
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

    return (
        <div className="homepage">
        <SideBar/>
            <div className="profile-container">
                    <div className="profile-header">
                        <div className="profile-header-details">
                          <div className="profile-header-tags">
                            <Button onClick={()=>goBack()} className="goback-btn"><KeyboardReturnIcon/></Button>
                            <h4 className="profile-header-username">{user.username}</h4>
                            <p className="profile-postAmount">{postCount} Posts</p>
                          </div>
                          <div className="editProfile">
                            <Button variant="outlined" sx={{ color: '#176daf' }} className="editProfile">Edit Profile</Button>
                          </div>
                        </div>

                    <div className="profile-details">
                        <div className="profile-user-tags">
                            <h2 className="profile-name">{user.username}</h2>
                            <p className="profile-bio">
                                    Hi I like to play sports and workout.
                                    My IG is @BabyChan
                            </p>
                        </div>
                           
                        <div className="profile-pfp">
                            <img src={profilePFP} alt="pfp" />
                        </div>
                    </div>
                   
                    </div>



{/* STILL WORKING BELOW JUST PASTED */}
                    <div className="feed">
                    <div className="profile-nav">
                            <Button variant="text" sx={{ color: '#176daf' }} className="feedChange" onClick={()=>setFeed('posts')}><h3>Posts</h3></Button>
                            <Button variant="text" sx={{ color: '#176daf' }} className="feedChange" onClick={()=>setFeed('replies')}><h3>Replies</h3></Button>
                    </div>

              {feed == 'posts' ? (

                  (lonelyPage ? (
                    <div className="apost">
                      <h2 className="post-message" >Its lonely here ... </h2>
                  </div>
                   ) : (
              <ul>
              {posts.map((post) => (
                
                      <div key={post.id} className="apost">
                   
                        <div className="mainpost">
                          <div className="upperpost">
                          <div className="pfp-img-container">
                          <img src={profilePFP} alt="PFP" />
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
                ))}
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