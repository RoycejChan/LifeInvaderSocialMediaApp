import { db} from "../../../FB-config/Firebase-config";
import { collection, addDoc, doc } from "firebase/firestore";

import { useState } from "react";


export const sendaReply = async (postReplyingTo, user, date, msg) => {
    try {


      const postRef = doc(db, 'posts', postReplyingTo.id);
 



    // Step 1: Get a reference to the post document
    
    // Step 2: Get a reference to the 'likes' subcollection of that post
    const repliesCollectionRef = collection(postRef, 'replies');

    await addDoc(repliesCollectionRef, {
      Username:user.username,
      Message:msg,
      Date: date
    });

    const userDocRef = doc(db, 'users', user.uid);

    const userPostsCollectionRef = collection(userDocRef, 'replies');
    
    await addDoc(userPostsCollectionRef, {
        postReplyingTo,
        Message: msg,
        Date: date
    });
    

    





  } catch (error) {
    console.error('Error replying:', error);
  }

}