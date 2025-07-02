    import React, { useState, useEffect } from 'react';
    import '../../../css/AddTable.css';

    const API_URL = 'http://localhost:5000/api/tables';

    const getImageUrl = (imageUrlFromDB) => {
    if (!imageUrlFromDB) return 'https://via.placeholder.com/100';
    if (imageUrlFromDB.startsWith('/uploads/')) {
        return `http://localhost:5000${imageUrlFromDB}`;
    }
    return `http://localhost:5000/uploads/${imageUrlFromDB}`;
    };

    const AddTable = () => {
    const [tables, setTables] = useState([]);
    const [tableNo, setTableNo] = useState('');
    const [seats, setSeats] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Available');
    const [editId, setEditId] = useState(null);
    const [file, setFile] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        setFetchError(null);
        try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch tables');
        const data = await res.json();
        setTables(data);
        } catch (error) {
        console.error('Failed to fetch tables:', error);
        setFetchError(error.message);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const resetForm = () => {
        setTableNo('');
        setSeats('');
        setLocation('');
        setDescription('');
        setStatus('Available');
        setEditId(null);
        setFile(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tableNo || !seats || !location) {
        alert('Please fill all required fields');
        return;
        }

        setLoading(true);

        try {
        const formData = new FormData();
        formData.append('name', tableNo); // backend expects field 'name'
        formData.append('seats', seats);
        formData.append('location', location);
        formData.append('description', description);
        formData.append('status', status);
        if (file) formData.append('image', file);

        let res;
        if (editId) {
            res = await fetch(`${API_URL}/${editId}`, {
            method: 'PUT',
            body: formData,
            });
        } else {
            res = await fetch(API_URL, {
            method: 'POST',
            body: formData,
            });
        }

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to save table');
        }

        await fetchTables();
        resetForm();
        } catch (err) {
        alert(err.message);
        } finally {
        setLoading(false);
        }
    };

    const handleEdit = (table) => {
        setTableNo(table.name); // backend field 'name' stores table no
        setSeats(table.seats);
        setLocation(table.location);
        setDescription(table.description || '');
        setStatus(table.status || 'Available');
        setEditId(table.table_id); // changed from table.id to table.table_id
        setFile(null);
        setShowForm(true);
    };

    const handleDelete = async (tableId) => {
        if (!window.confirm('Are you sure you want to delete this table?')) return;

        try {
        const res = await fetch(`${API_URL}/${tableId}`, { method: 'DELETE' });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to delete table');
        }
        setTables(tables.filter((t) => t.table_id !== tableId));
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

        {fetchError && <p className="error">Error: {fetchError}</p>}

        <div className="table-cards">
            {tables.map((table) => (
            <div className="table-card" key={table.table_id}>
                <img
                src={getImageUrl(table.image_url)}
                alt={table.name}
                className="table-image"
                />
                <h4>{table.name}</h4>
                <p>Seats: {table.seats}</p>
                <p>Location: {table.location}</p>
                <p>Description: {table.description}</p>
                <p>
                Status: <strong>{table.status}</strong>
                </p>
                <div className="btn-group">
                <button onClick={() => handleEdit(table)}>Edit</button>
                <button onClick={() => handleDelete(table.table_id)}>Delete</button>
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
                    <label htmlFor="tableNo">Table No:</label>
                    <input
                    id="tableNo"
                    type="text"
                    value={tableNo}
                    onChange={(e) => setTableNo(e.target.value)}
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
                    <label htmlFor="status">Status:</label>
                    <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                    >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    </select>
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
                    {loading ? (editId ? 'Updating...' : 'Saving...') : editId ? 'Update Table' : 'Add Table'}
                </button>
                </form>
            </div>
            </div>
        )}
        </div>
    );
    };

    export default AddTable;
