    import React, { useState, useEffect } from 'react';
    import '../../../css/AddTable.css';

    const API_URL = 'http://localhost:5000/api/tables'; // Change if your backend URL differs

    // Helper function to build correct image URL
    const getImageUrl = (imageUrlFromDB) => {
    if (!imageUrlFromDB) return 'https://via.placeholder.com/100';

    if (imageUrlFromDB.startsWith('/uploads/')) {
        return `http://localhost:5000${imageUrlFromDB}`;
    }
    return `http://localhost:5000/uploads/${imageUrlFromDB}`;
    };

    const AddTable = () => {
    const [tables, setTables] = useState([]);
    const [tableName, setTableName] = useState('');
    const [seats, setSeats] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);
    const [file, setFile] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch tables from backend on load
    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTables(data);
        } catch (error) {
        console.error('Failed to fetch tables:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const resetForm = () => {
        setTableName('');
        setSeats('');
        setLocation('');
        setDescription('');
        setEditId(null);
        setFile(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tableName || !seats || !location) {
        alert('Please fill all required fields');
        return;
        }

        setLoading(true);

        try {
        const formData = new FormData();
        formData.append('name', tableName);
        formData.append('seats', seats);
        formData.append('location', location);
        formData.append('description', description);
        if (file) formData.append('image', file);

        let res;
        if (editId) {
            // Update table - you'll need to implement PUT in backend
            res = await fetch(`${API_URL}/${editId}`, {
            method: 'PUT',
            body: formData,
            });
        } else {
            // Add new table
            res = await fetch(API_URL, {
            method: 'POST',
            body: formData,
            });
        }

        if (!res.ok) throw new Error('Failed to save table');

        await fetchTables(); // reload table list
        resetForm();
        } catch (err) {
        alert(err.message);
        } finally {
        setLoading(false);
        }
    };

    const handleEdit = (table) => {
        setTableName(table.name);
        setSeats(table.seats);
        setLocation(table.location);
        setDescription(table.description || '');
        setEditId(table.id);
        setFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this table?')) return;

        try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete table');

        setTables(tables.filter((t) => t.id !== id));
        } catch (error) {
        alert(error.message);
        }
    };

    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modal-overlay') {
        resetForm();
        }
    };

    return (
        <div className="add-table-container">
        <h2 className="table-page-title">Manage Tables</h2>

        {!showForm && (
            <div className="add-button-Table-container">
            <button onClick={handleAddNew} className="add-button">
                + Add Table
            </button>
            </div>
        )}

        <div className="table-cards">
            {tables.map((table) => (
            <div className="table-card" key={table.id}>
                <img
                src={getImageUrl(table.image_url)}
                alt={table.name}
                className="table-image"
                />
                <h4>{table.name}</h4>
                <p>Seats: {table.seats}</p>
                <p>Location: {table.location}</p>
                <p>Description: {table.description}</p>
                <div className="btn-group">
                <button onClick={() => handleEdit(table)}>Edit</button>
                <button onClick={() => handleDelete(table.id)}>Delete</button>
                </div>
            </div>
            ))}
        </div>

        {showForm && (
            <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="modal-close-btn" onClick={resetForm}>
                &times;
                </button>
                <h2 className="addtableheading">{editId ? 'Edit Table' : 'Add Table'}</h2>
                <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="tableName">Table Name:</label>
                    <input
                    id="tableName"
                    type="text"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="seats">Number of Seats:</label>
                    <input
                    id="seats"
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    required
                    min="1"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Add a description for the table"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Table Image:</label>
                    <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    />
                    {file && <p>Selected file: {file.name}</p>}
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Saving...' : editId ? 'Update Table' : 'Add Table'}
                </button>
                </form>
            </div>
            </div>
        )}
        </div>
    );
    };

    export default AddTable;
