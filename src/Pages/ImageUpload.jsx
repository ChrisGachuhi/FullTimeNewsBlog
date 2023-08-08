import { useEffect, useState } from "react";
import { storage } from "../firebaseConfig";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

function ImageUpload() {
  const [image, setImage] = useState();
  const [imageList, setImageList] = useState([]);

  const imageListRef = ref(storage, "images/");

  const uploadImage = () => {
    if (image == null) return;

    const imageRef = ref(storage, `images/${image.name + v4()}`);
    // use npm i firebase uuid to install uuid library; allow us to name each file upload with a unique identifier

    uploadBytes(imageRef, image).then((snapshot) => {
      console.log(snapshot);
      
    });
  };

  useEffect(() => {
    listAll(imageListRef).then((response) => {
      console.log(response);

      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev) => [...prev, url]);
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <input
        type="file"
        onChange={(event) => {
          setImage(event.target.files[0]);
        }}
      />
      <button onClick={uploadImage}>Submit</button>

      {imageList.map((url) => (
        <img key={Math.random()} src={url} />
      ))}
    </div>
  );
}

export default ImageUpload;
