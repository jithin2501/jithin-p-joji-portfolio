'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import '../style/Hero.css';

interface AnimatedStatProps {
  value: string;
  color: string;
}

function AnimatedStat({ value, color }: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!value) return;

    const numMatch = value.match(/^([\d.]+)(.*)$/);
    if (!numMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseFloat(numMatch[1]);
    const suffix = numMatch[2] || '';

    if (isNaN(targetNum)) {
      setDisplayValue(value);
      return;
    }

    const duration = 1200; // 1.2s animation
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress); // easeOutQuad
      
      const currentNum = Math.floor(easeProgress * targetNum);
      setDisplayValue(`${currentNum}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div className="stat-num" style={{ color }}>
      {displayValue}
    </div>
  );
}

export default function Hero() {
  const [typewriterText, setTypewriterText] = useState('');
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState({
    hero: {
      projects: '',
      experience: '',
      commits: '',
      satisfaction: '',
      availability: '',
      clients: ''
    },
    socials: {
      github: '',
      linkedin: '',
      email: '',
      phone: '',
      location: ''
    }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to fetch portfolio settings:', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const sentences = [
      "Building modern and responsive web experiences.",
      "Turning ideas into interactive websites.",
      "Crafting clean code and beautiful UI.",
      "Full Stack Web Developer passionate about design & performance.",
      "Creating fast, scalable, and user-friendly websites.",
      "Bringing digital ideas to life."
    ];
    
    let sentenceIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
      const currentSentence = sentences[sentenceIndex];
      
      if (isDeleting) {
        setTypewriterText(currentSentence.substring(0, charIndex - 1));
        charIndex--;
        typingSpeed = 50;
      } else {
        setTypewriterText(currentSentence.substring(0, charIndex + 1));
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentSentence.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at the end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        sentenceIndex = (sentenceIndex + 1) % sentences.length;
        typingSpeed = 500; // Pause before next sentence
      }

      setTimeout(type, typingSpeed);
    };

    const initialTimeout = setTimeout(type, typingSpeed);
    return () => clearTimeout(initialTimeout);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const { clientX: mx, clientY: my } = e;
      if (heroInnerRef.current) {
        heroInnerRef.current.style.transform = `perspective(1000px) rotateX(${(my / window.innerHeight - 0.5) * -20}deg) rotateY(${(mx / window.innerWidth - 0.5) * 20}deg)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--x', mx + 'px');
        spotlightRef.current.style.setProperty('--y', my + 'px');
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Prevent spawning ripples when clicking on navbar or footer items
      if ((e.target as HTMLElement).closest('.navbar') || (e.target as HTMLElement).closest('.footer-section')) return;

      const rip = document.createElement('div');
      rip.style.cssText = `
        position:fixed; border:2px solid var(--accent); border-radius:50%;
        pointer-events:none; transform:translate(-50%,-50%);
        animation:rippleAnim 1s ease-out forwards; z-index:9998;
        left:${e.clientX}px; top:${e.clientY}px;
      `;
      document.body.appendChild(rip);
      setTimeout(() => rip.remove(), 1000);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <div className="noise-overlay" />
      <div className="vignette-overlay" />
      <div ref={spotlightRef} className="spotlight" />

      <div className="hero-wrapper">
        <section id="home" className="hero-section">
          <div ref={heroInnerRef} className="hero-inner">
            <p className="hero-tag">
              <span className="hero-tag-line" />
              Full Stack Developer & Web Designer
              <span className="hero-tag-line" />
            </p>
            <h1 className="hero-title">
              <span className="hero-name-gradient">Jithin</span>{' '}
              <span className="hero-name-gradient">P</span>{' '}
              <span className="hero-text">Joji.</span>
            </h1>
            <p className="typewriter-text">
              {typewriterText}
              <span className="typewriter-cursor" />
            </p>
            <p className="hero-desc">
              Crafting high-performance web applications and stunning user interfaces. Turning complex problems into elegant, scalable solutions — one pixel and commit at a time.
            </p>
            <div className="hero-btns">
              <Link href="/projects" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                View Projects
              </Link>
              <Link href="/contact" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Hire Me
              </Link>
            </div>
          </div>
        </section>

        {/* Right Stats Panel */}
        <div className="hero-stats-panel">
          {[
            { num: settings.hero.projects, label: 'Projects', color: 'var(--accent)' },
            { num: settings.hero.experience, label: 'Experience', color: 'var(--accent2)' },
            { num: settings.hero.commits, label: 'GitHub commits', color: 'var(--accent3)' },
            { num: settings.hero.satisfaction, label: 'Client satisfaction', color: 'var(--green)' },
          ].map((s, i) => (
            <div 
              key={s.label} 
              className="hero-stat-card"
              style={{ animationDelay: `${1.2 + i * 0.15}s` }}
            >
              <AnimatedStat value={s.num || ''} color={s.color} />
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Social Sidebar */}
        <div className="hero-social-sidebar">
          {[
            { icon: 'fab fa-github', href: settings.socials.github, label: '', value: settings.socials.github },
            { icon: 'fab fa-linkedin-in', href: settings.socials.linkedin, label: '', value: settings.socials.linkedin },
            { icon: 'far fa-envelope', href: `mailto:${settings.socials.email}`, label: settings.socials.email, value: settings.socials.email },
            { icon: 'fas fa-phone', href: `tel:${settings.socials.phone}`, label: settings.socials.phone, value: settings.socials.phone },
            { icon: 'fas fa-location-dot', href: '#', label: settings.socials.location, value: settings.socials.location },
          ]
            .filter(s => s.value && s.value.trim() !== '')
            .map((s, i) => (
              <a
                key={i}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="social-link"
              >
                <i className={s.icon} />
                {s.label && (
                  <span className="social-tooltip">
                    {s.label}
                  </span>
                )}
              </a>
            ))}
        </div>
      </div>
    </>
  );
}
