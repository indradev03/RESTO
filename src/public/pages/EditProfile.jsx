    import React, { useState, useEffect } from 'react';
    import '../../css/EditProfile.css';

    const BACKEND_URL = 'http://localhost:5000';

    const EditProfile = () => {
    const userId = localStorage.getItem('userId');

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        contact: '',
        address: '',
        role: '',
        password: '',
        profile_image_url: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [imageUploading, setImageUploading] = useState(false);
    const [imageError, setImageError] = useState('');
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (!userId) {
        setError('User not logged in');
        setLoading(false);
        return;
        }

        const fetchUserData = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/users/${userId}`);
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
            throw new Error(`Expected JSON but got:\n${text.substring(0, 200)}`);
            }
            if (!res.ok) throw new Error('Failed to fetch user data');

                const data = await res.json();

            setUserData({
                name: data.user.name || '',
                email: data.user.email || '',
                contact: data.user.contact || '',
                address: data.user.address || '',
                role: data.user.role || '',
                password: '',
                profile_image_url: data.user.profile_image_url || '',
            });

            setImagePreview(
                data.user.profile_image_url
                    ? data.user.profile_image_url.startsWith('http')
                    ? data.user.profile_image_url
                    : BACKEND_URL + data.user.profile_image_url
                    : ''
                );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageError('');
    setImageUploading(true);

    // Preview locally
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    // Upload image to backend
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
        const res = await fetch(`${BACKEND_URL}/api/users/${userId}/profile-image`, {
        method: 'PUT',
        body: formData,
        });

        if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Image upload failed');
        }

        const data = await res.json();

        const fullImageUrl = data.imageUrl.startsWith('http')
        ? data.imageUrl
        : `${BACKEND_URL}${data.imageUrl}`;

        setUserData((prev) => ({ ...prev, profile_image_url: fullImageUrl }));
        localStorage.setItem('profile_image_url', fullImageUrl); // ✅ Save to localStorage

        setImagePreview(fullImageUrl);
        alert('Profile image updated!');
    } catch (err) {
        setImageError(err.message);
    } finally {
        setImageUploading(false);
    }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFormSubmitting(true);

        const updatePayload = {
        name: userData.name,
        contact: userData.contact,
        address: userData.address,
        role: userData.role,
        };
        if (userData.password.trim() !== '') {
        updatePayload.password = userData.password;
        }

        try {
        const res = await fetch(`${BACKEND_URL}/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatePayload),
        });

        if (!res.ok) throw new Error('Update failed');

        await res.json();
        alert('Profile updated successfully!');
        setUserData((prev) => ({ ...prev, password: '' }));
        } catch (err) {
        setError(err.message);
        } finally {
        setFormSubmitting(false);
        }
    };

    if (loading) return <div className="edit-profile-loading">Loading profile...</div>;
    if (error) return <div className="edit-profile-error">{error}</div>;

    return (
        <div className="edit-profile-container">
            <h2 className="edit-profile-title">Edit Profile</h2>

        <div className="profile-image-section">
        <div className="image-preview-wrapper">

            {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="profile-image-preview" />
            ) : (
                // Circular placeholder base with icon
                <div className="profile-image-preview placeholder">
                    <span role="img" aria-label="profile placeholder" style={{ fontSize: '64px', color: '#bbb' }}>
                        👤
                    </span>
                </div>
            )}
            <div className="edit-icon-overlay" onClick={() => document.getElementById('hiddenFileInput').click()}>
                <i className="fas fa-edit"></i>
            </div>
            <input
                type="file"
                id="hiddenFileInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
                disabled={imageUploading}
            />
        </div>
            {imageUploading && <p className="image-uploading-text">Uploading image...</p>}
            {imageError && <p className="image-error-text">{imageError}</p>}
        </div>


        <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="form-columns">
            <div className="form-column left-column">
                <div className="form-field name-field">
                <label htmlFor="name" className="field-label">
                    Name:
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    className="field-input"
                    value={userData.name}
                    onChange={handleChange}
                    required
                    disabled={formSubmitting}
                />
                </div>

                <div className="form-field contact-field">
                <label htmlFor="contact" className="field-label">
                    Contact:
                </label>
                <input
                    id="contact"
                    name="contact"
                    type="text"
                    className="field-input"
                    value={userData.contact}
                    onChange={handleChange}
                    disabled={formSubmitting}
                />
                </div>

                <div className="form-field role-field">
                <label htmlFor="role" className="field-label">
                    Role:
                </label>
                <input
                    id="role"
                    name="role"
                    type="text"
                    className="field-input"
                    value={userData.role}
                    readOnly
                />
                </div>
            </div>

            <div className="form-column right-column">
                <div className="form-field email-field">
                <label htmlFor="email" className="field-label">
                    Email (readonly):
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="field-input"
                    value={userData.email}
                    readOnly
                />
                </div>

                <div className="form-field address-field">
                <label htmlFor="address" className="field-label">
                    Address:
                </label>
                <input
                    id="address"
                    name="address"
                    type="text"
                    className="field-input"
                    value={userData.address}
                    onChange={handleChange}
                    disabled={formSubmitting}
                />
                </div>

                <div className="form-field password-field">
                <label htmlFor="password" className="field-label">
                    New Password:
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    className="field-input"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                    disabled={formSubmitting}
                />
                </div>
            </div>
            </div>

            <button
            type="submit"
            className="edit-profile-submit-btn"
            disabled={imageUploading || formSubmitting}
            >
            {formSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
        </form>
        </div>
    );
    };

    export default EditProfile;
