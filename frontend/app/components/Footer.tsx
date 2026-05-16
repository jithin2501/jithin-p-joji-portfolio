'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import { Mail, ArrowUp, MapPin, Phone } from 'lucide-react';
import '../style/Footer.css';

const Footer = () => {
    const clickCount = useRef(0);
    const clickTimer = useRef<NodeJS.Timeout | null>(null);

    return (
        <footer className="footer-section">
            <div className="footer-container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo" style={{ marginBottom: '15px' }}>
                            <span className="logo-dot"></span>
                            ./ jithin.dev
                        </div>
                        <p className="footer-tagline">
                            Building digital experiences with passion and precision. 
                        </p>
                        <div className="footer-socials">
                            <a href="https://github.com/jithin2501" target="_blank" rel="noopener noreferrer" className="social-link" title="Github"><i className="fab fa-github" /></a>
                            <a href="https://www.linkedin.com/in/jithin05/" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn"><i className="fab fa-linkedin-in" /></a>
                            <a href="https://wa.me/919061058123" target="_blank" rel="noopener noreferrer" className="social-link" title="WhatsApp"><i className="fab fa-whatsapp" /></a>
                            <a href="https://www.instagram.com/jith_in05/" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram"><i className="fab fa-instagram" /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4 className="links-title">Quick Navigation</h4>
                        <ul className="footer-nav">
                            <li><Link href="/#hero">Home</Link></li>
                            <li><Link href="/#about">About</Link></li>
                            <li><Link href="/#projects">Projects</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-contact-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <h4 className="links-title">Contact Info</h4>
                        <ul className="footer-contact" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Mail size={14} className="contact-icon" />
                                <span>jithinpjoji@gmail.com</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Phone size={14} className="contact-icon" />
                                <span>+91 9061058123</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={14} className="contact-icon" />
                                <span className="location-text">Bengaluru, Kerala, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-copyright">
                        © {new Date().getFullYear()} 
                        <span 
                            className="admin-trigger"
                            onClick={() => {
                                clickCount.current += 1;
                                
                                if (clickCount.current === 3) {
                                    window.location.href = '/admin';
                                    clickCount.current = 0;
                                }

                                if (clickTimer.current) clearTimeout(clickTimer.current);
                                clickTimer.current = setTimeout(() => {
                                    clickCount.current = 0;
                                }, 1000);
                            }}
                            style={{ cursor: 'default', userSelect: 'none', marginLeft: '5px', fontWeight: 'inherit', color: 'inherit' }}
                        >
                            Jithin P Joji
                        </span>. 
                        All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
