import { doc, collection, getDocs, addDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../../../FB-config/Firebase-config";

export const likePost = async (post, user) => {
    try {
        const postRef = doc(db, 'posts', post.id);
        const likesCollectionRef = collection(postRef, 'likes');
        const likesQuerySnapshot = await getDocs(likesCollectionRef);
        const likeCount = likesQuerySnapshot.size;

        // Create a query to find documents in the 'likes' subcollection where the user's UID matches
        const queryForUser = query(likesCollectionRef, where('userUid', '==', user.uid));
        // Fetch the documents that match the query
        const userLikesSnapshot = await getDocs(queryForUser);

        // Check if there are any documents in the query results
        if (userLikesSnapshot.empty) {
            // Add a new like document with the user's UID
            await addDoc(likesCollectionRef, { userUid: user.uid, user });

            return false;
        } else {
            userLikesSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            return true;
        }
    } catch (error) {
        console.error('Error checking if user liked post:', error);
    }
};
