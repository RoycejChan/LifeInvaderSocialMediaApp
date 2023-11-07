import { db} from "../../../FB-config/Firebase-config";
import { collection, addDoc, doc } from "firebase/firestore";

import { useState } from "react";


export const sendaReply = async (post, user, msg) => {

  console.log("yes");

  const [currentFormattedDate, setCurrentDate] = useState("");
const currentDate = new Date();
      const month = currentDate.getMonth() + 1; // Months are zero based? like array
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        setCurrentDate(`${month}/${day}/${year} ${hours}:${minutes}`); 

    try {


      const postRef = doc(db, 'posts', post.id);
    
    // Step 2: Get a reference to the 'likes' subcollection of that post
    const repliesCollectionRef = collection(postRef, 'replies');

    await addDoc(repliesCollectionRef, {
      Username:user.username,
      Message:msg,
      Date: currentFormattedDate
    });

    const userDocRef = doc(db, 'users', user.uid);

    const userPostsCollectionRef = collection(userDocRef, 'replies');
    
    await addDoc(userPostsCollectionRef, {
        post,
        Message: msg,
        Date: currentFormattedDate
    });
    

  } catch (error) {
    console.error('Error replying:', error);
  }

}