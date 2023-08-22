/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

// IMPORTING REQUIRED REACT HOOKS AND MODULES
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth, storage } from "../../firebaseConfig";
import { useNavigate } from "react-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

// IMPORTING RICH TEXT EDITOR COMPONENTS AND STYLES
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";

// FUNCTIONAL COMPONENT FOR CREATING A NEW BLOG POST
function CreatePost({ isAuth, setImageLocation }) {
  // STATE VARIABLES FOR BLOG POST FORM
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [image, setImage] = useState();

  // STATE VARIABLE FOR RICH TEXT EDITOR CONTENT
  const [postText, setPostText] = useState({ value: null });
  const handlePostText = (value) => {
    setPostText({ value });
  };

  // FIRESTORE REFERENCE TO BLOGPOSTS COLLECTION
  const postCollectionRef = collection(db, "BlogPosts");

  // NAVIGATION FUNCTION TO REDIRECT AFTER UPLOAD
  const navigate = useNavigate();

  // FUNCTION TO HANDLE UPLOADING A NEW BLOG POST
  const uploadBlog = async () => {
    if (image == null) return;

    // STORAGE REFERENCE FOR UPLOADING IMAGE WITH A UNIQUE ID
    const imageRef = ref(storage, `images/${image.name + v4()}`);

    await uploadBytes(imageRef, image).then(() => {
      getDownloadURL(imageRef).then((url) => {
        const imageURL = url;
        setImageLocation(imageURL);

        // FUNCTION TO CREATE NEW BLOG POST DOCUMENT
        const createPost = async () => {
          // ... (Code for creating a new post document)

          // ADD NEW POST DOCUMENT TO FIRESTORE
          Date.prototype.timeNow = function () {
            return (
              (this.getHours() < 10 ? "0" : "") +
              this.getHours() +
              ":" +
              (this.getMinutes() < 10 ? "0" : "") +
              this.getMinutes() +
              ":" +
              (this.getSeconds() < 10 ? "0" : "") +
              this.getSeconds()
            );
          };

          var timestamp =
            "Posted: " + new Date().today() + " at: " + new Date().timeNow();

          await addDoc(postCollectionRef, {
            category,
            title,
            postDescription,
            postText,
            imageURL,
            timestamp,
            author: {
              name: auth.currentUser.displayName,
              authorId: auth.currentUser.uid,
            },
          })
            .then(() => {
              navigate("/");
            })
            .catch((error) => {
              console.log(error.message);
            });
        };
        createPost();
      });
    });
  };

  // CHECK IF USER IS AUTHENTICATED ON PAGE LOAD
  useEffect(() => {
    if (!isAuth) {
      // REDIRECT TO LOGIN PAGE IF NOT AUTHENTICATED
      navigate("/Login");
    }
  }, []);

  // RENDER THE CREATE POST FORM
  return (
    <div className="CreatePostPage">
      <div className="PostContainer">
        <h1>Create Post</h1>

        {/* INPUT FIELDS FOR BLOG TITLE AND CATEGORY */}
        <div className="Header--InputGroup">
          <input
            type="text"
            placeholder="Enter Blog Title"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />

          <select
            name="Category"
            id=""
            onChange={(event) => {
              setCategory(event.target.value);
            }}
          >
            <option value="">Select Blog Category</option>
            <option value="FootBall">Football</option>
            <option value="Celebrity">Celebrity</option>
          </select>
        </div>

        {/* INPUT FIELDS FOR BRIEF POST DESCRIPTION AND IMAGE */}
        <div className="PostDescription--InputGroup">
          <textarea
            type="text"
            placeholder="Enter Brief Post Description"
            onChange={(event) => {
              setPostDescription(event.target.value);
            }}
          />
          <input
            type="file"
            onChange={(event) => {
              setImage(event.target.files[0]);
            }}
          />
        </div>

        {/* RICH TEXT EDITOR FOR BLOG CONTENT */}
        <div className="PostEntry--InputGroup">
          <h3>Type your blog Here</h3> <br />
          <EditorToolbar />
          <ReactQuill
            style={{ height: "150px" }}
            value={postText.value}
            theme="snow"
            onChange={handlePostText}
            placeholder={"Write something awesome..."}
            modules={modules}
            formats={formats}
          />
        </div>

        {/* BUTTON TO UPLOAD THE POST */}
        <button onClick={uploadBlog}>Submit Post</button>
      </div>
    </div>
  );
}

export default CreatePost;
