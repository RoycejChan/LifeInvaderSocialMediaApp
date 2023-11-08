import React, { useState, useEffect, useContext, createContext} from "react"
import "./profile.css"
import { useLocation } from "react-router-dom";
import { db } from "../../../FB-config/Firebase-config.js";
import { collection, doc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import SideBar from "../sidebar.jsx";
import UsersBar from "../../usersbar/usersbar.jsx";
import profilePFP from "../../../assets/defaultpfp.png"
import Button from '@mui/material/Button';

const Profile = () => {
    const location = useLocation();
    const user = location.state.user; 
    const navigate = useNavigate();

    const [replies, setReplies] = useState([]);
    const [posts, setPosts] = useState([]);
    const [feed, setFeed] = useState("");
    useEffect(() => {
      // // Fetch posts when the component mounts
      // const fetchData = async () => {
      //   const postsData = await fetchPosts();
      //   setPosts(postsData);
      // };
  
      // fetchData();
      fetchReplies();
      fetchPosts();
    }, [user]);
  
    
    const fetchPosts = async () => {
      try {

        //reference the persons posts
        const userDocRef = doc(db, 'users', user.uid);

        //reference posts subcollection in userdata.uid user
        const userPostsCollectionRef = collection(userDocRef, 'posts');

        const querySnapshot = await getDocs(userPostsCollectionRef); 
        const postsData = []; 
        
        querySnapshot.forEach((doc) => {
  
          const post = {
            id: doc.id, 
            ...doc.data(), 
          };
          postsData.push(post);
                });

                console.log(querySnapshot);

        setPosts(postsData);
        return postsData;
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
        const repliesData = [];
        querySnapshotreplies.forEach((doc) => {
          const reply = {
            id: doc.id, 
            ...doc.data(), 
          };

          repliesData.push(reply);
                });
        setReplies(repliesData);
        return repliesData;
      } catch (error) {
        console.error("Error fetching replies:", error);
        return [];
      }
    };

    //Navs to post thats clicked
    const navToPost = (post) => {
      navigate("/viewPost", { state: { post, user } });
    };

    return (
        <div className="homepage">
        <SideBar/>
            <div className="profile-container">
                    <div className="profile-header">
                        <div className="profile-header-details">
                          <div className="profile-header-tags">
                            <h4 className="profile-header-username">{user.username}</h4>
                            <p className="profile-postAmount">23 Posts</p>
                            </div>
                            <div className="editProfile">
                            <Button variant="outlined" sx={{ color: '#176daf' }} className="editProfile">Edit Profile</Button>
                            </div>
                        </div>

                    <div className="profile-details">
                        <div className="profile-user-tags">
                            <h2 className="profile-name" onClick={()=>console.log(feed)}>{user.username}</h2>
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
              <ul>
              {posts.map((post) => (
                      <div key={post.id} className="apost">
                        <div className="pfp-img-container">
                          <img src={profilePFP} alt="PFP" />
                        </div>
                        <div className="mainpost">
                          <div className="upperpost">
                              <div className="usertags">
                                <p>@{post.Username}</p>
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
            </div>

            </div>


        <UsersBar/>
        </div>
    )
}

export default Profile