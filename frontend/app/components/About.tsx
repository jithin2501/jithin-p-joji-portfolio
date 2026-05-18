'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import DownloadButton from './DownloadButton';
import '../style/About.css';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [aboutImage, setAboutImage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchAboutImage = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/settings/', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (data.about_image) {
            setAboutImage(data.about_image);
          }
        }
      } catch (err) {
        console.error('Failed to fetch about image:', err);
      }
    };
    fetchAboutImage();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className={`about-content-left ${isVisible ? 'visible' : ''}`}>
        <h4 className="about-tag">
          <span className="about-tag-line" />
          About Me
          <span className="about-tag-line" />
        </h4>
        <h2 className="about-title">
          I&apos;m a Full Stack <span className="about-accent-text">Web Developer</span>
        </h2>
        <p className="about-description">
          Hello! I&apos;m a passionate Full Stack Web Developer who loves building clean, efficient and user-friendly web applications. I enjoy turning ideas into real-world solutions through code.
        </p>
        <p className="about-description">
          I work with modern technologies across the MERN stack and enjoy learning new tools and frameworks to improve performance and scalability.
        </p>
        
        <div className="about-download-container">
          <DownloadButton />
        </div>
      </div>

      <div className={`about-image-container ${isVisible ? 'visible' : ''}`}>
        <div className="about-image-border" />
        <div className="about-image-mask" style={{ position: 'relative' }}>
          {aboutImage && (
            <img 
              src={aboutImage} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          )}
        </div>
        
        {/* Updated Badge Design */}
        <div className="about-badge-wrapper">
          {/* Black Outer Ring */}
          <div className="badge-outer-ring" />
          
          {/* Rotating Purple Circle with Text */}
          <div className="badge-rotating-circle">
            <svg viewBox="0 0 100 100" className="badge-svg">
              <path id="circlePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
              <text>
                <textPath href="#circlePath" textLength="238" lengthAdjust="spacing">
                  FULL STACK WEB DEVELOPER • MERN STACK •
                </textPath>
              </text>
            </svg>
          </div>

          {/* White Inner Circle (Static) */}
          <div className="badge-inner-static">
            <i className="fas fa-code" />
          </div>
        </div>
      </div>
    </section>
  );
}
