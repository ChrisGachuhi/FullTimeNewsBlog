// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from 'firebase/firestore'
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDvF-m0YqrD5zAF_xzzYBVbQKzMj3K5ZlM",
    authDomain: "fir-tutorial-e4fd4.firebaseapp.com",
    databaseURL: "https://fir-tutorial-e4fd4-default-rtdb.firebaseio.com",
    projectId: "fir-tutorial-e4fd4",
    storageBucket: "gs://fir-tutorial-e4fd4.appspot.com",
    messagingSenderId: "802258539086",
    appId: "1:802258539086:web:ebbb25a661e92ecce9691f",
    measurementId: "G-MTHEFM4QQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleAuthProvider = new GoogleAuthProvider
export const storage = getStorage(app)