import "./App.css";
import { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import CreatePost from "./Pages/CreatePost";
import Article from "./Pages/Article";

function App() {
  // STATE TO MANAGE USER AUTHENTICATION AND IMAGE LOCATION
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [imageLocation, setImageLocation] = useState("");

  // FUNCTION TO SIGN OUT THE USER AND REDIRECT TO THE LOGIN PAGE
  function signOutUser() {
    // Sign out using Firebase Auth
    signOut(auth).then(() => {
      // Clear local storage and set authentication status to false
      localStorage.clear();
      setIsAuth(false);
      // Redirect to the Login page
      window.location.pathname = "/Login";
    });
  }

  return (
    <BrowserRouter>
      {/* NAVIGATION BAR */}
      <nav className="Navbar">
        <Link to={"/"}>Home</Link>

        {/* CONDITIONALLY RENDER LOGIN AND CREATEPOST LINKS AND LOGOUT BUTTON */}
        {!isAuth ? (
          <Link to={"/Login"}>Login</Link>
        ) : (
          <>
            <Link to={"/CreatePost"}>CreatePost</Link>
            <button onClick={signOutUser}>Log Out</button>
          </>
        )}
      </nav>

      {/* ROUTING SETUP */}
      <Routes>
        {/* ROUTE FOR HOME PAGE */}
        <Route
          path="/"
          element={<Home isAuth={isAuth} imageLocation={imageLocation} />}
        />
        {/* ROUTE FOR LOGIN PAGE */}
        <Route path="/Login" element={<Login setIsAuth={setIsAuth} />} />
        {/* ROUTE FOR CREATEPOST PAGE */}
        <Route
          path="/CreatePost"
          element={
            <CreatePost isAuth={isAuth} setImageLocation={setImageLocation} />
          }
        />
        {/* ROUTE FOR ARTICLE PAGE */}
        <Route path="/Article/:id" element={<Article isAuth={isAuth} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
