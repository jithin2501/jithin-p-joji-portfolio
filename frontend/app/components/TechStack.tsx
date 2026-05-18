'use client';
import { useState, useRef, useEffect } from 'react';
import '../style/TechStack.css';

type Tech = { id?: string; name: string; color: string; slug: string; desc: string; page: number };

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
  const [skills, setSkills] = useState<Tech[]>([]);
  const [page, setPage] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch skills from API
  const fetchSkills = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/skills/');
      if (!res.ok) throw new Error('Failed to fetch skills');
      const data = await res.json();
      setSkills(data);
    } catch (err) {
      console.error('Error loading dynamic skills:', err);
    }
  };

  useEffect(() => {
    fetchSkills();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const maxPage = Math.max(1, ...skills.map(s => s.page || 1));
  const currentDisplayTechs = skills.filter(s => (s.page || 1) === page);

  const handlePageChange = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsExiting(true);

    setTimeout(() => {
      setPage(prev => (prev >= maxPage ? 1 : prev + 1));
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
          {currentDisplayTechs.map((t, i) => (
            <TechCard key={`${t.name}-${page}`} t={t} isExiting={isExiting} index={i} isVisible={isVisible} />
          ))}
        </div>

        {maxPage > 1 && (
          <div className="tech-center-container" style={{ textAlign: 'center', marginTop: 40 }}>
            <button
              onClick={handlePageChange}
              disabled={isAnimating}
              className="pagination-btn"
            >
              <span>
                {page === maxPage ? 'Back to Core Skills' : `View Page ${page + 1} Technologies`}
              </span>
              <i className={`fas ${isAnimating ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}