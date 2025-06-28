import React, { useState } from 'react';
import '../../../css/AddProduct.css';
import { menuItems } from '../../../data/MenuData';

const AddProduct = () => {
  const [products, setProducts] = useState(menuItems);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      id: editId || Date.now(),
      name: productName,
      description,
      price: parseFloat(price),
      image: file ? URL.createObjectURL(file) : 'https://via.placeholder.com/100',
    };

    if (editId) {
      setProducts(products.map((p) => (p.id === editId ? newProduct : p)));
    } else {
     setProducts([newProduct, ...products]); // New product shown first
    }

    resetForm();
  };

  const handleEdit = (product) => {
    setProductName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setEditId(product.id);
    setFile(null);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const resetForm = () => {
    setProductName('');
    setDescription('');
    setPrice('');
    setFile(null);
    setEditId(null);
    setShowForm(false);
  };

  // Close modal if clicked outside form area
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      resetForm();
    }
  };

  return (
    <div className = 'add-product-container'>
      <h2 className="page-title">Manage Products</h2>

      {/* Add New Button */}
      {!showForm && (
        <div className="add-button-container">
          <button onClick={handleAddNew} className="add-button">+ Add Product</button>
        </div>
      )}
      
      {/* Product cards */}
      <div className="product-cards">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p>Rs. {product.price}</p>
            <div className="btn-group">
              <button onClick={() => handleEdit(product)}>Edit</button>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>



      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <button className="modal-close-btn" onClick={resetForm}>&times;</button>
            <h2 className='addproducthoverlayheading'>{editId ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="productName">Product Name:</label>
                <input
                  id="productName"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="4"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price:</label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Product Image:</label>
                <input id="image" type="file" accept="image/*" onChange={handleFileChange} />
                {file && <p>Selected file: {file.name}</p>}
              </div>

              <button type="submit" className="submit-btn">
                {editId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
