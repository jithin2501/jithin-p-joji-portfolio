'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
    LayoutGrid, Laptop, ShoppingCart, 
    Palette, MoreHorizontal, ExternalLink,
    FolderOpen
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
    id: number;
    name: string;
    category: string;
    categoryLabel: string;
    desc: string;
    tech: string[];
    mockupType: string;
}

const projects: Project[] = [
    {
        id: 1,
        name: 'Productivity Platform',
        category: 'web-app',
        categoryLabel: 'Web App',
        desc: 'A robust productivity platform featuring real-time collaboration, team workspaces, and interactive task boards.',
        tech: ['React', 'Node.js', 'MongoDB'],
        mockupType: 'grid',
    },
    {
        id: 2,
        name: 'Online Store',
        category: 'e-commerce',
        categoryLabel: 'E-Commerce',
        desc: 'Full-featured online store with secure Stripe integration, inventory tracking, and dynamic product filtering.',
        tech: ['Next.js', 'Stripe', 'Postgres'],
        mockupType: 'browser',
    },
    {
        id: 3,
        name: 'UI/UX Portfolio Design',
        category: 'design',
        categoryLabel: 'Design',
        desc: 'A comprehensive brand identity and website design for a creative agency, focusing on user-centric aesthetics.',
        tech: ['Figma', 'Adobe XD', 'Photoshop'],
        mockupType: 'dark',
    }
];

/* ── COMPONENTS ───────────────────────────────── */

const ProjectCard = ({ project, index, isVisible }: { project: Project; index: number; isVisible: boolean }) => {
    return (
        <div 
            className={`project-card-wrapper ${isVisible ? 'visible' : ''}`}
            style={{ transitionDelay: `${index * 0.1}s` } as React.CSSProperties}
        >
            <div className="project-card">
                {/* Mockup Container */}
                <div className="mockup-container">
                    {/* Mockup Content Rendering */}
                    <div className={`mockup-content ${project.mockupType === 'dark' ? 'mockup-bg-dark' : 'mockup-bg-light'}`}>
                        {project.mockupType === 'grid' && (
                            <>
                                <div className="mockup-grid-header" />
                                <div className="mockup-grid-items">
                                    <div className="grid-item-blue" />
                                    <div className="grid-item-green" />
                                    <div className="grid-item-orange" />
                                    <div className="grid-item-red" />
                                </div>
                            </>
                        )}
                        {project.mockupType === 'browser' && (
                            <div className="mockup-browser-frame">
                                <div className="browser-bar">
                                    <div className="browser-url" />
                                    <div className="browser-dot" />
                                </div>
                                <div className="browser-content-grid">
                                    <div className="browser-box" />
                                    <div className="browser-box" />
                                </div>
                            </div>
                        )}
                        {project.mockupType === 'dark' && (
                            <div className="mockup-dark-items">
                                <div className="dark-bar-long" />
                                <div className="dark-bar-short" />
                                <div className="dark-button" />
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="project-name">
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
                    <div className="project-link">
                        <ExternalLink size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Projects() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [isVisible, setIsVisible] = useState(false);
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

                {/* Grid */}
                <div className="projects-grid">
                    {filteredProjects.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} isVisible={isVisible} />
                    ))}
                </div>

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
