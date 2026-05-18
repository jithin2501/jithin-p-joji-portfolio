'use client';
import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, Trash2, Edit2, Plus, Save, RefreshCw, MapPin, Tag, Sliders } from 'lucide-react';
import './ExperiencePanel.css';

interface ExperienceData {
    id: string;
    title: string;
    company: string;
    date_from: string;
    date_to: string;
    desc: string;
    tags: string[];
    location: string;
    dot_color: string;
    created_at: string;
}

export default function ExperiencePanel() {
    const [experiences, setExperiences] = useState<ExperienceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form states
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('Present');
    const [desc, setDesc] = useState('');
    const [location, setLocation] = useState('');
    const [dotColor, setDotColor] = useState('#818cf8');
    const [tagInput, setTagInput] = useState('');

    // Overall stats form states
    const [statExperience, setStatExperience] = useState('1+');
    const [statProjects, setStatProjects] = useState('20+');
    const [statClients, setStatClients] = useState('99+');
    const [savingStats, setSavingStats] = useState(false);
    const [statsSuccess, setStatsSuccess] = useState<string | null>(null);
    const [statsError, setStatsError] = useState<string | null>(null);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/experiences/');
            if (!response.ok) throw new Error('Failed to fetch experiences');
            const data = await response.json();
            setExperiences(data);
            setError(null);
        } catch (err) {
            setError('Could not connect to the backend database.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/experiences/stats');
            if (response.ok) {
                const data = await response.json();
                setStatExperience(data.statExperience || '1+');
                setStatProjects(data.statProjects || '20+');
                setStatClients(data.statClients || '99+');
            }
        } catch (err) {
            console.error('Error fetching statistics:', err);
        }
    };

    useEffect(() => {
        fetchExperiences();
        fetchStats();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        const tagsArray = tagInput
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const payload = {
            title: title.trim(),
            company: company.trim(),
            date_from: dateFrom.trim(),
            date_to: dateTo.trim(),
            desc: desc.trim(),
            tags: tagsArray,
            location: location.trim(),
            dot_color: dotColor
        };

        try {
            let response;
            if (editingId) {
                // Update existing experience
                response = await fetch(`http://localhost:8080/api/experiences/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Add new experience
                response = await fetch('http://localhost:8080/api/experiences/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (!response.ok) throw new Error('Failed to save experience entry');

            setSuccessMessage(editingId ? 'Experience entry updated successfully!' : 'Experience entry added successfully!');
            resetForm();
            fetchExperiences();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error(err);
            setError('Could not connect to the backend server. Please verify your connection.');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (exp: ExperienceData) => {
        setEditingId(exp.id);
        setTitle(exp.title);
        setCompany(exp.company);
        setDateFrom(exp.date_from);
        setDateTo(exp.date_to);
        setDesc(exp.desc);
        setLocation(exp.location);
        setDotColor(exp.dot_color || '#818cf8');
        setTagInput(exp.tags ? exp.tags.join(', ') : '');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this career experience entry?')) return;
        
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch(`http://localhost:8080/api/experiences/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete experience');

            setSuccessMessage('Experience entry deleted successfully!');
            fetchExperiences();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error(err);
            setError('Could not delete career experience.');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setCompany('');
        setDateFrom('');
        setDateTo('Present');
        setDesc('');
        setLocation('');
        setDotColor('#818cf8');
        setTagInput('');
    };

    const handleSaveStats = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingStats(true);
        setStatsSuccess(null);
        setStatsError(null);

        const payload = {
            statExperience: statExperience.trim(),
            statProjects: statProjects.trim(),
            statClients: statClients.trim()
        };

        try {
            const response = await fetch('http://localhost:8080/api/experiences/stats', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to save timeline statistics');

            setStatsSuccess('Timeline stats display updated successfully!');
            setTimeout(() => setStatsSuccess(null), 3000);
        } catch (err) {
            console.error(err);
            setStatsError('Could not save timeline statistics.');
        } finally {
            setSavingStats(false);
        }
    };

    if (loading && experiences.length === 0) {
        return <div className="admin-loading">Loading career experiences...</div>;
    }

    return (
        <div className="experience-manager-grid" style={{ display: 'grid', gridTemplateColumns: '0.75fr 1.25fr', gap: '30px', alignItems: 'stretch' }}>
            {/* Box 1 (Row 1 Left): Add/Edit Experience Form */}
            <form onSubmit={handleSubmit} className="settings-card experience-form-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}>
                <div>
                    <div className="settings-card-header" style={{ marginBottom: '20px', paddingBottom: '12px' }}>
                        <Briefcase size={18} className="card-header-icon" />
                        <h3 style={{ margin: 0, fontSize: '16px' }}>
                            {editingId ? 'Edit Experience Entry' : 'Add New Experience'}
                        </h3>
                    </div>

                    {successMessage && <div className="admin-success-toast" style={{ marginBottom: '16px' }}>{successMessage}</div>}
                    {error && <div className="admin-error" style={{ marginBottom: '16px' }}>{error}</div>}

                    <div className="form-grid-two">
                        <div className="form-group">
                            <label htmlFor="exp-title">Job Title *</label>
                            <input
                                id="exp-title"
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Full Stack Developer"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exp-company">Company Name *</label>
                            <input
                                id="exp-company"
                                type="text"
                                value={company}
                                onChange={e => setCompany(e.target.value)}
                                placeholder="RP Studios"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-grid-two">
                        <div className="form-group">
                            <label htmlFor="exp-from">Duration From *</label>
                            <input
                                id="exp-from"
                                type="text"
                                value={dateFrom}
                                onChange={e => setDateFrom(e.target.value)}
                                placeholder="Mar 2026"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exp-to">Duration To *</label>
                            <input
                                id="exp-to"
                                type="text"
                                value={dateTo}
                                onChange={e => setDateTo(e.target.value)}
                                placeholder="Present or May 2026"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label htmlFor="exp-location">Location (e.g. Bangalore)</label>
                        <div className="input-with-icon">
                            <MapPin size={16} className="input-field-icon" />
                            <input
                                id="exp-location"
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                placeholder="Bangalore, India"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="exp-tags">Technologies Used (comma separated)</label>
                        <div className="input-with-icon">
                            <Tag size={16} className="input-field-icon" />
                            <input
                                id="exp-tags"
                                type="text"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                placeholder="React, Node.js, MongoDB, Docker"
                            />
                        </div>
                        {tagInput.trim() && (
                            <div className="tags-live-preview">
                                {tagInput.split(',').map(t => t.trim()).filter(t => t.length > 0).map((t, idx) => (
                                    <span key={idx} className="live-preview-tag" style={{ borderLeftColor: dotColor }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="exp-desc">Job Details & Roles *</label>
                        <textarea
                            id="exp-desc"
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            placeholder="Describe your responsibilities, technical stacks managed, accomplishments..."
                            rows={5}
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
                                <Save size={16} /> {editingId ? 'Update Entry' : 'Add Experience'}
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Box 2 (Row 1 Right): Stored Timeline Entries Card */}
            <div className="settings-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: 0 }}>
                <div className="settings-card-header" style={{ marginBottom: '20px', paddingBottom: '12px' }}>
                    <Briefcase size={18} className="card-header-icon" />
                    <h3 style={{ margin: 0, fontSize: '16px' }}>Stored Timeline Entries ({experiences.length})</h3>
                </div>

                <div className="stored-experiences-list" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                    {experiences.length === 0 ? (
                        <div className="no-messages" style={{ padding: '60px' }}>
                            No career experiences saved. Add your first job on the left!
                        </div>
                    ) : (
                        experiences.map(exp => (
                            <div key={exp.id} className="admin-exp-item" style={{ marginBottom: '16px' }}>
                                <div className="admin-exp-header">
                                    <div className="admin-exp-info">
                                        <div className="admin-exp-title-box">
                                            <h4>{exp.title}</h4>
                                            <span className="admin-exp-company" style={{ color: exp.dot_color }}>
                                                {exp.company}
                                            </span>
                                        </div>
                                        <div className="admin-exp-meta">
                                            <span className="admin-exp-date">
                                                <Calendar size={12} />
                                                {exp.date_from} — {exp.date_to}
                                            </span>
                                            {exp.location && (
                                                <span className="admin-exp-loc">
                                                    <MapPin size={12} />
                                                    {exp.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="admin-exp-actions">
                                        <button 
                                            className="action-btn edit-btn" 
                                            title="Edit This Entry"
                                            onClick={() => handleEdit(exp)}
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        <button 
                                            className="action-btn delete-btn" 
                                            title="Delete Entry"
                                            onClick={() => handleDelete(exp.id)}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                <p className="admin-exp-desc">{exp.desc}</p>

                                {exp.tags && exp.tags.length > 0 && (
                                    <div className="admin-exp-tags">
                                        {exp.tags.map((tag, i) => (
                                            <span key={i} className="admin-exp-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Box 3 (Row 2 Left): Overall Timeline Statistics Form */}
            <form onSubmit={handleSaveStats} className="settings-card experience-form-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}>
                <div>
                    <div className="settings-card-header" style={{ marginBottom: '20px', paddingBottom: '12px' }}>
                        <Sliders size={18} className="card-header-icon" />
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Overall Timeline Statistics</h3>
                    </div>

                    {statsSuccess && <div className="admin-success-toast" style={{ marginBottom: '16px' }}>{statsSuccess}</div>}
                    {statsError && <div className="admin-error" style={{ marginBottom: '16px' }}>{statsError}</div>}

                    <div className="form-grid-three">
                        <div className="form-group">
                            <label htmlFor="stat-exp">Years Experience</label>
                            <input
                                id="stat-exp"
                                type="text"
                                value={statExperience}
                                onChange={e => setStatExperience(e.target.value)}
                                placeholder="1+"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stat-proj">Projects Completed</label>
                            <input
                                id="stat-proj"
                                type="text"
                                value={statProjects}
                                onChange={e => setStatProjects(e.target.value)}
                                placeholder="20+"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="stat-clients">Happy Clients</label>
                            <input
                                id="stat-clients"
                                type="text"
                                value={statClients}
                                onChange={e => setStatClients(e.target.value)}
                                placeholder="99+"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="save-settings-btn" 
                    disabled={savingStats}
                    style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
                >
                    {savingStats ? (
                        <>
                            <RefreshCw size={16} className="spin-icon" /> Saving Stats...
                        </>
                    ) : (
                        <>
                            <Save size={16} /> Save Timeline Statistics
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
