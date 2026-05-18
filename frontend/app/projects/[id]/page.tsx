'use client';
import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ExternalLink,
  Calendar, Clock, User, 
  Tag, Settings, Layout,
  CheckCircle2, Rocket, Users,
  BarChart3, Zap, Smartphone,
  Info, Sparkles, BookOpen,
  Code2
} from 'lucide-react';
import '../../style/ProjectDetail.css';

const ProjectSlider = ({ images, title }: { images: string[], title: string }) => {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging) {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, isDragging]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setOffsetX(0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setOffsetX(clientX - startX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    if (Math.abs(offsetX) > 100) {
      if (offsetX < 0) {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
    
    setIsDragging(false);
    setOffsetX(0);
  };

  return (
    <div 
      className={`project-slider-wrapper ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="slider-main">
        {images.map((img, i) => {
          let transform = 'none';
          let opacity = 0;
          let zIndex = 0;

          if (i === current) {
            transform = `translateX(${offsetX}px)`;
            opacity = 1;
            zIndex = 2;
          } else if (i === (current + 1) % images.length && offsetX < 0) {
            // Next slide peeking
            transform = `translateX(${window.innerWidth > 0 ? 100 : 0}% + ${offsetX}px)`;
            opacity = Math.abs(offsetX) / 500;
            zIndex = 1;
          }

          return (
            <div 
              key={i} 
              className={`slide ${i === current ? 'active' : ''}`}
              style={{ 
                transform: i === current ? `translateX(${offsetX}px)` : 'none',
                opacity: i === current ? 1 : 0,
                transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <img src={img} alt={`${title} slide ${i + 1}`} className="preview-img" draggable="false" />
            </div>
          );
        })}
      </div>
      
      <div className="slider-dots">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(i);
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Map of string icon names to Lucide icons for dynamic rendering
const iconMap: Record<string, any> = {
  Zap, BarChart3, Users, Rocket, Layout, ExternalLink, Tag, Smartphone,
  Settings, CheckCircle2, Sparkles, BookOpen, Clock, Calendar, User, Info, Code2
};

const getIcon = (iconName: string) => {
  if (!iconName) return Info;
  return iconMap[iconName] || Info;
};

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/projects/${resolvedParams.id}`);
        if (!res.ok) throw new Error('Project not found or invalid ID');
        const data = await res.json();
        setProject(data);
        setError(null);
      } catch (err: any) {
        console.error('Error loading project detail:', err);
        setError(err.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="project-detail-page" style={{ opacity: 0.8 }}>
        <div className="detail-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="skeleton-shimmer" style={{ width: '150px', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', margin: '0 auto 20px auto' }} />
          <div className="skeleton-shimmer" style={{ width: '300px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', margin: '0 auto 40px auto' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', height: '350px', padding: '30px' }} className="skeleton-card">
              <div className="skeleton-shimmer" style={{ height: '30px', background: 'rgba(255,255,255,0.05)', width: '100%', marginBottom: '20px' }} />
              <div className="skeleton-shimmer" style={{ height: '20px', background: 'rgba(255,255,255,0.05)', width: '80%', marginBottom: '20px' }} />
              <div className="skeleton-shimmer" style={{ height: '20px', background: 'rgba(255,255,255,0.05)', width: '70%', marginBottom: '20px' }} />
            </div>
            <div className="skeleton-shimmer" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', height: '450px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-page">
        <div className="detail-container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <Info size={64} style={{ margin: '0 auto 20px auto', opacity: 0.5, color: '#ff4d4d' }} />
          <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>Project Not Found</h2>
          <p style={{ opacity: 0.7, marginBottom: '30px' }}>{error || 'The requested project could not be found.'}</p>
          <Link href="/projects" className="visit-btn" style={{ display: 'inline-flex', padding: '12px 24px' }}>
            <ArrowLeft size={18} style={{ marginRight: '8px' }} />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Safe fallbacks for all fields from database model
  const subtitle = project.subtitle || "PROJECT DETAILS";
  const longDesc = project.long_desc || project.longDesc || project.description || "No description provided.";
  const images = project.images && project.images.length > 0
    ? project.images
    : [project.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop"];
  
  const category = project.category || "Others";
  const role = project.role || "Developer";
  const duration = project.duration || "N/A";
  const completed = project.completed || "N/A";
  const tools = project.tools || "N/A";
  const methodology = project.methodology || "N/A";
  const features = project.features || [];
  const techStack = project.tech_stack || project.techStack || [];
  const learned = project.learned || "In this project, I strengthened my development and problem solving skills.";
  const liveUrl = project.live_url || project.liveUrl || "#";
  const githubUrl = project.github_url || project.githubUrl || "#";

  return (
    <div className="project-detail-page">
      <div className="detail-container">
        <div style={{ marginBottom: '20px' }}>
          <Link href="/projects" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}>
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </div>

        <div className="detail-grid">
          {/* Left Sidebar */}
          <aside className="detail-sidebar">
            <div className="detail-header">
              <span className="detail-tag">{subtitle}</span>
              <h1 className="detail-title">{project.title}</h1>
              
              <div className="detail-btns">
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="visit-btn">
                  <Rocket size={18} />
                  Visit Live Site
                </a>
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="github-outline-btn">
                  <i className="fab fa-github" style={{ fontSize: '18px' }} />
                  View on GitHub
                </a>
              </div>
            </div>

            <div className="detail-info-list">
              <div className="info-item">
                <Tag size={16} className="info-icon" />
                <span className="info-label">Category</span>
                <span className="info-value">{category}</span>
              </div>
              <div className="info-item">
                <User size={16} className="info-icon" />
                <span className="info-label">Role</span>
                <span className="info-value">{role}</span>
              </div>
              <div className="info-item">
                <Clock size={16} className="info-icon" />
                <span className="info-label">Duration</span>
                <span className="info-value">{duration}</span>
              </div>
              <div className="info-item">
                <CheckCircle2 size={16} className="info-icon" />
                <span className="info-label">Completed</span>
                <span className="info-value">{completed}</span>
              </div>
              <div className="info-item">
                <Zap size={16} className="info-icon" />
                <span className="info-label">Methodology</span>
                <span className="info-value">{methodology}</span>
              </div>
              <div className="info-item">
                <Settings size={16} className="info-icon" />
                <span className="info-label">Tools</span>
                <span className="info-value">{tools}</span>
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="detail-main-content">
            <div className="preview-mockup">
              <ProjectSlider images={images} title={project.title} />
            </div>
          </main>
        </div>

        {/* Alignment Row: About + Features */}
        <div className="middle-section-header-row">
          <h3 className="section-header">
            <Info size={20} />
            About {project.title}
          </h3>
          {features.length > 0 && (
            <h3 className="section-header">
              <Sparkles size={20} />
              Key Features
            </h3>
          )}
        </div>

        <div className="detail-middle-row">
          <section className="about-project-col">
            <p className="about-text">{longDesc}</p>
          </section>

          {features.length > 0 && (
            <section className="features-section-col">
              <div className="features-grid">
                {features.map((feature: any, i: number) => {
                  const Icon = getIcon(feature.icon);
                  return (
                    <div key={i} className="feature-card">
                      <div className="feature-icon-box">
                        <Icon size={24} />
                      </div>
                      <div className="feature-content">
                        <h4>{feature.title}</h4>
                        <p>{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Bottom Row */}
        <div className="detail-bottom-row">
          {techStack.length > 0 && (
            <div className="bottom-box">
              <h3 className="section-header">
                <Code2 size={22} />
                Tech Stack
              </h3>
              <div className="tech-stack-grid">
                {techStack.map((tech: any, i: number) => (
                  <div key={i} className="tech-badge-detail">
                    {tech.icon && <i className={tech.icon} />}
                    {tech.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bottom-box">
            <h3 className="section-header">
              <BookOpen size={22} />
              What I Learned
            </h3>
            <p className="learned-text">{learned}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
