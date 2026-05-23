'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../style/Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isOpen, setIsOpen] = useState(false);
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { label: 'Home', href: '/#home', id: 'home' },
    { label: 'About', href: '/#about', id: 'about' },
    { label: 'Skills', href: '/#tech', id: 'tech' },
    { label: 'Experience', href: '/#experience', id: 'experience' },
    { label: 'Projects', href: '/projects', id: 'projects' },
    { label: 'Education', href: '/#education', id: 'education' },
    { label: 'Contact', href: '/contact', id: 'contact' }
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    const isHomePageSection = href.startsWith('/#');
    if (pathname === '/' && isHomePageSection) {
      e.preventDefault();
      const id = href.replace('/#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <div className="logo-dot" />
          ./jithin.dev
        </Link>

        {/* Desktop Navbar Menu */}
        <ul className="navbar-menu">
          {navItems.map((item) => {
            const isActive = (pathname === '/' && activeSection === item.id) || (pathname === item.href);
            return (
              <li key={item.label}>
                <Link 
                  href={item.href} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleLinkClick(e, item.href)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Hire Me Button */}
        <Link href="/contact" className="hire-me-btn">
          Hire Me
        </Link>

        {/* Mobile Hamburger Button */}
        <button 
          className={`hamburger ${isOpen ? 'active' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Mobile Navigation Drawer Overlay */}
        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
          <ul className="mobile-menu-items">
            {navItems.map((item) => {
              const isActive = (pathname === '/' && activeSection === item.id) || (pathname === item.href);
              return (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                    onClick={(e) => handleLinkClick(e, item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link 
                href="/contact" 
                className="mobile-hire-me-btn"
                onClick={() => setIsOpen(false)}
              >
                Hire Me
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
