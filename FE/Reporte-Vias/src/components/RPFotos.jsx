import React from 'react';
import { Cctv } from 'lucide-react';
import UploadImage from './UploadImage';

const RPFotos = ({ onFileChange, selectedFiles, addImageUrl }) => {
  return (
    <section className="form-section">
      <h2 className="section-title">
        <Cctv className="section-icon" /> Fotos del Problema
      </h2>

      <div className="file-upload">

        {/* 🔥 Pasamos la función al UploadImage */}
        <UploadImage setImgUrl={addImageUrl} />

        <label htmlFor="photos" className="file-label">
          Haz clic para subir fotos o arrastra aquí
        </label>

        {selectedFiles.length > 0 && (
          <p className="file-count">
            {selectedFiles.length} foto(s) seleccionada(s)
          </p>
        )}
      </div>
    </section>
  );
};

export default RPFotos;
