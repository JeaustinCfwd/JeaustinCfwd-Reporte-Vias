import { useState, useEffect } from 'react';
import { updateUser, getUserPhoto, patchData } from '../services/fetch.js';

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
            // Usaremos 'usuarioActual' si existe, si no, intentaremos desde localStorage.
            const userSource = (usuarioActual && usuarioActual.id)
                ? usuarioActual
                : JSON.parse(localStorage.getItem('user') || 'null');

            if (userSource) {
                setUser(userSource);

                // 1. SOLUCIÓN: Asegurarnos de que ningún valor sea null o undefined.
                // Si un valor no existe en userSource, el `|| ''` lo inicializa como string vacío.
                setFormData({
                    username: userSource.username || '',
                    email: userSource.email || '',
                    bio: userSource.bio || '',
                    phone: userSource.phone || '',
                    location: userSource.location || '',
                    birth_date: userSource.birth_date || '',
                    gender: userSource.gender || ''
                });

                // Cargar la foto del perfil si no se ha cargado antes.
                if (userSource.id && !photoPreview) {
                    const userPhoto = await getUserPhoto(userSource.id);
                    setPhotoPreview(userPhoto || '');
                }
            }
        }

        cargarUsuario();
    }, [usuarioActual]); // El efecto se ejecuta cuando 'usuarioActual' cambia.

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        setSuccess('');
    };

    // ================================
    //   FOTO DESDE CLOUDINARY
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
    const handleRemovePhoto = async () => {
        try {
            const userId = localStorage.getItem('id_usuario');
            if (!userId) return;

            // Intentamos usar updateUser (el mismo del formulario) y enviar 'imagen_perfil: null'
            // Enviamos también el resto de la data por si es un PUT que requiere todo
            await updateUser(userId, {
                ...formData,
                imagen_perfil: null
            });

            // Luego limpiamos el estado local
            setPhotoPreview('');
            setSuccess('Foto de perfil eliminada exitosamente');
        } catch (error) {
            console.error("Error al eliminar la foto de perfil:", error);
            setError('Error al eliminar la foto de perfil: ' + error.message);
        }
    };

    // ================================
    //   SUBMIT DEL FORMULARIO
    // ================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Obtiene el ID directamente desde localStorage.
        const userId = localStorage.getItem('id_usuario');

        // 2. Si no hay ID, detiene la ejecución y muestra un error.
        if (!userId) {
            setError("No se pudo encontrar el ID del usuario para actualizar.");
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const updateData = {
            ...formData,
            imagen_perfil: photoPreview
        };

        try {
            // 3. Usa el ID correcto para la llamada a la API.
            const updatedUser = await updateUser(userId, updateData);

            if (updatedUser) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setSuccess('Perfil actualizado exitosamente');
            } else {
                setError('Error al actualizar el perfil. La respuesta no fue la esperada.');
            }
        } catch (error) {
            console.error("Error en handleSubmit:", error);
            setError('Error al conectar con el servidor: ' + error.message);
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