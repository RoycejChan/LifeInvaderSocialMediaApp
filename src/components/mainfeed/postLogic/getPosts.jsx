import { getDocs, doc, collection } from "firebase/firestore";
import { db } from "../../../FB-config/Firebase-config";

export const getPosts = async () => {
  //goes to general posts collection (all posts of all users)
    try {
      const postsCollectionRef = collection(db, 'posts');
      const querySnapshot = await getDocs(postsCollectionRef);
      const postsData = [];
  

    //for each post, do this
      const fetchLikesPromises = querySnapshot.docs.map(async (docSnap) => {
        if (docSnap.id) {
          const postRef = doc(db, 'posts', docSnap.id);
          const likesCollectionRef = collection(postRef, 'likes');
          const likesQuerySnapshot = await getDocs(likesCollectionRef);
          const likeCount = likesQuerySnapshot.size;
          const post = {
            id: docSnap.id,
            likeCount: likeCount,
            ...docSnap.data(),
          };
          postsData.push(post);
        }
      });
      await Promise.all(fetchLikesPromises); //wait until done with all posts in collection
      
      return postsData;// return to main feed
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };