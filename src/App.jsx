import "./App.css";
import { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import CreatePost from "./Pages/CreatePost";
import ImageUpload from "./Pages/imageUpload";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));

  function signOutUser() {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/Login";
    });
  }

  return (
    <BrowserRouter>
      <nav className="Navbar">
        <Link to={"/"}>Home</Link>

        {!isAuth ? (
          <Link to={"/Login"}>Login</Link>
          ) : (
            <>
              <Link to={"/CreatePost"}>CreatePost</Link>
              <button onClick={signOutUser}>Log Out</button>
            </>
        )}
        {/* READ AS: if user is not authenticated, redirect to Login Page; else display CreatePost Link and LogOut button */}
      </nav>

      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />} />
        <Route path="/Login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/CreatePost" element={<CreatePost isAuth={isAuth}/>} />
        <Route path="/Upload" element={<ImageUpload />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
