import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarSelector from './StarSelector';
import RatingSummary from './RatingSummary';
import { deleteReview, postData } from '../services/fetch.js';
import '../styles/RatingBox.css';
import AnimatedComment from './AnimatedComment';


const RatingBox = () => {
 const navigate = useNavigate();
 const [userRating, setUserRating] = useState(0);
 const [reviews, setReviews] = useState([]);
 const [showForm, setShowForm] = useState(false);
 const [comment, setComment] = useState('');
 const [loading, setLoading] = useState(true);
 const [user, setUser] = useState(null);
 const [openMenuId, setOpenMenuId] = useState(null);

 useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  setUser(storedUser);

  const fetchReviews = async () => {
   try {
    const token = localStorage.getItem('access_token');
    if (!token) {
     console.log('Usuario no autenticado, omitiendo carga de comentarios');
     setLoading(false);
     return;
    }
    console.log('Token encontrado en RatingBox:', token ? 'Sí' : 'No');
    const response = await fetch('http://127.0.0.1:8000/api/crear-comentario/', {
     method: 'GET',
     headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
     },
     credentials: 'include',
    });
    if (response.ok) {
     const comentarios = await response.json();
     const comentariosArray = Array.isArray(comentarios) ? comentarios : (comentarios.results || []);
     const reviewsFormateados = comentariosArray.map(comentario => ({
      id: comentario.id,
      rating: comentario.calificacion,
      comment: comentario.contenido,
      userName: comentario.usuario_nombre,
      userId: comentario.usuario,
      timestamp: comentario.fecha_creacion
     }));
     setReviews(reviewsFormateados);
    }
   } catch (error) {
    console.error('Error fetching reviews:', error);
   } finally {
    setLoading(false);
   }
  };

  fetchReviews();
 }, []);

 const handleRate = (rating) => {
  setUserRating(rating);
 };

 const submitRating = async () => {
  if (userRating > 0 && comment.trim() !== '' && user) {
   const newReview = {
    usuario: localStorage.getItem("id_usuario"),
    calificacion: userRating,
    contenido: comment.trim()
   };
   try {
    const peticion = await postData(newReview, "crear-comentario");
    const nuevoComentarioFormateado = {
     id: peticion.id,
     rating: peticion.calificacion,
     comment: peticion.contenido,
     userName: peticion.usuario_nombre,
     userId: peticion.usuario,
     timestamp: peticion.fecha_creacion
    };
    setReviews([nuevoComentarioFormateado, ...reviews]);
    setUserRating(0);
    setComment('');
    setShowForm(false);
    alert('Reseña enviada exitosamente');
   } catch (error) {
    alert('Error al enviar reseña: ' + error.message);
   }
  }
 };

 const deleteComment = async (id) => {
  if (!user) {
   alert('Debes iniciar sesión para eliminar comentarios');
   navigate('/login');
   return;
  }
  const usuarioId = localStorage.getItem('id_usuario');
  if (!usuarioId) {
   alert('Debes iniciar sesión para eliminar comentarios');
   return;
  }
  const review = reviews.find(r => r.id === id);
  if (!review) {
   alert('Comentario no encontrado');
   return;
  }
  if (review.userId !== parseInt(usuarioId)) {
   alert('No tienes permiso para eliminar esta reseña');
   return;
  }
  if (!window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
   return;
  }
  try {
   await deleteReview(id);
   const filteredReviews = reviews.filter(r => r.id !== id);
   setReviews(filteredReviews);
   alert('Reseña eliminada exitosamente');
  } catch (error) {
   console.error('Error eliminando reseña:', error);
   alert(error.message || 'Error al eliminar la reseña. Inténtalo de nuevo.');
  }
 };

 const safeReviews = Array.isArray(reviews) ? reviews : [];

 const ratings = safeReviews.reduce((acc, r) => {
  acc[r.rating] = (acc[r.rating] || 0) + 1;
  return acc;
 }, {});

 const total = safeReviews.length;
 const average = total > 0
  ? safeReviews.reduce((sum, r) => sum + r.rating, 0) / total
  : 0;

 if (loading) return <div>Cargando reseñas...</div>;

 return (
  <div className="container">
   <h2 className="heading">Califica Nuestro Sitio Web</h2>
   <p>{average.toFixed(1)} promedio basado en {total} reseñas.</p>

   {user ? (
    <button className="rate-button" onClick={() => setShowForm(true)}>
     Calificar Ahora
    </button>
   ) : (
    <button className="rate-button" onClick={() => navigate('/login')}>
     Inicia sesión para calificar
    </button>
   )}

   {showForm && user && (
    <div className="rating-form">
     <h3>Califica ReportaVías CR</h3>
     <StarSelector rating={userRating} onRate={handleRate} />
     <textarea
      placeholder="Deja un comentario"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      rows="3"
     />
     <div className="form-buttons">
      <button onClick={submitRating} disabled={userRating === 0 || comment.trim() === ''}>
       Enviar
      </button>
      <button onClick={() => setShowForm(false)}>Cancelar</button>
     </div>
    </div>
   )}

   <hr className="separator" />

   <RatingSummary ratings={ratings} total={total} />

   <div className="comments-section">
    <h3>Comentarios</h3>
    {safeReviews.length === 0 && <p>No hay comentarios aún.</p>}

    {safeReviews.length > 0 && (
     <div className="comments-list-container">
      <div className="comments-list">
       {safeReviews.map((review, idx) => (
        <AnimatedComment key={review.id}>
         <div className="comment-card">
          <div className="comment-header">
           <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
           <strong>{review.userName}</strong>
           <div className="menu-container">
            <button
             className="menu-button"
             onClick={() => setOpenMenuId(openMenuId === review.id ? null : review.id)}
            >
             ⋮
            </button>
            {openMenuId === review.id && (
             <div className="menu-dropdown">
              <button
               className="menu-item delete-item"
               onClick={() => {
                deleteComment(review.id);
                setOpenMenuId(null);
               }}
              >
               Eliminar
              </button>
             </div>
            )}
           </div>
          </div>
          <p className="comment-text">{review.comment}</p>
          <small>{new Date(review.timestamp).toLocaleDateString()}</small>
         </div>
        </AnimatedComment>
       ))}
      </div>
      <div className="top-gradient"></div>
     </div>
    )}
   </div>
  </div>
 );
};

export default RatingBox;