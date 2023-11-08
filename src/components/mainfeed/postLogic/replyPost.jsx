import { db} from "../../../FB-config/Firebase-config";
import { collection, addDoc, doc } from "firebase/firestore";

export const sendaReply = async (post, user, msg, date) => {

    try {
      const postRef = doc(db, 'posts', post.id);
    
      const repliesCollectionRef = collection(postRef, 'replies');

    await addDoc(repliesCollectionRef, {
      User: user,
      Username:user.username,
      Message:msg,
      Date: date
    });

    const userDocRef = doc(db, 'users', user.uid);

    const userPostsCollectionRef = collection(userDocRef, 'replies');
    
    await addDoc(userPostsCollectionRef, {
        User: user,
        post,
        Message: msg,
        Date: date
    });
    

  } catch (error) {
    console.error('Error replying:', error);
  }

}