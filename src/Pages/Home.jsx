/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";

function Home({ isAuth }) {
  const [postsList, setPostsList] = useState([]);

  useEffect(() => {
    const postCollectionRef = collection(db, "BlogPosts");
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);

      // console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      setPostsList(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    };

    getPosts();
  }, []);

  const deletePost = async (id) => {
    const postDoc = doc(db, "BlogPosts", id);
    await deleteDoc(postDoc)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="HomePage">
      <div className="BlogList">
        {postsList.map((post) => (
          <div className="postItem" key={Math.random()}>
            <div
              className="postImage"
              style={{ backgroundImage: `url(${post.imageURL})` }}
            >
              {/* <img src={post.imageURL} alt="" /> */}
            </div>

            <div className="postPreview">
              <div className="postHeader">
                <h1>{post.title}</h1>
                <div className="deletePost">
                  {isAuth && post.author.id === auth.currentUser.uid && (
                    <button
                      onClick={() => {
                        deletePost(post.id);
                      }}
                    >
                      &#128465;
                    </button>
                  )}
                </div>
              </div>

              <div className="postBody">
                {/* <p>{post.postText}</p> */}
                <p>{post.postDescription}</p>
              </div>
              <div className="postAuthor">
                <h3>By: {post.author.name}</h3>
                <h4>{post.author.timestamp}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
