import React, { useState } from "react";

const UploadImage = ({ setImgUrl,className = "file-input" }) => {
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "imagenes");

    const res = await fetch("https://api.cloudinary.com/v1_1/dh6o8kuiz/image/upload", {
      method: "POST",
      body: data,
    });

    const uploadRes = await res.json();

    setImageUrl(uploadRes.secure_url);

    // 🔥 Mandar URL al padre
    setImgUrl(uploadRes.secure_url);
  };

  return (
    <div>
      <input
        type="file"
        id="photos"
        onChange={handleUpload}
        accept="image/*"
        className={className}
      />

      {imageUrl && (
        <img
          src={imageUrl}
          alt="uploaded"
          className="uploaded-image"
        />
      )}
    </div>
  );
};

export default UploadImage;
