'use client';
import React, { useState, useEffect } from 'react';
import { Code, Trash2, Edit2, Save, RefreshCw, Layers, Search, Sparkles, Info, Check } from 'lucide-react';
import './SkillsPanel.css';

interface SkillData {
    id: string;
    name: string;
    color: string;
    slug: string;
    desc: string;
    page: number;
    created_at: string;
}

const POPULAR_SLUGS = [
    // Frontend
    { name: 'HTML5', slug: 'html', color: '#e34f26', category: 'Frontend' },
    { name: 'CSS3', slug: 'css', color: '#1572b6', category: 'Frontend' },
    { name: 'JavaScript', slug: 'js', color: '#f7df1e', category: 'Frontend' },
    { name: 'TypeScript', slug: 'ts', color: '#3178c6', category: 'Frontend' },
    { name: 'React', slug: 'react', color: '#61dafb', category: 'Frontend' },
    { name: 'Next.js', slug: 'nextjs', color: '#ffffff', category: 'Frontend' },
    { name: 'Vue', slug: 'vue', color: '#4fc08d', category: 'Frontend' },
    { name: 'Angular', slug: 'angular', color: '#dd0031', category: 'Frontend' },
    { name: 'Svelte', slug: 'svelte', color: '#ff3e00', category: 'Frontend' },
    { name: 'Tailwind CSS', slug: 'tailwind', color: '#06b6d4', category: 'Frontend' },
    { name: 'Sass', slug: 'sass', color: '#cc6699', category: 'Frontend' },
    { name: 'Redux', slug: 'redux', color: '#764abc', category: 'Frontend' },
    { name: 'Bootstrap', slug: 'bootstrap', color: '#7952b3', category: 'Frontend' },
    { name: 'Vite', slug: 'vite', color: '#646cff', category: 'Frontend' },
    { name: 'Figma', slug: 'figma', color: '#f24e1e', category: 'Frontend' },
    { name: 'Webpack', slug: 'webpack', color: '#8dd6f9', category: 'Frontend' },
    { name: 'jQuery', slug: 'jquery', color: '#0769ad', category: 'Frontend' },
    
    // Backend & Database
    { name: 'Node.js', slug: 'nodejs', color: '#339933', category: 'Backend & DB' },
    { name: 'Express.js', slug: 'express', color: '#ffffff', category: 'Backend & DB' },
    { name: 'NestJS', slug: 'nestjs', color: '#e0234e', category: 'Backend & DB' },
    { name: 'Python', slug: 'py', color: '#3776ab', category: 'Backend & DB' },
    { name: 'Django', slug: 'django', color: '#092e20', category: 'Backend & DB' },
    { name: 'Flask', slug: 'flask', color: '#ffffff', category: 'Backend & DB' },
    { name: 'FastAPI', slug: 'fastapi', color: '#009688', category: 'Backend & DB' },
    { name: 'Java', slug: 'java', color: '#007396', category: 'Backend & DB' },
    { name: 'Spring Boot', slug: 'spring', color: '#6db33f', category: 'Backend & DB' },
    { name: 'Go', slug: 'go', color: '#00add8', category: 'Backend & DB' },
    { name: 'Rust', slug: 'rust', color: '#dea584', category: 'Backend & DB' },
    { name: 'C++', slug: 'cpp', color: '#00599c', category: 'Backend & DB' },
    { name: 'C#', slug: 'cs', color: '#239120', category: 'Backend & DB' },
    { name: 'PHP', slug: 'php', color: '#777bb4', category: 'Backend & DB' },
    { name: 'Laravel', slug: 'laravel', color: '#ff2d20', category: 'Backend & DB' },
    { name: 'MongoDB', slug: 'mongodb', color: '#47a248', category: 'Backend & DB' },
    { name: 'PostgreSQL', slug: 'postgres', color: '#4169e1', category: 'Backend & DB' },
    { name: 'MySQL', slug: 'mysql', color: '#4479a1', category: 'Backend & DB' },
    { name: 'SQLite', slug: 'sqlite', color: '#003b57', category: 'Backend & DB' },
    { name: 'Redis', slug: 'redis', color: '#dc382d', category: 'Backend & DB' },
    { name: 'GraphQL', slug: 'graphql', color: '#e10098', category: 'Backend & DB' },
    { name: 'Prisma', slug: 'prisma', color: '#2d3748', category: 'Backend & DB' },
    { name: 'Firebase', slug: 'firebase', color: '#ffca28', category: 'Backend & DB' },
    { name: 'Supabase', slug: 'supabase', color: '#3ecf8e', category: 'Backend & DB' },
    
    // DevOps & Cloud & Tools
    { name: 'Git', slug: 'git', color: '#f05032', category: 'DevOps & Cloud' },
    { name: 'GitHub', slug: 'github', color: '#ffffff', category: 'DevOps & Cloud' },
    { name: 'Docker', slug: 'docker', color: '#2496ed', category: 'DevOps & Cloud' },
    { name: 'Kubernetes', slug: 'kubernetes', color: '#326ce5', category: 'DevOps & Cloud' },
    { name: 'AWS', slug: 'aws', color: '#ff9900', category: 'DevOps & Cloud' },
    { name: 'Google Cloud', slug: 'gcp', color: '#4285f4', category: 'DevOps & Cloud' },
    { name: 'Vercel', slug: 'vercel', color: '#ffffff', category: 'DevOps & Cloud' },
    { name: 'Netlify', slug: 'netlify', color: '#00c8c8', category: 'DevOps & Cloud' },
    { name: 'Linux', slug: 'linux', color: '#fcc624', category: 'DevOps & Cloud' },
    { name: 'Nginx', slug: 'nginx', color: '#009639', category: 'DevOps & Cloud' },
    { name: 'VS Code', slug: 'vscode', color: '#007acc', category: 'DevOps & Cloud' },
    { name: 'Postman', slug: 'postman', color: '#ff6c37', category: 'DevOps & Cloud' },
    { name: 'Jenkins', slug: 'jenkins', color: '#d24939', category: 'DevOps & Cloud' }
];

export default function SkillsPanel() {
    const [skills, setSkills] = useState<SkillData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [slugSearchQuery, setSlugSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPageFilter, setSelectedPageFilter] = useState('All');

    // Form states
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [color, setColor] = useState('#7c5cff');
    const [slug, setSlug] = useState('');
    const [desc, setDesc] = useState('');
    const [page, setPage] = useState(1);

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/skills/');
            if (!response.ok) throw new Error('Failed to fetch skills');
            const data = await response.json();
            setSkills(data);
            setError(null);
        } catch (err) {
            setError('Could not connect to the backend database.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        // Validate page limit of 12 items
        const targetPage = Number(page);
        const existingCountOnPage = skills.filter(s => s.page === targetPage && s.id !== editingId).length;
        if (existingCountOnPage >= 12) {
            setError(`Display Page ${targetPage} already has the maximum limit of 12 technologies. Please select a different page or delete/reassign an existing technology first.`);
            setSaving(false);
            return;
        }

        const payload = {
            name: name.trim(),
            color: color.trim(),
            slug: slug.toLowerCase().trim(),
            desc: desc.trim(),
            page: targetPage
        };

        try {
            let response;
            if (editingId) {
                // Update existing skill
                response = await fetch(`/api/skills/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Add new skill
                response = await fetch('/api/skills/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (!response.ok) throw new Error('Failed to save skill entry');

            setSuccessMessage(editingId ? 'Technology updated successfully!' : 'Technology added successfully!');
            resetForm();
            fetchSkills();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error(err);
            setError('Could not connect to the backend server. Please verify your connection.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (skill: SkillData) => {
        setEditingId(skill.id);
        setName(skill.name);
        setColor(skill.color);
        setSlug(skill.slug);
        setDesc(skill.desc);
        setPage(skill.page);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this technology from your Tech Stack?')) return;
        
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch(`/api/skills/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete skill');

            setSuccessMessage('Technology deleted successfully!');
            fetchSkills();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error(err);
            setError('Could not delete technology.');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setColor('#7c5cff');
        setSlug('');
        setDesc('');
        setPage(1);
    };

    const filteredSkills = skills.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              s.slug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPage = selectedPageFilter === 'All' || s.page === Number(selectedPageFilter);
        return matchesSearch && matchesPage;
    });

    const filteredPopularSlugs = POPULAR_SLUGS.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(slugSearchQuery.toLowerCase()) || 
                              s.slug.toLowerCase().includes(slugSearchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleSelectSlug = (s: { name: string; slug: string; color: string }) => {
        setName(s.name);
        setSlug(s.slug);
        setColor(s.color);
        setSuccessMessage(`Pre-filled "${s.name}" details!`);
        setTimeout(() => setSuccessMessage(null), 2500);
    };

    if (loading && skills.length === 0) {
        return <div className="admin-loading">Loading tech stack...</div>;
    }

    return (
        <div className="skills-main-layout">
            {/* Top Grid: Add/Edit Form & Clickable Skillicon Slugs Library */}
            <div className="skills-top-grid">
                
                {/* 1. Left Section: Add/Edit Technology Form */}
                <form onSubmit={handleSubmit} className="settings-card experience-form-card skills-form-container">
                    <div>
                        <div className="settings-card-header" style={{ marginBottom: '20px', paddingBottom: '12px' }}>
                            <Code size={18} className="card-header-icon" />
                            <h3 style={{ margin: 0, fontSize: '16px' }}>
                                {editingId ? 'Edit Technology' : 'Add New Tech'}
                            </h3>
                        </div>

                        {successMessage && <div className="admin-success-toast" style={{ marginBottom: '16px' }}>{successMessage}</div>}
                        {error && <div className="admin-error" style={{ marginBottom: '16px' }}>{error}</div>}

                        <div className="form-group">
                            <label htmlFor="skill-name">Technology Name *</label>
                            <input
                                id="skill-name"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. React, Next.js"
                                required
                            />
                        </div>

                        <div className="form-grid-two">
                            <div className="form-group">
                                <label htmlFor="skill-slug">Skillicon Slug *</label>
                                <input
                                    id="skill-slug"
                                    type="text"
                                    value={slug}
                                    onChange={e => setSlug(e.target.value.toLowerCase())}
                                    placeholder="e.g. react, nextjs, tailwind"
                                    required
                                />
                                <small style={{ color: '#7070a0', fontSize: '11px', marginTop: '4px' }}>
                                    Or click any icon on the right to pre-fill!
                                </small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="skill-color">Hex Color Theme *</label>
                                <div className="color-picker-row">
                                    <input
                                        id="skill-color"
                                        type="text"
                                        value={color}
                                        onChange={e => setColor(e.target.value)}
                                        placeholder="e.g. #61DAFB"
                                        required
                                        className="color-text-input"
                                    />
                                    <input
                                        type="color"
                                        value={color.startsWith('#') && color.length === 7 ? color : '#7c5cff'}
                                        onChange={e => setColor(e.target.value)}
                                        className="color-input-button"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Live Icon Preview Inside Form */}
                        {slug && (
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label>Live Icon Preview</label>
                                <div className="skills-icon-preview" style={{ padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed rgba(124, 92, 255, 0.2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: `1px solid ${color || '#7c5cff'}33`, padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`https://skillicons.dev/icons?i=${slug.toLowerCase().trim()}`}
                                                alt={name || "Preview"}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://skillicons.dev/icons?i=unknown';
                                                }}
                                                style={{ width: '32px', height: '32px' }}
                                            />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{name || 'Technology'}</div>
                                            <div style={{ fontSize: '11px', color: '#7070a0', fontFamily: 'monospace' }}>slug: {slug}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="skill-page">Display Page *</label>
                            <select
                                id="skill-page"
                                value={page}
                                onChange={e => setPage(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(124, 92, 255, 0.1)',
                                    borderRadius: '8px',
                                    padding: '12px 16px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            >
                                <option value={1} style={{ background: '#0e0e28' }}>Page 1 (Core Skills)</option>
                                <option value={2} style={{ background: '#0e0e28' }}>Page 2 (Advanced Skills)</option>
                                <option value={3} style={{ background: '#0e0e28' }}>Page 3 (Specialist Skills)</option>
                                <option value={4} style={{ background: '#0e0e28' }}>Page 4 (Additional Skills)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="skill-desc">Short Description *</label>
                            <textarea
                                id="skill-desc"
                                value={desc}
                                onChange={e => setDesc(e.target.value)}
                                placeholder="e.g. Building reusable UI components with a declarative approach..."
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions-row" style={{ marginTop: '20px' }}>
                        {editingId && (
                            <button 
                                type="button" 
                                className="remove-action-btn"
                                onClick={resetForm}
                                style={{ margin: 0, padding: '10px 18px', width: 'auto' }}
                            >
                                Cancel Edit
                            </button>
                        )}
                        <button 
                            type="submit" 
                            className="save-settings-btn" 
                            disabled={saving}
                            style={{ flex: 1, justifyContent: 'center' }}
                        >
                            {saving ? (
                                <>
                                    <RefreshCw size={16} className="spin-icon" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} /> {editingId ? 'Update Tech' : 'Add Tech'}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* 2. Right Section: Skillicon Slugs Grid Library */}
                <div className="settings-card slugs-library-card">
                    <div className="settings-card-header slugs-library-header" style={{ marginBottom: '16px', paddingBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={18} className="card-header-icon" style={{ color: '#a78bfa' }} />
                            <h3 style={{ margin: 0, fontSize: '16px' }}>Skillicon Slugs Library</h3>
                        </div>
                        <span className="slug-library-badge" style={{ fontSize: '11px', background: 'rgba(167, 139, 250, 0.1)', color: '#a78bfa', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>
                            Click to fill form!
                        </span>
                    </div>

                    <div className="slugs-explanation" style={{ display: 'flex', gap: '10px', background: 'rgba(124, 92, 255, 0.03)', border: '1px solid rgba(124, 92, 255, 0.08)', borderRadius: '8px', padding: '12px', marginBottom: '20px' }}>
                        <Info size={16} style={{ color: '#7c5cff', flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ margin: 0, fontSize: '12px', color: '#7070a0', lineHeight: 1.4 }}>
                            Select any pre-configured technology below to automatically populate the <strong>Name</strong>, <strong>Slug</strong>, and <strong>Color</strong> fields instantly!
                        </p>
                    </div>

                    {/* Tabs / Categories Filter */}
                    <div className="slug-categories-tabs">
                        {['All', 'Frontend', 'Backend & DB', 'DevOps & Cloud'].map(cat => (
                            <button
                                key={cat}
                                type="button"
                                className={`slug-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid',
                                    borderColor: selectedCategory === cat ? 'rgba(124, 92, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                                    background: selectedCategory === cat ? 'rgba(124, 92, 255, 0.15)' : 'rgba(255, 255, 255, 0.01)',
                                    color: selectedCategory === cat ? '#a78bfa' : '#7070a0',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Slugs Search Bar */}
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                placeholder="Search popular slugs (e.g. react, docker, python)..."
                                value={slugSearchQuery}
                                onChange={e => setSlugSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(124, 92, 255, 0.08)',
                                    borderRadius: '8px',
                                    padding: '10px 16px 10px 38px',
                                    color: '#fff',
                                    fontSize: '13px',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                            <Search size={14} style={{ position: 'absolute', left: '14px', color: '#7070a0', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    {/* Clickable Badges Scroll Container */}
                    <div className="slugs-grid-scroll" style={{ flex: 1, overflowY: 'auto', maxHeight: '315px', paddingRight: '4px' }}>
                        {filteredPopularSlugs.length === 0 ? (
                            <div className="no-messages" style={{ padding: '40px', fontSize: '13px' }}>
                                No matching slugs found.
                            </div>
                        ) : (
                            <div className="slugs-grid-container">
                                {filteredPopularSlugs.map(s => {
                                    const isSelected = slug === s.slug;
                                    return (
                                        <div
                                            key={s.slug}
                                            onClick={() => handleSelectSlug(s)}
                                            style={{
                                                background: isSelected ? 'rgba(124, 92, 255, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                                                border: isSelected ? '1px solid #7c5cff' : '1px solid rgba(255, 255, 255, 0.03)',
                                                borderRadius: '8px',
                                                padding: '8px 10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                            className="slug-grid-item"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`https://skillicons.dev/icons?i=${s.slug}`}
                                                alt={s.name}
                                                style={{ width: '22px', height: '22px', flexShrink: 0 }}
                                            />
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontSize: '11px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {s.name}
                                                </div>
                                                <div style={{ fontSize: '9px', color: '#7070a0', fontFamily: 'monospace' }}>
                                                    {s.slug}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div style={{ position: 'absolute', right: '4px', top: '4px', background: '#7c5cff', borderRadius: '50%', width: '12px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Check size={8} style={{ color: '#fff' }} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Bottom Row: Full-width Stored Technologies Panel */}
            <div className="settings-card stored-tech-card" style={{ marginTop: '30px' }}>
                <div className="settings-card-header" style={{ marginBottom: '20px', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Layers size={18} className="card-header-icon" />
                        <h3 style={{ margin: 0, fontSize: '16px', whiteSpace: 'nowrap' }}>Stored Technologies ({skills.length})</h3>
                    </div>

                    {/* Centered Page Filter Tabs */}
                    <div className="page-filters-row">
                        {['All', '1', '2', '3', '4'].map(p => (
                            <button
                                key={p}
                                type="button"
                                className={`slug-tab-btn ${selectedPageFilter === p ? 'active' : ''}`}
                                onClick={() => setSelectedPageFilter(p)}
                                style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid',
                                    borderColor: selectedPageFilter === p ? 'rgba(124, 92, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                                    background: selectedPageFilter === p ? 'rgba(124, 92, 255, 0.15)' : 'rgba(255, 255, 255, 0.01)',
                                    color: selectedPageFilter === p ? '#a78bfa' : '#7070a0',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {p === 'All' ? 'All Pages' : `Page ${p}`}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar for Stored Technologies */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '220px', maxWidth: '100%' }}>
                        <input
                            type="text"
                            placeholder="Search technologies..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(124, 92, 255, 0.08)',
                                borderRadius: '20px',
                                padding: '5px 12px 5px 30px',
                                color: '#fff',
                                fontSize: '11px',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                        />
                        <Search size={12} style={{ position: 'absolute', left: '11px', color: '#7070a0', pointerEvents: 'none' }} />
                    </div>
                </div>

                {filteredSkills.length === 0 ? (
                    <div className="no-messages" style={{ padding: '60px' }}>
                        {searchQuery || selectedPageFilter !== 'All' ? 'No technologies match your current search/page filter.' : 'No technologies added yet. Add your first technology above!'}
                    </div>
                ) : (
                    <div className="stored-tech-grid-layout">
                        {filteredSkills.map(s => (
                            <div key={s.id} className="admin-exp-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', margin: 0 }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${s.color}33`, padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`https://skillicons.dev/icons?i=${s.slug}`}
                                        alt={s.name}
                                        style={{ width: '30px', height: '30px' }}
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="admin-exp-header" style={{ margin: 0, padding: 0, border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                        <div className="admin-exp-info" style={{ minWidth: 0 }}>
                                            <div className="admin-exp-title-box" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{s.name}</h4>
                                                <span style={{ fontSize: '9px', background: s.page > 2 ? 'rgba(0, 255, 136, 0.08)' : s.page === 2 ? 'rgba(0, 229, 255, 0.08)' : 'rgba(124, 92, 255, 0.08)', color: s.page > 2 ? '#00ff88' : s.page === 2 ? '#00e5ff' : '#a78bfa', padding: '1px 6px', borderRadius: '10px', fontWeight: 600 }}>
                                                    Page {s.page}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '10px', color: '#7070a0', fontFamily: 'monospace', marginTop: '2px', display: 'inline-block' }}>slug: {s.slug}</span>
                                        </div>
                                        <div className="admin-exp-actions" style={{ marginTop: 0, flexShrink: 0 }}>
                                            <button 
                                                className="action-btn edit-btn" 
                                                title="Edit Technology"
                                                onClick={() => handleEdit(s)}
                                                style={{ width: '28px', height: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <Edit2 size={13} />
                                            </button>
                                            <button 
                                                className="action-btn delete-btn" 
                                                title="Delete Technology"
                                                onClick={() => handleDelete(s.id)}
                                                style={{ width: '28px', height: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="admin-exp-desc" style={{ marginTop: '8px', marginBottom: 0, fontSize: '12px', color: '#7070a0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.4' }}>
                                        {s.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
