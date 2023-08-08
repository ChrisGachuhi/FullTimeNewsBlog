/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from '../firebaseConfig'
import { useNavigate } from "react-router";

function CreatePost({isAuth}) {
  const [title, setTitle] = useState('')
  const [postText, setPostText] = useState('')

  const postCollectionRef = collection(db, 'BlogPosts')

  const navigate = useNavigate()

  const createPost = async () => {
    await addDoc(postCollectionRef, {
      title,
      postText,
      author: {
        name: auth.currentUser.displayName,
        id: auth.currentUser.uid
      }

    }).then(() => {
      navigate('/')
      
    }).catch((error) => {
      console.log(error.message)
    })
  }

  useEffect(() => {
    if (!isAuth) {
      navigate('/Login')
    }
  }, [])


  return (
    <div className="CreatePostPage">
      <div className="postContainer">
        <h1>Create Post</h1>
        <div className="inputGroup">
          <label htmlFor="">Title: </label> <br />
          <input type="text" placeholder="Title..." onChange={(event) => {setTitle(event.target.value)}}/>
        </div>

        <div className="inputGroup">
          <label htmlFor="">Post: </label> <br />
          <textarea type="text" placeholder="Post..." onChange={(event) => {setPostText(event.target.value)}}/>
        </div>

        <button onClick={createPost}>Submit Post</button>
      </div>
    </div>
  );
}

export default CreatePost