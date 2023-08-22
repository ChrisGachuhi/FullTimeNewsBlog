/* eslint-disable react/prop-types */
import { useNavigate } from "react-router";
import { auth, db, googleAuthProvider } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { useRef } from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
// import { addDoc, collection } from "firebase/firestore";

function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  // const nameRef = useRef();
  const userCollectionRef = collection(db, "BlogUsers");

  // FUNCTION TO HANDLE GOOGLE SIGN IN
  function googleSignIn() {
    signInWithPopup(auth, googleAuthProvider).then(async (result) => {
      const email = result.user.email;

      // Check if the user's email already exists in Firestore
      const existingUsersQuery = query(
        userCollectionRef,
        where("email", "==", email)
      );
      const existingUsersSnapshot = await getDocs(existingUsersQuery);

      if (existingUsersSnapshot.empty) {
        // Add the user's information to the collection
        addDoc(userCollectionRef, {
          name: result.user.displayName,
          email: result.user.email,
        });

        localStorage.setItem("isAuth", true);
        setIsAuth(true);
        navigate("/");
      } else {
        // User already exists
        localStorage.setItem("isAuth", true);
        setIsAuth(true);
        navigate("/");
      }
    });
  }

  // FUNCTION TO HANDLE EMAIL SIGN IN
  function emailSignin() {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    signInWithEmailAndPassword(auth, email, password).then(() => {
      localStorage.setItem("isAuth", true);
      setIsAuth(true);
      navigate("/");
    });
  }

  // FUNCTION TO HANDLE EMAIL SIGN UP
  function emailSignup() {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    // const name = nameRef.current.value

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        localStorage.setItem("isAuth", true);
        setIsAuth(true);
        navigate("/");
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

  return (
    <div className="LoginPage">
      <div className="Login--Card">
        <input type="email" ref={emailRef} placeholder="Email Address" />
        <br />

        <input type="password" ref={passwordRef} placeholder="Password" />
        <br />

        <button onClick={emailSignin} className="Email--Signin">
          SignIn
        </button>
        <br />

        <button onClick={emailSignup} className="Email--Signup">
          Signup
        </button>
        <br />

        <button className="GoogleSignIn" onClick={googleSignIn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
