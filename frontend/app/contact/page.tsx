'use client';
import { 
  Mail, Phone, MapPin, Clock, 
  Send, ShieldCheck, MessageSquare, 
  Rocket, Code, Heart, ExternalLink 
} from 'lucide-react';
import '../style/Contact.css';

export default function ContactPage() {
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
            Let's Build Something<br />
            <span className="contact-gradient-text">Amazing Together</span>
          </h1>
          <p className="contact-subtitle">
            Have a project idea or want to collaborate? <br />
            I'd love to hear from you. Let's turn <span>your ideas into reality</span>!
          </p>
        </header>

        {/* Main Grid */}
        <div className="contact-grid">
          {/* Sidebar */}
          <aside className="contact-sidebar">
            {/* Connect Card */}
            <div className="contact-card-glass">
              <h3 className="card-title-small" style={{ textAlign: 'center' }}>Let's Connect</h3>
              <p className="card-desc-small" style={{ textAlign: 'center' }}>
                I'm currently available for freelance work or exciting opportunities.
              </p>
              
              <div className="connect-list">
                <a href="mailto:jithinpjoji@gmail.com" className="connect-item">
                  <div className="connect-icon-box email">
                    <Mail size={20} />
                  </div>
                  <div className="connect-info">
                    <h4>Email</h4>
                    <p>jithinpjoji@gmail.com</p>
                  </div>
                  <ExternalLink size={14} className="connect-external" />
                </a>

                <a href="tel:+919061058123" className="connect-item">
                  <div className="connect-icon-box phone">
                    <Phone size={20} />
                  </div>
                  <div className="connect-info">
                    <h4>Phone</h4>
                    <p>+91 9061058123</p>
                  </div>
                  <ExternalLink size={14} className="connect-external" />
                </a>

                <div className="connect-item">
                  <div className="connect-icon-box location">
                    <MapPin size={20} />
                  </div>
                  <div className="connect-info">
                    <h4>Location</h4>
                    <p>Bengaluru, Kerala, India</p>
                  </div>
                  <ExternalLink size={14} className="connect-external" />
                </div>

                <div className="connect-item">
                  <div className="connect-icon-box availability">
                    <Clock size={20} />
                  </div>
                  <div className="connect-info">
                    <h4>Availability</h4>
                    <p>Mon - Sat | 10AM - 7PM (IST)</p>
                  </div>
                  <ExternalLink size={14} className="connect-external" />
                </div>
              </div>
            </div>

            {/* Find me on Card */}
            <div className="contact-card-glass">
              <h3 className="card-title-small" style={{ textAlign: 'center' }}>Find me on</h3>
              <div className="social-row" style={{ justifyContent: 'center' }}>
                <a href="https://github.com/jithin2501" target="_blank" rel="noopener noreferrer" className="social-btn-small" suppressHydrationWarning><i className="fab fa-github" /></a>
                <a href="https://www.linkedin.com/in/jithin05/" target="_blank" rel="noopener noreferrer" className="social-btn-small" suppressHydrationWarning><i className="fab fa-linkedin-in" /></a>
                <a href="https://wa.me/919061058123" target="_blank" rel="noopener noreferrer" className="social-btn-small" suppressHydrationWarning><i className="fab fa-whatsapp" /></a>
                <a href="https://www.instagram.com/jith_in05/" target="_blank" rel="noopener noreferrer" className="social-btn-small" suppressHydrationWarning><i className="fab fa-instagram" /></a>
                <a href="mailto:jithinpjoji@gmail.com" className="social-btn-small" suppressHydrationWarning><i className="far fa-envelope" /></a>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div className="contact-card-glass contact-form-card">
            <div className="form-header-group">
              <div className="form-header-text">
                <h3>Send me a message</h3>
                <p>Fill out the form below and I'll get back to you.</p>
              </div>
            </div>

            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="input-group">
                  <label>Your Name</label>
                  <div className="input-wrapper">
                    <MessageSquare size={18} className="input-icon" />
                    <input type="text" placeholder="Enter your name" className="input-field" />
                  </div>
                </div>
                <div className="input-group">
                  <label>Your Email</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input type="email" placeholder="Enter your email" className="input-field" />
                  </div>
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: 24 }}>
                <label>Subject</label>
                <div className="input-wrapper">
                  <MessageSquare size={18} className="input-icon" />
                  <input type="text" placeholder="What is this about?" className="input-field" />
                </div>
              </div>

              <div className="input-group">
                <label>Message</label>
                <div className="input-wrapper">
                  <MessageSquare size={18} className="input-icon" style={{ top: 24 }} />
                  <textarea placeholder="Tell me about your project..." className="input-field textarea-field"></textarea>
                </div>
              </div>

              <div className="form-footer">
                <button type="submit" className="submit-btn" suppressHydrationWarning>
                  Send Message
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Features */}
        <div className="contact-features">
          <div className="features-title">Why work<br />with me?</div>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-circle">
                <MessageSquare size={18} color="#818cf8" />
              </div>
              <div className="feature-text">
                <h5>Clear Communication</h5>
                <p>I believe in transparent and prompt communication.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-circle">
                <Clock size={18} color="#f59e0b" />
              </div>
              <div className="feature-text">
                <h5>On-Time Delivery</h5>
                <p>I respect deadlines and always deliver on time.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-circle">
                <Code size={18} color="#14b8a6" />
              </div>
              <div className="feature-text">
                <h5>Clean & Efficient Code</h5>
                <p>I write clean, scalable and maintainable code.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon-circle">
                <Heart size={18} color="#ef4444" />
              </div>
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
