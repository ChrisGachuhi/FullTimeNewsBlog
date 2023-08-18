import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";

function sanitizeHTML(input) {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.body.innerHTML;
}

function Article() {
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const getArticle = async () => {
      try {
        const articleRef = doc(db, "BlogPosts", id);
        const articleSnapshot = await getDoc(articleRef);

        if (articleSnapshot.exists()) {
          setArticle({ id: articleSnapshot.id, ...articleSnapshot.data() });

          const category = articleSnapshot.data().category;
          const recommendationItems = []

          const recommendationQuery = query(
            collection(db, "BlogPosts"),
            where("category", "==", category, "&", "id", "!==", id)
          );

          const recommendationSnapshot = await getDocs(recommendationQuery);
          const filteredRecommendations = recommendationSnapshot.docs.filter((doc) => 
            doc.id !== id
          )

          filteredRecommendations.forEach((recommendationDoc) => {
            recommendationItems.push({
              id: recommendationDoc.id,
              ...recommendationDoc.data(),
            });
            console.log(recommendationDoc.data());
          });

          setRecommendations(recommendationItems);

        } else {
          console.log("Article not found");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    getArticle();

  }, [id, recommendations.id]);


  // const deletePost = async (id) => {
  //   const postDoc = doc(db, "BlogPosts", id);
  //   await deleteDoc(postDoc)
  //     .then(() => {
  //       // Remove the deleted post from the state instead of reloading
  //       setRecommendations((prevPosts) =>
  //         prevPosts.filter((post) => post.id !== id)
  //       );
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // };

  return (
    <div>
      <div className="ArticlePage">
        {article ? (
          <div className="postItem">
            <div className="postPreview">
              <div
                className="postBody"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHTML(article.postText.value),
                }}
              ></div>
            </div>

            <div className="postAuthor">
              <h3>By: {article.author.name}</h3>
              <h4>{article.timestamp}</h4>
            </div>
          </div>
        ) : (
          <p>Loading article...</p>
        )}

        <div className="postRecommendations">
          <h2>Related Articles</h2>
          {recommendations.map((recommendationDoc) => (
            <div className="recomendationItem" key={recommendationDoc.id}>
                  <div
                    className="recomendationImage"
                    style={{
                      backgroundImage: `url(${recommendationDoc.imageURL})`,
                    }}
                    onClick={() => navigate(`/Article/${recommendationDoc.id}`)}
              ></div>
              
                <div className="recomendationHeader">
                  <h3>{recommendationDoc.title}</h3>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Article;
