import React, { useState } from 'react';
import './contact.css';

function Contact() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Marketing');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:aaronadams62@outlook.com?subject=${encodeURIComponent(`Portfolio Inquiry - ${subject}`)}&body=${encodeURIComponent(`Name: ${name}\n\nMessage: ${message}`)}`;
    window.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="contact">
      <div className="contact__content">
        <h2 className="contact__title">Contact Me</h2>
        <p className="contact__intro">
          Interested in working together? Select a topic and send me an email directly.
        </p>
        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="contact__form-group">
            <label htmlFor="subject">Interested In</label>
            <select
              name="subject"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="contact__select"
            >
              <option value="Marketing">Marketing Strategy</option>
              <option value="Web Development">Web Development</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="contact__form-group">
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="contact__form-submit">
            Open Email Client
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;