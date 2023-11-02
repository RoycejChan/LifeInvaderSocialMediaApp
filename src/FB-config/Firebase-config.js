
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from 'firebase/auth'
import { getFirestore} from 'firebase/firestore'

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBC_PUwwtoxuV-V7lpAXpbkWig0hJhGzEQ",
    authDomain: "lifein-e0258.firebaseapp.com",
    projectId: "lifein-e0258",
    storageBucket: "lifein-e0258.appspot.com",
    messagingSenderId: "739163705943",
    appId: "1:739163705943:web:1c2aadc3dead44754d0912"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const GoogleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);