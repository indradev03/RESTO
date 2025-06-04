// src/pages/AboutUs.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Welcome from '../../assets/Welcome.jpg';
import OurStory from '../../assets/ourstory.jpg';
import Offer from '../../assets/banner.jpg';
import celebration from '../../assets/celebration.jpg';
import Values from '../../assets/values.jpg';
import Joinus from '../../assets/joinus.jpg';
import '../../css/Aboutus.css';


const Aboutus = () => {
  return (
    <div>
      <div className="Aboutus-title">
        <h2>About Us</h2>
      </div>
      <div className='My'>
          <div className='page-width aboutUs'>
          {/* Section 1 - Welcome */}
          <div className='row-align-items-center'>
            <div className='col-md-7'>
              <h3>Welcome to Resto,Where Every Meal Feels Like Home</h3>
              <p>At Resto, we believe that the best moments in life are shared around 
                the table—with laughter, conversation, and comforting food that brings 
                people together. From casual weeknight dinners to special weekend outings,
                we’ve created a space where everyone feels welcome and every meal feels
                meaningful. Whether you're dining with your little ones, catching up with
                old friends, or celebrating a milestone, Resto is designed to make 
                your experience easy, enjoyable, and stress-free. We
                  know how busy life can get, which is why we’ve made reserving
                  a table simpler than ever. Our smart, easy-to-use reservation
                  system lets you book online, via mobile, or by text—giving 
                  you complete control over your dining schedule. No long waits,
                  no hassle—just the peace of mind that your table is ready when you are. </p>

                <p>At Resto, we’re not just serving meals—we’re creating memorable experiences. 
                  Because when it comes to great dining, it’s not just what’s 
                  on the plate that matters, but who you share it with.</p>
            </div>

            <div className="col-md-5">
              <img src= {Welcome} alt="Restaurant interior" />
            </div>
          </div>

          {/* Section 2 - Our Story */}
          <div className='row-align-items-center'>
            <div className="col-md-5">
              <img src= {OurStory} alt="Restaurant interior" />
            </div>
            <div className='col-md-7'>
              <h3>Our Story</h3>
              <p>Resto was born from a simple yet powerful idea: dining out should feel just as 
                comfortable and joyful as eating at home with loved ones. Inspired by the warmth of
                family traditions and the desire to bring people closer through food, we set out to 
                create a casual dining space where everyone—especially families—can enjoy delicious 
                meals together without the stress. From the beginning, our goal has been to make every
                guest feel welcome, relaxed, and cared for.</p>
  
                <p>That’s why we’ve paired our hearty, home-style 
                menu with a smart and easy-to-use reservation system, allowing you to plan your meal on your terms. 
                Whether it’s a weekday dinner with the kids, a special celebration, or a spontaneous get-together, 
                Resto offers the comfort, convenience, and connection that make dining out something to look forward to. 
                We’re proud to be part of your everyday moments and your unforgettable memories.</p>
            </div>
          </div>

          {/* Section 3 - What We Offer */}
          <div className='row-align-items-center'>
            <div className='col-md-7'>
              <h3>What We Offer</h3>
              <p>
                At Resto, we offer more than just a place to eat—we provide a dining experience built around comfort, 
                convenience, and family. Our casual dining atmosphere is warm, welcoming, and perfect for all ages.
                We’ve designed every detail with families in mind, including spacious seating for large groups, 
                high chairs, booster seats, stroller access, and engaging activities for kids like coloring sheets 
                and a kid-friendly menu. Our diverse menu caters to every taste, from hearty classics to vegetarian 
                and allergy-friendly options. We also make it easier than ever to plan your visit with our seamless 
                reservation system, available online, by text, or through our app—giving you full control and reducing 
                your wait time. Whether you’re here for a relaxed dinner, a quick lunch, or a celebration, we’re here to make sure your 
                experience is smooth and enjoyable. At Resto, every meal is made to bring people together.
              </p>
            </div>
            <div className="col-md-5">
              <img src= {Offer} alt="Table setup with kid-friendly items" />
            </div>
          </div>

          {/* Section 4 - Celebrations */}
          <div className='row-align-items-center'>
            <div className="col-md-5">
              <img src={celebration} alt="Birthday celebration at restaurant" />
            </div>
            <div className='col-md-7'>
              <h3>Celebrations Made Special</h3>
              <p>At Resto, we believe every special moment deserves to be celebrated in a warm and welcoming setting. 
                Whether you're planning a birthday, anniversary, graduation, or a family gathering, we’re here to make it 
                unforgettable. When you book with us, let us know the occasion—we’ll add thoughtful touches like personalized 
                service, festive table decorations, or a surprise treat to make your celebration even more meaningful. 
                Our spacious layout and group-friendly options ensure everyone enjoys the moment together. With delicious food, 
                friendly staff, and a cozy atmosphere, Resto is the perfect place to celebrate life’s best moments.
              </p>
            </div>
          </div>

          {/* Section 5 - Our Values */}
          <div className='row-align-items-center'>
            <div className='col-md-7'>
              <h3>Our Values</h3>
              <p>At Resto, we put family first in everything we do. We believe in creating a welcoming space where everyone 
                feels at home. Our commitment to quality means using fresh ingredients and timeless recipes. 
                We proudly support our local community and constantly innovate to improve your dining experience. 
                Above all, we value connection, comfort, and making every visit memorable for families and friends alike.</p>
            </div>
            <div className="col-md-5">
              <img src={Values} alt="Happy family at dinner table" />
            </div>
          </div>

          {/* Section 6 - Join Us */}
          <div className='row-align-items-center'>
            <div className="col-md-5">
              <img src={Joinus} alt="Smiling staff greeting guests" />
            </div>
            <div className='col-md-7'>
              <h3>Join Our Table</h3>
              <p>At Resto, every meal is more than just food—it’s a chance to connect, unwind, and 
                create lasting memories. Whether you’re planning a casual lunch, a family dinner, 
                or a special celebration, we’re here to make your experience warm, easy, and enjoyable. 
                With our simple reservation system available online and by text, booking a table is just a 
                few clicks away. Come as you are, bring the people you love, and let us take care of the rest. 
                At Resto, your table is always ready—and we can’t wait to welcome you.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Aboutus;
