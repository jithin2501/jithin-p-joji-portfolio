'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../style/Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);

    if (pathname === '/') {
      // Scroll Spy Logic only on home page
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      };

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);
      const sections = ['home', 'about', 'tech', 'experience', 'projects', 'education'];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return () => {
        window.removeEventListener('scroll', onScroll);
        observer.disconnect();
      };
    } else {
      setActiveSection('');
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [pathname]);

  const navItems = [
    { label: 'Home', href: '/#home', id: 'home' },
    { label: 'About', href: '/#about', id: 'about' },
    { label: 'Skills', href: '/#tech', id: 'tech' },
    { label: 'Experience', href: '/#experience', id: 'experience' },
    { label: 'Projects', href: '/projects', id: 'projects' },
    { label: 'Education', href: '/#education', id: 'education' },
    { label: 'Contact', href: '/contact', id: 'contact' }
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <div className="logo-dot" />
          ./jithin.dev
        </Link>

        <ul className="navbar-menu">
          {navItems.map((item) => {
            const isHomePageSection = item.href.startsWith('/#');
            const isActive = (pathname === '/' && activeSection === item.id) || (pathname === item.href);
            
            return (
              <li key={item.label}>
                <Link 
                  href={item.href} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={(e) => {
                    // Handle internal home page navigation with smooth scroll
                    if (pathname === '/' && isHomePageSection) {
                      e.preventDefault();
                      const id = item.href.replace('/#', '');
                      const el = document.getElementById(id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                    // For cross-page navigation, default behavior will now be instant
                    // because we removed global scroll-behavior: smooth
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link href="/contact" className="hire-me-btn">
          Hire Me
        </Link>
      </div>
    </nav>
  );
}
