'use client';
import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, Clock, 
  Send, MessageSquare, 
  Code, Heart, ExternalLink 
} from 'lucide-react';
import '../style/Contact.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('http://localhost:8080/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        {/* Header */}
        <header className="contact-header">
          <div className="contact-tag">
            <span className="contact-tag-line" />
            Contact Me
            <span className="contact-tag-line" />
          </div>
          <h1 className="contact-title">
            Let&apos;s Build Something<br />
            <span className="contact-gradient-text">Amazing Together</span>
          </h1>
          <p className="contact-subtitle">
            Have a project idea or want to collaborate? <br />
            I&apos;d love to hear from you. Let&apos;s turn <span>your ideas into reality</span>!
          </p>
        </header>

        {/* Main Grid */}
        <div className="contact-grid">
          {/* Sidebar */}
          <aside className="contact-sidebar">
            <div className="contact-card-glass">
              <h3 className="card-title-small" style={{ textAlign: 'center' }}>Let&apos;s Connect</h3>
              <p className="card-desc-small" style={{ textAlign: 'center' }}>
                I&apos;m currently available for freelance work or exciting opportunities.
              </p>
              
              <div className="connect-list">
                <a href="mailto:jithinpjoji@gmail.com" className="connect-item">
                  <div className="connect-icon-box email"><Mail size={20} /></div>
                  <div className="connect-info">
                    <h4>Email</h4>
                    <p>jithinpjoji@gmail.com</p>
                  </div>
                  <ExternalLink size={14} className="connect-external" />
                </a>
                <a href="tel:+919061058123" className="connect-item">
                  <div className="connect-icon-box phone"><Phone size={20} /></div>
                  <div className="connect-info">
                    <h4>Phone</h4>
                    <p>+91 9061058123</p>
                  </div>
                  <ExternalLink size={14} className="connect-external" />
                </a>
                <div className="connect-item">
                  <div className="connect-icon-box location"><MapPin size={20} /></div>
                  <div className="connect-info">
                    <h4>Location</h4>
                    <p>Bengaluru, Kerala, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-card-glass">
              <h3 className="card-title-small" style={{ textAlign: 'center' }}>Find me on</h3>
              <div className="social-row" style={{ justifyContent: 'center' }}>
                <a href="https://github.com/jithin2501" target="_blank" rel="noopener noreferrer" className="social-btn-small"><i className="fab fa-github" /></a>
                <a href="https://www.linkedin.com/in/jithin05/" target="_blank" rel="noopener noreferrer" className="social-btn-small"><i className="fab fa-linkedin-in" /></a>
                <a href="https://wa.me/919061058123" target="_blank" rel="noopener noreferrer" className="social-btn-small"><i className="fab fa-whatsapp" /></a>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="contact-card-glass contact-form-card">
            <div className="form-header-group">
              <div className="form-header-text">
                <h3>Send me a message</h3>
                <p>Fill out the form below and I&apos;ll get back to you.</p>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <label>Your Name</label>
                  <div className="input-wrapper">
                    <MessageSquare size={18} className="input-icon" />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name" 
                      className="input-field" 
                      required 
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Your Email</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email" 
                      className="input-field" 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 24 }}>
                <label>Subject</label>
                <div className="input-wrapper">
                  <MessageSquare size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?" 
                    className="input-field" 
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Message</label>
                <div className="input-wrapper">
                  <MessageSquare size={18} className="input-icon" style={{ top: 24 }} />
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..." 
                    className="input-field textarea-field" 
                    required
                  ></textarea>
                </div>
              </div>

              <div className="form-footer">
                <button type="submit" className="submit-btn" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                  <Send size={18} />
                </button>
              </div>

              {status === 'success' && <p style={{ color: '#00ff88', marginTop: '15px', textAlign: 'center' }}>Message sent successfully!</p>}
              {status === 'error' && <p style={{ color: '#ff4e4e', marginTop: '15px', textAlign: 'center' }}>Failed to send message.</p>}
            </form>
          </div>
        </div>

        <div className="contact-features">
          <div className="features-title">Why work<br />with me?</div>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-circle"><MessageSquare size={18} color="#818cf8" /></div>
              <div className="feature-text">
                <h5>Clear Communication</h5>
                <p>I believe in transparent and prompt communication.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-circle"><Clock size={18} color="#f59e0b" /></div>
              <div className="feature-text">
                <h5>On-Time Delivery</h5>
                <p>I respect deadlines and always deliver on time.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-circle"><Code size={18} color="#14b8a6" /></div>
              <div className="feature-text">
                <h5>Clean & Efficient Code</h5>
                <p>I write clean, scalable and maintainable code.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-circle"><Heart size={18} color="#ef4444" /></div>
              <div className="feature-text">
                <h5>Client Satisfaction</h5>
                <p>Your satisfaction is my top priority.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

