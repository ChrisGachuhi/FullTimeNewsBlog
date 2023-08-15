import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { useParams } from "react-router-dom";

function sanitizeHTML(input) {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.body.innerHTML;
}

function Article() {
  const [article, setArticle] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getArticle = async () => {
      try {
        const articleRef = doc(db, "BlogPosts", id);
        const articleSnapshot = await getDoc(articleRef);

        if (articleSnapshot.exists()) {
          setArticle({ id: articleSnapshot.id, ...articleSnapshot.data() });
        } else {
          console.log("Article not found");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    getArticle();
  }, [id]);

  return (
    <div className="ArticlePage">
      {article ? (
        <div className="postItem">
          {/* <div
            className="postImage"
            style={{ backgroundImage: `url(${article.imageURL})` }}
          ></div> */}

          <div className="postAuthor">
            <h3>By: {article.author.name}</h3>
            <h4>{article.timestamp}</h4>
          </div>

          <div className="postPreview">
            <div
              className="postBody"
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(article.postText.value),
              }}
            ></div>
          </div>
        </div>
      ) : (
        <p>Loading article...</p>
      )}
    </div>
  );
}

export default Article;
