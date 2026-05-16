'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ExternalLink, LayoutGrid, Laptop, 
  ShoppingCart, Palette, MoreHorizontal, 
  Star, ArrowRight, FolderOpen 
} from 'lucide-react';
import '../style/ProjectsPage.css';

const projectsData = [
  {
    id: 1,
    title: "Analytics Dashboard",
    description: "A responsive analytics dashboard with real-time data visualization and reporting.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    category: "Web Apps",
    tags: ["React", "TypeScript", "Tailwind CSS", "Chart.js"],
    featured: true
  },
  {
    id: 2,
    title: "Travel Website",
    description: "A modern travel website UI with beautiful destinations and booking functionality.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
    category: "Web Apps",
    tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    featured: false
  },
  {
    id: 3,
    title: "Task Manager App",
    description: "A mobile task management app to boost productivity and organize daily tasks.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop",
    category: "Others",
    tags: ["Flutter", "Dart", "Firebase", "Provider"],
    featured: false
  },
  {
    id: 4,
    title: "Eco-Friendly E-commerce",
    description: "Sustainable shopping platform with focus on clean UI and smooth user experience.",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop",
    category: "E-Commerce",
    tags: ["Figma", "Webflow", "Stripe", "GSAP"],
    featured: true
  }
];

const categories = [
  { id: 'All', label: 'All Projects', icon: LayoutGrid },
  { id: 'Web Apps', label: 'Web Apps', icon: Laptop },
  { id: 'E-Commerce', label: 'E-Commerce', icon: ShoppingCart },
  { id: 'Design', label: 'Design', icon: Palette },
  { id: 'Others', label: 'Others', icon: MoreHorizontal },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? projectsData 
    : projectsData.filter(project => project.category === activeCategory);

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

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card-new">
              <div className="project-img-box">
                {project.featured && (
                  <div className="featured-badge">
                    <Star size={12} fill="white" />
                    Featured
                  </div>
                )}
                <img src={project.image} alt={project.title} className="project-img-placeholder" />
              </div>

              <div className="project-info-new">
                <div className="project-header-new">
                  <h3 className="project-title-new">{project.title}</h3>
                  <a href="#" className="external-link-btn" title="Live Preview">
                    <ExternalLink size={20} />
                  </a>
                </div>
                <p className="project-desc-new">{project.description}</p>
                
                <div className="project-tags-new">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag-new">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="project-footer-new">
                <Link href={`/projects/${project.id}`} className="view-details-btn">
                  View Details
                  <ArrowRight size={16} />
                </Link>
                <a href="#" className="github-btn-new">
                  GitHub
                  <i className="fab fa-github" style={{ fontSize: '18px' }} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
