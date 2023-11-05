import { doc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../FB-config/Firebase-config";

export const likePost = async (post, user) => {
    try {
        // Step 1: Get a reference to the post document
        const postRef = doc(db, 'posts', post.id);
        // Step 2: Get a reference to the 'likes' subcollection of that post
        const likesCollectionRef = collection(postRef, 'likes');
        // Step 3: Fetch all documents in the subcollection
        const likesQuerySnapshot = await getDocs(likesCollectionRef);
        // Step 4: Count the number of likes (documents) in the subcollection
        const likeCount = likesQuerySnapshot.size;
        console.log('Like count:', likeCount);


        const userLiked = likesQuerySnapshot.docs.some((doc) => doc.data().Username === user.username);

        if (!userLiked) {
            // Add the user's like to the 'likes' subcollection of the post
            await addDoc(likesCollectionRef, {
                Username: user.username
            });

            // Add the like to the user's 'likes' subcollection
            const userDocRef = doc(db, 'users', user.uid);
            const userLikesCollectionRef = collection(userDocRef, 'likes');
            await addDoc(userLikesCollectionRef, {
                postID: post.id, // You can store the post ID to keep track of liked posts
            });

        } else {
            console.log('User already liked the post');
          }
    } catch (error) {
        console.error('Error counting likes:', error);
    }
};
