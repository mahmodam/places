import React, { useState, useEffect } from "react";

import "./PreviewImage.css";

function PreviewImage(props) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!props.file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(props.file);
  }, [props.file]);

  return (
    <div className="form-control">
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
      </div>
    </div>
  );
}

export default PreviewImage;
