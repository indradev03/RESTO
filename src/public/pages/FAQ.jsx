import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    question: "How do I book a table at Resto?",
    answer: "You can book a table through our website or mobile app by selecting your preferred date, time, number of guests, and table. You'll receive a confirmation once your booking is successful.",
  },
  {
    question: "Is advance booking necessary?",
    answer: "Advance booking is highly recommended, especially during weekends or holidays, to guarantee availability. However, we also accept walk-ins based on table availability.",
  },
  {
    question: "Can I modify or cancel my reservation?",
    answer: "Yes, you can edit or cancel your booking through the booking dashboard. Just log in, find your booking, and click on “Modify” or “Cancel.” Please do so at least 1 hour before your reservation time.",
  },
  {
    question: "How will I know my booking is confirmed?",
    answer: "Once you complete the booking process, a confirmation message and email will be sent to you. You can also view your booking details in your profile.",
  },
  {
    question: "Is there a booking fee?",
    answer: "No, booking a table at Resto is completely free.",
  },
  {
    question: "Can I book multiple tables at once?",
    answer: "Each booking is limited to one table. For group bookings or events, please contact us directly.",
  },
  {
    question: "What if I'm running late?",
    answer: "We hold your reserved table for 15 minutes past your booking time. After that, it may be released for walk-in guests.",
  },
  {
    question: "Do you accept same-day bookings?",
    answer: "Yes, same-day bookings are accepted based on table availability.",
  },
  {
    question: "Is there a guest limit?",
    answer: "You can book for 1 to 10 guests online. For larger parties, please contact us.",
  },
  {
    question: "Can I request a specific table or area?",
    answer: "Yes, you can add special requests while booking. We’ll try our best to accommodate them based on availability.",
  },
  {
    question: "Do I need an account to book?",
    answer: "Yes, signing up allows you to manage your bookings and receive updates.",
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes. Your data is encrypted and stored securely. We respect your privacy.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              {item.question}
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </div>
            {openIndex === index && <div className="faq-answer">{item.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
