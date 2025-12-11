import { useState, useEffect } from 'react';
import { updateUser, getUserPhoto } from '../services/fetch.js';

export const usePFFormulario = (usuarioActual) => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        phone: '',
        location: '',
        birthDate: '',
        gender: 'male'
    });

    const [photoPreview, setPhotoPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // ================================
    //    CARGAR DATOS DEL USUARIO
    // ================================
    useEffect(() => {
        async function cargarUsuario() {
            // 1) Preferir el usuario recibido por props (desde ProfileLayout)
            if (usuarioActual && usuarioActual.id) {
                setUser(usuarioActual);

                setFormData({
                    name: usuarioActual.name || usuarioActual.username || '',
                    email: usuarioActual.email || '',
                    bio: usuarioActual.bio || 'Hola, me encanta programar y aprender cosas nuevas.',
                    phone: usuarioActual.phone || '',
                    location: usuarioActual.location || '',
                    birthDate: usuarioActual.birthDate || '',
                    gender: usuarioActual.gender || 'male'
                });

                if (usuarioActual.id) {
                    const userPhoto = await getUserPhoto(usuarioActual.id);
                    setPhotoPreview(userPhoto || '');
                }
                return;
            }

            // 2) Como fallback, usar lo que haya en localStorage
            const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
            if (storedUser) {
                setUser(storedUser);

                setFormData({
                    name: storedUser.name || storedUser.username || '',
                    email: storedUser.email || '',
                    bio: storedUser.bio || 'Hola, me encanta programar y aprender cosas nuevas.',
                    phone: storedUser.phone || '',
                    location: storedUser.location || '',
                    birthDate: storedUser.birthDate || '',
                    gender: storedUser.gender || 'male'
                });

                if (storedUser.id) {
                    const userPhoto = await getUserPhoto(storedUser.id);
                    setPhotoPreview(userPhoto || '');
                }
            }
        }

        cargarUsuario();
    }, [usuarioActual]);

    // ================================
    //           INPUT NORMAL
    // ================================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        setSuccess('');
    };

    // ================================
    //   🔥 FOTO DESDE CLOUDINARY
    //   (Recibe SOLO UNA URL)
    // ================================
    const handlePhotoChange = (url) => {
        setPhotoPreview(url);
        setError('');
        setSuccess('');
    };

    // ================================
    //   ELIMINAR FOTO
    // ================================
    const handleRemovePhoto = () => {
        setPhotoPreview('');
    };

    // ================================
    //   SUBMIT DEL FORMULARIO
    // ================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError('');
        setSuccess('');

        const updateData = {
            ...formData,
            photo: photoPreview
        };

        try {
            const updatedUser = await updateUser(user.id, updateData);

            if (updatedUser) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setSuccess('Perfil actualizado exitosamente');
            } else {
                setError('Error al actualizar perfil');
            }
        } catch (error) {
            setError('Error al actualizar: ' + error.message);
        }

        setLoading(false);
    };

    return {
        user,
        formData,
        photoPreview,
        loading,
        error,
        success,
        handleInputChange,
        handlePhotoChange,   // <=== IMPORTANTE
        handleRemovePhoto,
        handleSubmit
    };
};
