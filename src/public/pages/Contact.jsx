import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-wrapper">
      <h2 className="contact-heading">Get in Touch</h2>
      <p className="contact-subtext">
        Have questions or suggestions? We're here to help. Reach out to us or fill out the form below.
      </p>

      <div className="contact-grid">
        <div className="contact-left">
          <form className="contact-form">
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Enter your name" required />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" required />
            </div>

            <div className="input-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" placeholder="Write your message..." required></textarea>
            </div>

            <button type="submit" className="contact-submit">Send Message</button>
          </form>
        </div>

        <div className="contact-right">
          <div className="contact-details">
            <p><strong>📞 Phone:</strong> +977-9845441519</p>
            <p><strong>📧 Email:</strong> support@restoapp.com</p>
            <p><strong>📍 Address:</strong> Resto HQ, Kathmandu, Nepal</p>
          </div>

          <div className="contact-map">
            <iframe
              title="Resto Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2793157512286!2d85.31630577526616!3d27.706900125427733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb197b7038a1a5%3A0x230dfdf03e29d8b0!2sKathmandu%20Durbar%20Square!5e0!3m2!1sen!2snp!4v1711234567890"
              width="100%"
              height="220"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
