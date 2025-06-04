import React from 'react';
import '../../css/Menu.css';

// Import all images from assets
import breakfast1 from '../../assets/breakfast1.029174cee5bc3d9aada4.png';
import breakfast2 from '../../assets/breakfast2.659ea00738d60d82f5ed.png';
import breakfast3 from '../../assets/breakfast3.0fee32eac2d04e7aab56.png';
import breakfast4 from '../../assets/breakfast4.55e7035191413e587446.png';
import breakfast5 from '../../assets/breakfast5.c104e2cf5d2b3f929475.png';
import lunch1 from '../../assets/lunch1.1e64546f724cbd988498.png';
import lunch2 from '../../assets/lunch2.5f01f1ce4ad4a63c1027.png';
import lunch3 from '../../assets/lunch3.0ad7af348a05466d0c6d.png';
import lunch4 from '../../assets/lunch4.bc2a5b5c88f346ec99ba.png';
import lunch5 from '../../assets/lunch5.6e0cce8e11b0158a2227.png';
import dinner1 from '../../assets/dinner1.cdc7380300f22917664e.png';
import dinner2 from '../../assets/dinner2.897df94a0a8614d806a0.png';
import dinner3 from '../../assets/dinner3.336624e45be95b3f88e8.png';
import dinner4 from '../../assets/dinner4.840c360b46f319dc4c43.png';
import dinner5 from '../../assets/dinner5.1b3871b6556dcdb520e3.png';

// Function to format price in Nepali Rupees
const formatPrice = (amount) => {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
};


// Reusable Menu Card component
const MenuCard = ({ img, title, desc, price }) => (
  <div className="MenuSingleCard css-1w6wsy5">
    <img src={img} alt={title} loading="lazy" />
    <div className="css-1anx036">{title}</div>
    <p className="css-9l3uo3">{desc}</p>
    <div className="card-price css-1anx036">{formatPrice(price)}</div>
  </div>
);

const Menu = () => {
  return (
    <div className="Menu-Container">
      <h6 className="first-title">Menu</h6>
      <h4 className="second-title">Discover Our Flavorful Symphony!</h4>

      <div className="Menu">
        {/* Desserts */}
        <div className="Menu-Section">Desserts</div>
        <div className="MenuSingleContainer">
          <MenuCard img={breakfast1} title="Chocolate Lava Cake" desc="Warm chocolate cake with a gooey molten center, served with vanilla ice cream." price={450} />
          <MenuCard img={breakfast2} title="Tiramisu" desc="Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cheese." price={699} />
          <MenuCard img={breakfast3} title="Fruit Tart" desc="Buttery tart shell filled with custard and topped with fresh seasonal fruits." price={699} />
        </div>

        {/* Entrees */}
        <div className="Menu-Section">Entrees</div>
        <div className="MenuSingleContainer">
          <MenuCard img={breakfast4} title="Steak" desc="A juicy grilled steak served with garlic mashed potatoes and seasonal vegetables." price={999} />
          <MenuCard img={lunch1} title="Grilled Chicken" desc="Tender grilled chicken breast marinated in herbs and spices." price={750} />
          <MenuCard img={breakfast5} title="Salmon" desc="Pan-seared salmon fillet served with lemon butter sauce." price={880} />
        </div>

        {/* Appetizers */}
        <div className="Menu-Section">Appetizers</div>
        <div className="MenuSingleContainer">
          <MenuCard img={lunch2} title="Sampler Platter" desc="A delicious assortment of mini spring rolls, chicken wings, and mozzarella sticks." price={590} />
          <MenuCard img={lunch3} title="Bruschetta" desc="Toasted baguette slices topped with fresh tomatoes, basil, and balsamic glaze." price={480} />
          <MenuCard img={lunch4} title="Spinach Dip" desc="Creamy spinach and artichoke dip served with tortilla chips." price={550} />
        </div>

        {/* Pasta */}
        <div className="Menu-Section">Pasta</div>
        <div className="MenuSingleContainer">
          <MenuCard img={lunch5} title="Spaghetti Carbonara" desc="Classic pasta with eggs, cheese, pancetta, and pepper." price={720} />
          <MenuCard img={dinner1} title="Penne Primavera" desc="Penne pasta tossed with fresh vegetables in a light olive oil and garlic sauce." price={690} />
          <MenuCard img={dinner2} title="Chicken Alfredo" desc="Grilled chicken and fettuccine pasta in a rich alfredo sauce." price={710} />
        </div>

        {/* Salads */}
        <div className="Menu-Section">Salads</div>
        <div className="MenuSingleContainer">
          <MenuCard img={dinner3} title="Caesar Salad" desc="Crisp romaine lettuce, croutons, and parmesan cheese with Caesar dressing." price={480} />
          <MenuCard img={dinner4} title="Greek Salad" desc="Fresh cucumbers, tomatoes, olives, and feta cheese in olive oil dressing." price={510} />
          <MenuCard img={dinner5} title="Caprese Salad" desc="Slices of ripe tomatoes, fresh mozzarella, and basil with balsamic glaze." price={490} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
