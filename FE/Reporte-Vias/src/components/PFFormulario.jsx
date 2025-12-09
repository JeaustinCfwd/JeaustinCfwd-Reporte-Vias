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
        website: '',
        birthDate: '',
        gender: 'male'
    });
    const [photoPreview, setPhotoPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (storedUser) {
            setUser(storedUser);
            setFormData({
                name: storedUser.name || '',
                email: storedUser.email || '',
                bio: storedUser.bio || 'Hola, me encanta programar y aprender cosas nuevas.',
                phone: storedUser.phone || '',
                location: storedUser.location || '',
                website: storedUser.website || '',
                birthDate: storedUser.birthDate || '',
                gender: storedUser.gender || 'male'
            });
            if (storedUser.id) {
                const userPhoto = getUserPhoto(storedUser.id);
                setPhotoPreview(userPhoto || '');
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        setSuccess('');
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setPhotoPreview('');
    };

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
        handlePhotoChange,
        handleRemovePhoto,
        handleSubmit
    };
};
