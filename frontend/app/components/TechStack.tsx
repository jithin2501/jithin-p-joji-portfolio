'use client';
import { useState, useRef, useEffect } from 'react';
import '../style/TechStack.css';

const techsPage1 = [
  { name: 'HTML5', color: '#E34F26', slug: 'html', desc: 'Semantic markup for modern, accessible websites.' },
  { name: 'CSS3', color: '#1572B6', slug: 'css', desc: 'Advanced styling with Flexbox, Grid, animations and more.' },
  { name: 'JavaScript', color: '#F7DF1E', slug: 'js', desc: 'Dynamic and interactive experiences for the modern web.' },
  { name: 'React', color: '#61DAFB', slug: 'react', desc: 'Building reusable UI components with a declarative approach.' },
  { name: 'Next.js', color: '#FFFFFF', slug: 'nextjs', desc: 'The React framework for production-grade web apps.' },
  { name: 'Tailwind CSS', color: '#06B6D4', slug: 'tailwind', desc: 'Utility-first CSS framework for rapid UI development.' },
  { name: 'Node.js', color: '#339933', slug: 'nodejs', desc: 'JavaScript runtime for scalable backend applications.' },
  { name: 'MongoDB', color: '#47A248', slug: 'mongodb', desc: 'NoSQL database for modern, flexible and scalable apps.' },
  { name: 'Express.js', color: '#FFFFFF', slug: 'express', desc: 'Fast and minimal web framework for Node.js applications.' },
  { name: 'PostgreSQL', color: '#4169E1', slug: 'postgres', desc: 'Relational database for structured data management.' },
  { name: 'Docker', color: '#2496ED', slug: 'docker', desc: 'Containerization for consistent dev and production environments.' },
  { name: 'Git & GitHub', color: '#F05032', slug: 'git', desc: 'Version control and collaboration for efficient development.' },
];

const techsPage2 = [
  { name: 'TypeScript', color: '#3178C6', slug: 'ts', desc: 'Typed JavaScript for better developer ergonomics.' },
  { name: 'GraphQL', color: '#E10098', slug: 'graphql', desc: 'Query language for APIs and runtime for fulfilling queries.' },
  { name: 'Redux', color: '#764ABC', slug: 'redux', desc: 'Predictable state container for JavaScript apps.' },
  { name: 'AWS', color: '#FF9900', slug: 'aws', desc: 'Amazon Web Services for cloud computing and hosting.' },
  { name: 'Firebase', color: '#FFCA28', slug: 'firebase', desc: "Google's platform for building mobile and web apps." },
  { name: 'Kubernetes', color: '#326CE5', slug: 'kubernetes', desc: 'Orchestration for automated container deployment.' },
  { name: 'Redis', color: '#DC382D', slug: 'redis', desc: 'In-memory data structure store for caching and more.' },
  { name: 'SQLite', color: '#003B57', slug: 'sqlite', desc: 'Self-contained, serverless relational database engine.' },
  { name: 'Figma', color: '#F24E1E', slug: 'figma', desc: 'Collaborative interface design tool for modern teams.' },
  { name: 'SASS', color: '#CC6699', slug: 'sass', desc: 'CSS preprocessor with variables and nesting capabilities.' },
  { name: 'Jest', color: '#C21325', slug: 'jest', desc: 'Delightful JavaScript testing framework for quality code.' },
  { name: 'Vercel', color: '#FFFFFF', slug: 'vercel', desc: 'Platform for frontend developers to deploy instantly.' },
];

type Tech = { name: string; color: string; slug: string; desc: string };

function TechCard({ t, isExiting, index, isVisible }: { t: Tech; isExiting: boolean; index: number; isVisible: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconSrc = `https://skillicons.dev/icons?i=${t.slug}`;
  const glow = t.color + '22';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isExiting || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cardRef.current.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
    cardRef.current.style.setProperty('--my', `${(y / rect.height) * 100}%`);
  };

  const dynamicStyles = {
    '--card-color': t.color,
    '--card-glow': glow,
    '--icon-border': `${t.color}44`,
    animationDelay: `${index * 0.08}s`,
    transitionDelay: `${index * 0.08}s`,
  } as React.CSSProperties;

  return (
    <div
      ref={cardRef}
      className={`tech-card ${isExiting ? 'exiting' : ''} ${isVisible ? 'visible' : ''}`}
      onMouseMove={handleMouseMove}
      style={dynamicStyles}
    >
      {/* Border Trace Animation SVG */}
      <svg className="trace-svg" viewBox="0 0 200 200" preserveAspectRatio="none">
        <path 
          className="trace-path"
          d="M 100, 200 L 18, 200 Q 0, 200 0, 182 L 0, 18 Q 0, 0 18, 0 L 100, 0" 
          stroke={t.color} strokeWidth="2" strokeDasharray="400" strokeDashoffset="400"
        />
        <path 
          className="trace-path"
          d="M 100, 200 L 182, 200 Q 200, 200 200, 182 L 200, 18 Q 200, 0 182, 0 L 100, 0" 
          stroke={t.color} strokeWidth="2" strokeDasharray="400" strokeDashoffset="400"
        />
      </svg>

      <div className="tech-icon-wrap">
        <span className="tech-pulse-dot" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt={t.name}
          className="tech-icon-img"
          width={32} height={32}
        />
      </div>

      <div className="tech-name">
        {t.name}
      </div>

      <div className="tech-desc">
        {t.desc}
      </div>
    </div>
  );
}

export default function TechStack() {
  const [page, setPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayTechs, setDisplayTechs] = useState(techsPage1);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      { threshold: 0.2 } // Higher threshold for better trigger timing
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePageChange = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsExiting(true);

    setTimeout(() => {
      const nextPage = page === 1 ? 2 : 1;
      setPage(nextPage);
      setDisplayTechs(nextPage === 1 ? techsPage1 : techsPage2);
      setIsExiting(false);
      
      setTimeout(() => setIsAnimating(false), 1000);
    }, 1200);
  };

  return (
    <section id="tech" className="tech-section" ref={sectionRef}>
      <div className={`tech-container ${isVisible ? 'visible' : ''}`}>
        <div className="tech-header">
          <div className="tech-tag">
            <span className="tech-tag-line" />
            Tech Stack
            <span className="tech-tag-line" />
          </div>
          <h2 className="tech-title">
            Technologies I{' '}
            <span className="tech-gradient-text">
              Work With
            </span>
          </h2>
        </div>

        <div className="tech-grid">
          {displayTechs.map((t, i) => (
            <TechCard key={`${t.name}-${page}`} t={t} isExiting={isExiting} index={i} isVisible={isVisible} />
          ))}
        </div>

        <div className="tech-center-container" style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            onClick={handlePageChange}
            disabled={isAnimating}
            className="pagination-btn"
          >
            <span>{page === 1 ? 'View More Technologies' : 'Back to Core Skills'}</span>
            <i className={`fas ${isAnimating ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`} />
          </button>
        </div>
      </div>
    </section>
  );
}