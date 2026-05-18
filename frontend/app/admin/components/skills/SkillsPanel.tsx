'use client';
import React, { useState, useEffect } from 'react';
import { Code, Trash2, Edit2, Save, RefreshCw, Layers, Search } from 'lucide-react';
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

export default function SkillsPanel() {
    const [skills, setSkills] = useState<SkillData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

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
            const response = await fetch('http://localhost:8080/api/skills/');
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
                response = await fetch(`http://localhost:8080/api/skills/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Add new skill
                response = await fetch('http://localhost:8080/api/skills/', {
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
            const response = await fetch(`http://localhost:8080/api/skills/${id}`, {
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

    const filteredSkills = skills.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && skills.length === 0) {
        return <div className="admin-loading">Loading tech stack...</div>;
    }

    return (
        <div className="experience-manager-grid" style={{ display: 'grid', gridTemplateColumns: '0.65fr 1.35fr', gap: '30px', alignItems: 'stretch' }}>
            {/* Left Column (Row 1 Left): Add/Edit Technology Form */}
            <form onSubmit={handleSubmit} className="settings-card experience-form-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}>
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
                                onChange={e => setSlug(e.target.value)}
                                placeholder="e.g. react, nextjs, tailwind"
                                required
                            />
                            <small style={{ color: '#7070a0', fontSize: '11px', marginTop: '4px' }}>
                                Find slugs at <a href="https://skillicons.dev" target="_blank" rel="noreferrer" style={{ color: '#7c5cff', textDecoration: 'underline' }}>skillicons.dev</a>
                            </small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="skill-color">Hex Color Theme *</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    id="skill-color"
                                    type="text"
                                    value={color}
                                    onChange={e => setColor(e.target.value)}
                                    placeholder="e.g. #61DAFB"
                                    required
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="color"
                                    value={color.startsWith('#') && color.length === 7 ? color : '#7c5cff'}
                                    onChange={e => setColor(e.target.value)}
                                    style={{ width: '42px', height: '42px', padding: '2px', border: '1px solid rgba(124, 92, 255, 0.2)', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                                />
                            </div>
                        </div>
                    </div>

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

            {/* Right Column (Row 1 Right): Stored Technologies List */}
            <div className="settings-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: 0 }}>
                <div className="settings-card-header" style={{ marginBottom: '16px', paddingBottom: '12px' }}>
                    <Layers size={18} className="card-header-icon" />
                    <h3 style={{ margin: 0, fontSize: '16px' }}>Stored Technologies ({skills.length})</h3>
                </div>

                {/* Search Bar */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Search stored technologies..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(124, 92, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '12px 16px 12px 42px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                        <Search size={16} style={{ position: 'absolute', left: '16px', color: '#7070a0', pointerEvents: 'none' }} />
                    </div>
                </div>

                <div className="stored-experiences-list" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                    {filteredSkills.length === 0 ? (
                        <div className="no-messages" style={{ padding: '60px' }}>
                            {searchQuery ? 'No technologies match your search.' : 'No technologies added. Add your first skill on the left!'}
                        </div>
                    ) : (
                        filteredSkills.map(s => (
                            <div key={s.id} className="admin-exp-item" style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${s.color}33`, padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`https://skillicons.dev/icons?i=${s.slug}`}
                                        alt={s.name}
                                        style={{ width: '32px', height: '32px' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="admin-exp-header" style={{ margin: 0, padding: 0 }}>
                                        <div className="admin-exp-info">
                                            <div className="admin-exp-title-box" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <h4 style={{ margin: 0 }}>{s.name}</h4>
                                                <span style={{ fontSize: '10px', background: s.page > 2 ? 'rgba(0, 255, 136, 0.1)' : s.page === 2 ? 'rgba(0, 229, 255, 0.1)' : 'rgba(124, 92, 255, 0.1)', color: s.page > 2 ? '#00ff88' : s.page === 2 ? '#00e5ff' : '#7c5cff', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                                                    Page {s.page}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="admin-exp-actions" style={{ marginTop: 0 }}>
                                            <button 
                                                className="action-btn edit-btn" 
                                                title="Edit Technology"
                                                onClick={() => handleEdit(s)}
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button 
                                                className="action-btn delete-btn" 
                                                title="Delete Technology"
                                                onClick={() => handleDelete(s.id)}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="admin-exp-desc" style={{ marginTop: '8px', marginBottom: 0 }}>{s.desc}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
