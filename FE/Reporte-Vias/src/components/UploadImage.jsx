import React, { useState, useRef } from "react";
import { Camera } from "lucide-react";

const UploadImage = ({ setImgUrl, className = "file-input" }) => {
  const [imageUrl, setImageUrl] = useState("");
  const inputRef = useRef(null);

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

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div>
      <button
        type="button"
        className={className}
        onClick={handleButtonClick}
      >
        <Camera size={18} />
        {imageUrl ? "Cambiar foto" : "Subir foto"}
      </button>

      <input
        ref={inputRef}
        type="file"
        id="photos"
        onChange={handleUpload}
        accept="image/*"
        style={{ display: "none" }}
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
