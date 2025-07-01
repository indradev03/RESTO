import React, { useState, useEffect } from 'react';
import '../../../css/AddProduct.css';

const API_URL = 'http://localhost:5000/api/products';

const getImageUrl = (imageUrlFromDB) => {
  if (!imageUrlFromDB) return 'https://via.placeholder.com/100';
  if (imageUrlFromDB.startsWith('/uploads/')) {
    return `http://localhost:5000${imageUrlFromDB}`;
  }
  return `http://localhost:5000/uploads/${imageUrlFromDB}`;
};

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const resetForm = () => {
    setProductName('');
    setDescription('');
    setPrice('');
    setFile(null);
    setEditId(null);
    setShowForm(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !price) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', description);
      formData.append('price', price);
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

      if (!res.ok) throw new Error('Failed to save product');
      await fetchProducts();
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setProductName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setEditId(product.id);
    setFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  return (
    <div className="add-product-container">
      <h2 className="page-title">Manage Products</h2>

      {!showForm && (
        <div className="add-button-container">
          <button onClick={handleAddNew} className="add-button">+ Add Product</button>
        </div>
      )}

      <div className="product-cards">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={getImageUrl(product.image_url)} alt={product.name} />
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

      {showForm && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <button className="modal-close-btn" onClick={resetForm}>&times;</button>
            <h2 className="addproducthoverlayheading">{editId ? 'Edit Product' : 'Add Product'}</h2>
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
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Product Image:</label>
                <input id="image" type="file" accept="image/*" onChange={handleFileChange} />
                {file && <p>Selected file: {file.name}</p>}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
