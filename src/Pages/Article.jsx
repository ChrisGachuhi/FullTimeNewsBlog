import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { useParams } from "react-router-dom";

function Article() {
  const [article, setArticle] = useState(null);

  const { id } = useParams()
  // console.log(id)

  useEffect(() => {

    const getArticle = async () => {
      const articleDoc = query(collection(db, "BlogPosts"), where("docKey", "==", id))
      let articleItem = []

      const querySnapshot = await getDocs(articleDoc)

      querySnapshot.forEach((articleDoc) => {
        articleItem.push({ ...articleDoc.data(), id: doc.id });
        setArticle([...articleItem])
        // console.log(article)
      })

    }
    getArticle()
  },[])

  return (
    <div className="HomePage">
      <div className="BlogList">
        {article.map((articleItem) => (
          <div className="postItem" key={articleItem.docKey}>
            <div
              className="postImage"
              style={{ backgroundImage: `url(${articleItem.imageURL})` }}
            ></div>

            <div className="postPreview">
              <div className="postHeader">
                <h1>{articleItem.title}</h1>
              </div>

              <div className="postBody">
                <p>{articleItem.postDescription}</p>
              </div>
              <div className="postAuthor">
                <h3>By: {articleItem.author.name}</h3>
                <h4>{articleItem.author.timestamp}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Article;
