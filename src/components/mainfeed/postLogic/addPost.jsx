import {  doc, collection, setDoc, addDoc } from "firebase/firestore";
import { db } from "../../../FB-config/Firebase-config";

export const addPost = async (user, message) => {
      const currentDate = new Date();

    try {
// Add the post to the general 'posts' collection
  const generalPostRef = doc(collection(db, 'posts'));

//  addds to post collection that has all user posts
  await setDoc(generalPostRef, {
    Username: user.username,
    Message: message,
    Date: currentDate,
    userId: user.uid,
    User: user
  });

  // Add the post to the user's post that posted itcollection

  const userDocRef = doc(db, 'users', user.uid);
  const userPostsCollectionRef = collection(userDocRef, 'posts');

  await addDoc(userPostsCollectionRef, {
    Username: user.username,
    Message: message,
    Date: currentDate,
    userId: user.uid,
    User: user
  });

    } catch (error) {
      console.error("Error adding post:", error);
    }
  };