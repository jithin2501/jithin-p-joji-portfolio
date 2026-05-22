'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ExternalLink, LayoutGrid, Laptop, 
  ShoppingCart, Palette, MoreHorizontal, 
  Star, ArrowRight, FolderOpen 
} from 'lucide-react';
import '../style/ProjectsPage.css';

const categories = [
  { id: 'All', label: 'All Projects', icon: LayoutGrid },
  { id: 'Web Apps', label: 'Web Apps', icon: Laptop },
  { id: 'E-Commerce', label: 'E-Commerce', icon: ShoppingCart },
  { id: 'Design', label: 'Design', icon: Palette },
  { id: 'Others', label: 'Others', icon: MoreHorizontal },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/projects/');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        setProjects(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching dynamic projects:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => {
        // Match category case-insensitively or exactly
        return project.category?.toLowerCase() === activeCategory.toLowerCase();
      });

  return (
    <div className="projects-page">
      <div className="projects-container">
        {/* Header */}
        <header className="projects-header">
          <div className="projects-tag">
            <span className="projects-tag-line" />
            MY WORK
            <span className="projects-tag-line" />
          </div>
          <h1 className="projects-title">
            My <span className="projects-gradient-text">Projects</span>
          </h1>
          <p className="projects-subtitle">
            Here are some of the projects I've worked on. 
            Each project represents my passion for learning and building.
          </p>
        </header>

        {/* Filters */}
        <div className="projects-filters">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                suppressHydrationWarning
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="projects-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="project-card-new skeleton-card" style={{ opacity: 0.7 }}>
                <div className="project-img-box skeleton-shimmer" style={{ height: '220px', background: 'rgba(255,255,255,0.05)' }} />
                <div className="project-info-new" style={{ padding: '20px' }}>
                  <div style={{ height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '60%', marginBottom: '15px' }} className="skeleton-shimmer" />
                  <div style={{ height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '90%', marginBottom: '10px' }} className="skeleton-shimmer" />
                  <div style={{ height: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '80%', marginBottom: '20px' }} className="skeleton-shimmer" />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', width: '50px' }} className="skeleton-shimmer" />
                    <div style={{ height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', width: '70px' }} className="skeleton-shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="error-message" style={{ textAlign: 'center', padding: '40px', color: '#ff4d4d' }}>
            <FolderOpen size={48} style={{ marginBottom: '15px', opacity: 0.6 }} />
            <h3>Failed to load projects</h3>
            <p style={{ opacity: 0.7, fontSize: '14px', marginTop: '5px' }}>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="empty-projects" style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.5)' }}>
            <FolderOpen size={48} style={{ marginBottom: '15px', opacity: 0.6, margin: '0 auto' }} />
            <h3>No Projects Found</h3>
            <p style={{ opacity: 0.7, fontSize: '14px', marginTop: '5px' }}>There are no projects in the "{activeCategory}" category yet.</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="projects-grid">
            {filteredProjects.map((project) => {
              // Dynamically map tech stack to tags array
              const tags = project.tech_stack && project.tech_stack.length > 0
                ? project.tech_stack.map((tech: any) => tech.name)
                : (project.tags || []);
              
              const liveUrl = project.live_url || project.liveUrl || "#";
              const githubUrl = project.github_url || project.githubUrl || "#";

              return (
                <div key={project.id} className="project-card-new">
                  <div className="project-img-box">
                    {project.featured === 'feature' && (
                      <div className="featured-badge" style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)', color: '#000', fontWeight: 'bold' }}>
                        <Star size={12} fill="black" />
                        Featured
                      </div>
                    )}
                    {project.featured === 'new' && (
                      <div className="featured-badge" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 'bold' }}>
                        <Star size={12} fill="white" />
                        New
                      </div>
                    )}
                    {project.featured === 'freelancing' && (
                      <div className="featured-badge" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', fontWeight: 'bold' }}>
                        <Star size={12} fill="white" />
                        Freelance
                      </div>
                    )}
                    <img src={project.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"} alt={project.title} className="project-img-placeholder" />
                  </div>

                  <div className="project-info-new">
                    <div className="project-header-new">
                      <h3 className="project-title-new">{project.title}</h3>
                      <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="external-link-btn" title="Live Preview">
                        <ExternalLink size={20} />
                      </a>
                    </div>
                    <p className="project-desc-new">{project.description}</p>
                    
                    {tags.length > 0 && (
                      <div className="project-tags-new">
                        {tags.map((tag: string) => (
                          <span key={tag} className="tag-new">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="project-footer-new">
                    <Link href={`/projects/${project.id}`} className="view-details-btn">
                      View Details
                      <ArrowRight size={16} />
                    </Link>
                    <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="github-btn-new">
                      GitHub
                      <i className="fab fa-github" style={{ fontSize: '18px' }} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
