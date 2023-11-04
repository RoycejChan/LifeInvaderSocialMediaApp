import { doc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../../FB-config/Firebase-config";

export const likePost = async (postId, username) => {
    try {
        // Step 1: Get a reference to the post document
        const postRef = doc(db, 'posts', postId);
    
        // Step 2: Get a reference to the 'likes' subcollection of that post
        const likesCollectionRef = collection(postRef, 'likes');
    
        // Step 3: Fetch all documents in the subcollection
        const likesQuerySnapshot = await getDocs(likesCollectionRef);
    
        // Step 4: Count the number of likes (documents) in the subcollection
        const likeCount = likesQuerySnapshot.size;
    
        console.log('Like count:', likeCount);
    
        await addDoc(likesCollectionRef, {
          Username: username
        });
    
    
      } catch (error) {
        console.error('Error counting likes:', error);
      }
}