/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth, storage } from "../firebaseConfig";
import { useNavigate } from "react-router";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";

function CreatePost({ isAuth, setImageLocation }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [image, setImage] = useState();

  const [postText, setPostText] = useState({value: null});
  const handlePostText = value => {
    setPostText({value})
  }

  const postCollectionRef = collection(db, "BlogPosts");

  const navigate = useNavigate();

  // const [imageList, setImageList] = useState([]);
  // const imageListRef = ref(storage, "images/");

  const uploadImage = async () => {
    if (image == null) return;

    const imageRef = ref(storage, `images/${image.name + v4()}`);
    // use npm i firebase uuid to install uuid library; allow us to name each file upload with a unique identifier

    await uploadBytes(imageRef, image).then(() => {
      getDownloadURL(imageRef).then((url) => {
        const imageURL = url;
        setImageLocation(imageURL);

        console.log(imageURL);

        const createPost = async () => {
          Date.prototype.today = function () {
            return (
              (this.getDate() < 10 ? "0" : "") +
              this.getDate() +
              "/" +
              (this.getMonth() + 1 < 10 ? "0" : "") +
              (this.getMonth() + 1) +
              "/" +
              this.getFullYear()
            );
          };

          // For the time now
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

          // var x = function uuidv4() {
          //   return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
          //     (
          //       c ^
          //       (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
          //     ).toString(16)
          //   );
          // };

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

  useEffect(() => {
    if (!isAuth) {
      navigate("/Login");
    }
  }, []);

  return (
    <div className="CreatePostPage">
      <div className="postContainer">
        <h1>Create Post</h1>

        <div className="inputGroup">
          <label htmlFor="">Category: </label>
          <select
            name="Category"
            id=""
            onChange={(event) => {
              setCategory(event.target.value);
            }}
          >
            <option value=""></option>
            <option value="FootBall">Football</option>
            <option value="Celebrity">Celebrity</option>
          </select>
        </div>

        <div className="inputGroup">
          <label htmlFor="">Title: </label> <br />
          <input
            type="text"
            placeholder="Title..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="">Post Description: </label> <br />
          <textarea
            type="text"
            placeholder="Post Description..."
            onChange={(event) => {
              setPostDescription(event.target.value);
            }}
          />
        </div>

        <div className="inputGroup">
          <input
            type="file"
            onChange={(event) => {
              setImage(event.target.files[0]);
            }}
          />
        </div>

        <div className="text-editor">
          <label htmlFor="">Post: </label> <br />

          <EditorToolbar />
          <ReactQuill
            value={postText.value}
            theme="snow"
            onChange={handlePostText}
            placeholder={"Write something awesome..."}
            modules={modules}
            formats={formats}
          />
        </div>

        <button onClick={uploadImage}>Submit Post</button>
      </div>
    </div>
  );
}

export default CreatePost;
