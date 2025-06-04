// src/components/ContactSection.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactSection.css';

function ContactSection() {
    const [feedbackData, setFeedbackData] = useState({ name: '', email: '', message: '' });
    const [formMessage, setFormMessage] = useState('');

    const handleChange = (e) => {
        setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        setFormMessage('Sending...');
        // Here you would typically send the feedbackData to your backend API
        // For example:
        // try {
        //     await api.submitFeedback(feedbackData);
        //     setFormMessage('Thank you for your feedback!');
        //     setFeedbackData({ name: '', email: '', message: '' }); // Clear form
        // } catch (error) {
        //     setFormMessage('Sorry, something went wrong. Please try again.');
        // }
        console.log('Feedback submitted (mock):', feedbackData);
        setTimeout(() => { // Simulate API call
            setFormMessage('Thank you for your feedback! (Mocked)');
            setFeedbackData({ name: '', email: '', message: '' });
        }, 1500);
    };

    return (
        <footer className="contact-footer-section">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-column contact-info">
                        <h3>Contact Us</h3>
                        <p><strong>GrooveGrid Dance Studio</strong></p>
                        <p>123 Dance Street, Funky Town, DA 54321</p>
                        <p>Email: <a href="mailto:info@groovegrid.com">info@groovegrid.com</a></p>
                        <p>Phone: <a href="tel:+15551234567">(555) 123-4567</a></p>
                        {/* Add social media links if you have them */}
                    </div>
                    <div className="footer-column feedback-form-container">
                        <h3>Send Us Feedback</h3>
                        {formMessage && <p className="form-status-message">{formMessage}</p>}
                        <form onSubmit={handleSubmitFeedback} className="feedback-form">
                            <div>
                                <label htmlFor="name">Name:</label>
                                <input type="text" id="name" name="name" value={feedbackData.name} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" name="email" value={feedbackData.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor="message">Message:</label>
                                <textarea id="message" name="message" value={feedbackData.message} onChange={handleChange} rows="4" required />
                            </div>
                            <button type="submit" className="button button-submit-feedback">Send Feedback</button>
                        </form>
                    </div>
                    <div className="footer-column quick-links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/schedule">Class Schedule</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} GrooveGrid. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default ContactSection;