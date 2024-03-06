// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCd7TaTwwz_FQPQOyJxjlmk2D-lah83lsk",
  authDomain: "react-login-cse-practice.firebaseapp.com",
  projectId: "react-login-cse-practice",
  storageBucket: "react-login-cse-practice.appspot.com",
  messagingSenderId: "852155957418",
  appId: "1:852155957418:web:07f03cfdd2079aed6650d3",
  measurementId: "G-X5XFH7VNSZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app;