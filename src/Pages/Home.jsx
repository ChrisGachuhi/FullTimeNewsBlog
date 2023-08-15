/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router";

function Home({ isAuth }) {
  const [postsList, setPostsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const postCollectionRef = collection(db, "BlogPosts");
    const getPosts = async () => {
      const articleItems = []; // Changed variable name for clarity
      const querySnapshot = await getDocs(postCollectionRef);

      querySnapshot.forEach((articleDoc) => {
        articleItems.push({ id: articleDoc.id, ...articleDoc.data() });
      });

      setPostsList(articleItems); // Moved the state update outside the loop

    };

    getPosts();
  }, []);

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
                    articleDoc.author.authorId == auth.currentUser.uid && (
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
