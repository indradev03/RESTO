    import React, { useState } from 'react';
    import '../../../css/AddTable.css'; // Make sure to style accordingly

    const AddTable = () => {
    const [tables, setTables] = useState([]);
    const [tableName, setTableName] = useState('');
    const [seats, setSeats] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);
    const [file, setFile] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newTable = {
        id: editId || Date.now(),
        name: tableName,
        seats: parseInt(seats),
        location,
        description,
        image: file ? URL.createObjectURL(file) : 'https://via.placeholder.com/100',
        };

        if (editId) {
        setTables(tables.map((t) => (t.id === editId ? newTable : t)));
        } else {
        setTables([newTable, ...tables]);
        }

        resetForm();
    };

    const handleEdit = (table) => {
        setTableName(table.name);
        setSeats(table.seats);
        setLocation(table.location);
        setDescription(table.description || '');
        setEditId(table.id);
        setFile(null); // Avoid pre-filling file input
        setShowForm(true);
    };

    const handleDelete = (id) => {
        setTables(tables.filter((t) => t.id !== id));
    };

    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
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
            <button onClick={handleAddNew} className="add-button">+ Add Table</button>
            </div>
        )}

        <div className="table-cards">
            {tables.map((table) => (
            <div className="table-card" key={table.id}>
                <img src={table.image} alt={table.name} className="table-image" />
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
                <button className="modal-close-btn" onClick={resetForm}>&times;</button>
                <h2 className='addtableheading'>{editId ? 'Edit Table' : 'Add Table'}</h2>
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
                    <input id="image" type="file" accept="image/*" onChange={handleFileChange} />
                    {file && <p>Selected file: {file.name}</p>}
                </div>

                <button type="submit" className="submit-btn">
                    {editId ? 'Update Table' : 'Add Table'}
                </button>
                </form>
            </div>
            </div>
        )}
        </div>
    );
    };

    export default AddTable;
