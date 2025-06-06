/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { useNavigate } from "react-router";

function Home({ isAuth }) {
  // STATE TO STORE LIST OF POSTS
  const [postsList, setPostsList] = useState([]);
  const navigate = useNavigate();

  // EFFECT TO FETCH AND SET LIST OF POSTS
  useEffect(() => {
    const postCollectionRef = collection(db, "BlogPosts");
    const getPosts = async () => {
      const articleItems = []; // Changed variable name for clarity
      const querySnapshot = await getDocs(
        query(
          postCollectionRef,
          orderBy("timestamp", "desc") // Order by timestamp in descending order
        )
      );

      querySnapshot.forEach((articleDoc) => {
        articleItems.push({ id: articleDoc.id, ...articleDoc.data() });
      });

      setPostsList(articleItems); // Moved the state update outside the loop
    };

    getPosts();
  }, []);

  // FUNCTION TO DELETE A POST
  const deletePost = async (id) => {
    const postDoc = doc(db, "BlogPosts", id);
    await deleteDoc(postDoc)
      .then(() => {
        // Remove the deleted post from the state instead of reloading
        setPostsList((prevPosts) => prevPosts.filter((post) => post.id !== id));
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="HomePage">
      <div className="BlogList">
        {postsList.map((articleDoc) => (
          <div className="postItem" key={articleDoc.id}>
            <div
              className="postImage"
              style={{ backgroundImage: `url(${articleDoc.imageURL})` }}
              onClick={() => navigate(`/Article/${articleDoc.id}`)}
            ></div>

            <div className="postPreview">
              <div className="postHeader">
                <h1>{articleDoc.title}</h1>
                <div className="deletePost">
                  {isAuth &&
                    articleDoc.author.authorId ==
                      (auth.currentUser.uid ||
                        auth.currentUser.uid ==
                          "ox7xbHssC8R0shI3jXXXWiBUvmF2") && (
                      <button
                        onClick={() => {
                          deletePost(articleDoc.id);
                        }}
                      >
                        &#128465;
                      </button>
                    )}
                </div>
              </div>

              <div className="postBody">
                <p>{articleDoc.postDescription}</p>
              </div>

              <div className="postAuthor">
                <h3>By: {articleDoc.author.name}</h3>
                <h4>{articleDoc.author.timestamp}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
