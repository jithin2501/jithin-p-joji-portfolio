'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
    LayoutGrid, Laptop, ShoppingCart, 
    Palette, MoreHorizontal, ExternalLink,
    FolderOpen, RefreshCw
} from 'lucide-react';

import '../style/Projects.css';

/* ── DATA ─────────────────────────────────────── */
const categories = [
    { id: 'all', label: 'All Projects', icon: LayoutGrid },
    { id: 'web-app', label: 'Web Apps', icon: Laptop },
    { id: 'e-commerce', label: 'E-Commerce', icon: ShoppingCart },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'others', label: 'Others', icon: MoreHorizontal },
];

interface Project {
    id: string;
    name: string;
    category: string;
    categoryLabel: string;
    desc: string;
    tech: string[];
    image: string;
}

/* Helper to map backend category strings to local filter ids */
const getNormalizedCategory = (cat: string): string => {
    if (!cat) return 'others';
    const c = cat.toLowerCase();
    if (c.includes('web')) return 'web-app';
    if (c.includes('commerce') || c.includes('store') || c.includes('shop')) return 'e-commerce';
    if (c.includes('design') || c.includes('ui') || c.includes('ux')) return 'design';
    return 'others';
};

/* ── COMPONENTS ───────────────────────────────── */

const ProjectCard = ({ project, index, isVisible }: { project: Project; index: number; isVisible: boolean }) => {
    return (
        <div 
            className={`project-card-wrapper ${isVisible ? 'visible' : ''}`}
            style={{ transitionDelay: `${index * 0.1}s` } as React.CSSProperties}
        >
            <div className="project-card">
                {/* Image Container Showcase */}
                <div className="mockup-container" style={{ position: 'relative', overflow: 'hidden', height: '220px', borderRadius: '12px' }}>
                    <img 
                        src={project.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"} 
                        alt={project.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
                        className="project-img-display"
                    />
                </div>

                <h3 className="project-name" style={{ marginTop: '16px' }}>
                    {project.name}
                </h3>

                <p className="project-desc">
                    {project.desc}
                </p>

                <div className="project-footer">
                    <div className="project-tech-tags">
                        {project.tech.map((t: string) => (
                            <span key={t} className="project-tech-tag">
                                {t}
                            </span>
                        ))}
                    </div>
                    <Link href={`/projects/${project.id}`} className="project-link" title="View Project Details">
                        <ExternalLink size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function Projects() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [isVisible, setIsVisible] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (sectionRef.current) observer.unobserve(sectionRef.current);
                }
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const fetchFeaturedProjects = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/projects/');
                if (!res.ok) throw new Error('Failed to fetch projects');
                const data = await res.json();
                
                // Keep only ticked (featured) projects
                const featuredData = data
                    .filter((p: any) => p.featured === 'feature')
                    .map((p: any) => {
                        const tags = p.tech_stack && p.tech_stack.length > 0
                            ? p.tech_stack.map((t: any) => t.name)
                            : (p.tags || []);
                        return {
                            id: p.id,
                            name: p.title,
                            category: getNormalizedCategory(p.category),
                            categoryLabel: p.category || 'Others',
                            desc: p.description,
                            tech: tags,
                            image: p.image
                        };
                    });

                setProjects(featuredData);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching featured homepage projects:', err);
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProjects();
    }, []);

    const filteredProjects = projects.filter(p => 
        activeFilter === 'all' || p.category === activeFilter
    );

    return (
        <section id="projects" className="projects-section" ref={sectionRef}>
            <div className="projects-container">
                
                {/* Header */}
                <div className="projects-header-box">
                    <div className="projects-tag">
                        <div className="projects-tag-line" />
                        My Projects
                        <div className="projects-tag-line" />
                    </div>
                    <h2 className="projects-title">
                        Featured <span className="projects-gradient-text">Projects</span>
                    </h2>
                </div>

                {/* Filters */}
                <div className="filters-container">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        const isActive = activeFilter === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveFilter(cat.id)}
                                className={`filter-button ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={16} />
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Loading State */}
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0', color: '#7c5cff' }}>
                        <RefreshCw size={24} className="spin-icon" style={{ marginRight: '10px' }} />
                        <span>Loading featured projects...</span>
                    </div>
                )}

                {/* Empty / Zero ticked projects state */}
                {!loading && !error && projects.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '16px', color: '#7070a0', maxWidth: '600px', margin: '0 auto' }}>
                        <FolderOpen size={40} style={{ color: '#7c5cff', opacity: 0.7, marginBottom: '16px', margin: '0 auto' }} />
                        <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>No featured projects selected yet</h4>
                        <p style={{ fontSize: '13px', lineHeight: '1.6', opacity: 0.8 }}>
                            You can choose exactly which projects to display in this grid from your admin panel by ticking the checkmark button next to any stored projects!
                        </p>
                    </div>
                )}

                {/* Grid */}
                {!loading && !error && projects.length > 0 && (
                    <div className="projects-grid">
                        {filteredProjects.map((project, i) => (
                            <ProjectCard key={project.id} project={project} index={i} isVisible={isVisible} />
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <div className="view-all-wrapper">
                    <Link href="/projects" className="view-all-main-btn">
                        <FolderOpen size={20} />
                        View All Projects
                    </Link>
                </div>
            </div>
        </section>
    );
}
