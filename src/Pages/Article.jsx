import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";

// FUNCTION TO SANITIZE HTML INPUT
function sanitizeHTML(input) {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.body.innerHTML;
}

// COMPONENT FOR DISPLAYING AN ARTICLE
function Article() {
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // GETTING ARTICLE ID FROM URL PARAMS
  const { id } = useParams();

  useEffect(() => {
    // FUNCTION TO FETCH ARTICLE DATA AND RECOMMENDATIONS
    const getArticle = async () => {
      try {
        // REFERENCE TO ARTICLE DOCUMENT
        const articleRef = doc(db, "BlogPosts", id);
        const articleSnapshot = await getDoc(articleRef);

        if (articleSnapshot.exists()) {
          // SETTING ARTICLE DATA TO STATE
          setArticle({ id: articleSnapshot.id, ...articleSnapshot.data() });

          const category = articleSnapshot.data().category;
          const recommendationItems = [];

          // QUERY TO FETCH RECOMMENDATIONS
          const recommendationQuery = query(
            collection(db, "BlogPosts"),
            where("category", "==", category),
            where("id", "!=", id) // Excluding the current article
          );

          const recommendationSnapshot = await getDocs(recommendationQuery);

          // FILTERING OUT THE CURRENT ARTICLE FROM RECOMMENDATIONS
          const filteredRecommendations = recommendationSnapshot.docs.filter(
            (doc) => doc.id !== id
          );

          // BUILDING RECOMMENDATIONS ARRAY
          filteredRecommendations.forEach((recommendationDoc) => {
            recommendationItems.push({
              id: recommendationDoc.id,
              ...recommendationDoc.data(),
            });
          });

          setRecommendations(recommendationItems);
        } else {
          console.log("Article not found");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    // CALLING THE FUNCTION TO FETCH ARTICLE AND RECOMMENDATIONS
    getArticle();
  }, [id]);

  // RENDERING THE ARTICLE AND RECOMMENDATIONS
  return (
    <div>
      <div className="ArticlePage">
        {article ? (
          // DISPLAYING THE ARTICLE
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
          // LOADING STATE IF ARTICLE DATA IS NOT YET AVAILABLE
          <p>Loading article...</p>
        )}

        <div className="postRecommendations">
          <h2>Related Articles</h2>
          {recommendations.map((recommendationDoc) => (
            // DISPLAYING RECOMMENDED ARTICLES
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
