import React, { useEffect, useState } from 'react';
import '../../css/Menu.css';

const API_URL = 'http://localhost:5000/api/products';

// Helper to format Rs.
const formatPrice = (amount) => `Rs. ${parseFloat(amount).toLocaleString('en-IN')}`;

// Helper to resolve full image URL
const getImageUrl = (imageUrlFromDB) => {
  if (!imageUrlFromDB) return 'https://via.placeholder.com/100';
  if (imageUrlFromDB.startsWith('/uploads/')) {
    return `http://localhost:5000${imageUrlFromDB}`;
  }
  return `http://localhost:5000/uploads/${imageUrlFromDB}`;
};

// Reusable Menu Card
const MenuCard = ({ img, title, desc, price }) => (
  <div className="MenuSingleCard css-1w6wsy5">
    <img src={img} alt={title} loading="lazy" />
    <div className="css-1anx036">{title}</div>
    <p className="css-9l3uo3">{desc}</p>
    <div className="card-price css-1anx036">{formatPrice(price)}</div>
  </div>
);

const Menu = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="Menu-Container">
      <h6 className="first-title">Menu</h6>
      <h4 className="second-title">Discover Our Flavorful Symphony!</h4>

      <div className="Menu">
        <div className="Menu-Section">All Products</div>
        <div className="MenuSingleContainer">
          {products.map((product) => (
            <MenuCard
              key={product.id}
              img={getImageUrl(product.image_url)}
              title={product.name}
              desc={product.description}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
