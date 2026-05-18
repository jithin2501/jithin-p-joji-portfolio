'use client';
import React, { useState, useEffect } from 'react';
import {
    GraduationCap, Book, Pencil, Award, 
    Save, Trash2, Edit, Plus, RefreshCw, 
    Sliders, MapPin, Building2, Calendar, CheckCircle
} from 'lucide-react';

interface AcademicEntry {
    id: string;
    title: string;
    school: string;
    location: string;
    date_range: string;
    score: string;
    color_theme: string;
    icon_type: string;
}

interface AcademicSettings {
    description: string;
    highlights: string[];
    stat1_label: string;
    stat1_value: string;
    stat2_label: string;
    stat2_value: string;
    stat3_label: string;
    stat3_value: string;
}

export default function AcademicPanel() {
    // Academic Entries list and form state
    const [academics, setAcademics] = useState<AcademicEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form inputs for single entry
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [school, setSchool] = useState('');
    const [location, setLocation] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [score, setScore] = useState('');
    const [colorTheme, setColorTheme] = useState('purple');
    const [iconType, setIconType] = useState('graduation');
    const [saving, setSaving] = useState(false);

    // Left Column Settings state
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [description, setDescription] = useState('');
    const [highlight1, setHighlight1] = useState('');
    const [highlight2, setHighlight2] = useState('');
    const [highlight3, setHighlight3] = useState('');
    const [highlight4, setHighlight4] = useState('');
    const [highlight5, setHighlight5] = useState('');
    
    const [stat1Label, setStat1Label] = useState('');
    const [stat1Value, setStat1Value] = useState('');
    const [stat2Label, setStat2Label] = useState('');
    const [stat2Value, setStat2Value] = useState('');
    const [stat3Label, setStat3Label] = useState('');
    const [stat3Value, setStat3Value] = useState('');
    
    const [savingSettings, setSavingSettings] = useState(false);
    const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);
    const [settingsError, setSettingsError] = useState<string | null>(null);

    // Fetch Academic Timeline entries
    const fetchAcademics = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/academics/');
            if (!res.ok) throw new Error('Failed to fetch academics');
            const data = await res.json();
            setAcademics(data);
        } catch (err) {
            console.error(err);
            setError('Could not connect to backend to retrieve academic entries.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch Academic Settings
    const fetchSettings = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/academics/settings');
            if (!res.ok) throw new Error('Failed to fetch settings');
            const data: AcademicSettings = await res.json();
            setDescription(data.description);
            setHighlight1(data.highlights[0] || '');
            setHighlight2(data.highlights[1] || '');
            setHighlight3(data.highlights[2] || '');
            setHighlight4(data.highlights[3] || '');
            setHighlight5(data.highlights[4] || '');
            setStat1Label(data.stat1_label);
            setStat1Value(data.stat1_value);
            setStat2Label(data.stat2_label);
            setStat2Value(data.stat2_value);
            setStat3Label(data.stat3_label);
            setStat3Value(data.stat3_value);
        } catch (err) {
            console.error(err);
            setSettingsError('Could not retrieve general academic path configurations.');
        } finally {
            setSettingsLoading(false);
        }
    };

    useEffect(() => {
        fetchAcademics();
        fetchSettings();
    }, []);

    // Handle Entry Submit (Create / Update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        const payload = {
            title: title.trim(),
            school: school.trim(),
            location: location.trim(),
            date_range: dateRange.trim(),
            score: score.trim(),
            color_theme: colorTheme,
            icon_type: iconType
        };

        try {
            let res;
            if (editingId) {
                res = await fetch(`http://localhost:8080/api/academics/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('http://localhost:8080/api/academics/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (!res.ok) throw new Error('Operation failed');

            setSuccessMessage(editingId ? 'Academic entry updated successfully!' : 'Academic entry created successfully!');
            resetForm();
            fetchAcademics();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to save academic entry. Please check your inputs and backend server.');
        } finally {
            setSaving(false);
        }
    };

    // Edit entry loader
    const handleEdit = (entry: AcademicEntry) => {
        setEditingId(entry.id);
        setTitle(entry.title);
        setSchool(entry.school);
        setLocation(entry.location);
        setDateRange(entry.date_range);
        setScore(entry.score);
        setColorTheme(entry.color_theme);
        setIconType(entry.icon_type);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Delete entry
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this education milestone?')) return;
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await fetch(`http://localhost:8080/api/academics/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Delete failed');
            setSuccessMessage('Education milestone deleted successfully!');
            fetchAcademics();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError('Failed to delete education entry.');
            console.error(err);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setSchool('');
        setLocation('');
        setDateRange('');
        setScore('');
        setColorTheme('purple');
        setIconType('graduation');
    };

    // Handle Left Column Settings Submit
    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingSettings(true);
        setSettingsSuccess(null);
        setSettingsError(null);

        const payload = {
            description: description.trim(),
            highlights: [
                highlight1.trim(),
                highlight2.trim(),
                highlight3.trim(),
                highlight4.trim(),
                highlight5.trim()
            ].filter(h => h.length > 0),
            stat1_label: stat1Label.trim(),
            stat1_value: stat1Value.trim(),
            stat2_label: stat2Label.trim(),
            stat2_value: stat2Value.trim(),
            stat3_label: stat3Label.trim(),
            stat3_value: stat3Value.trim()
        };

        try {
            const res = await fetch('http://localhost:8080/api/academics/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to save settings');
            setSettingsSuccess('Academic description and highlights updated successfully!');
            setTimeout(() => setSettingsSuccess(null), 3000);
        } catch (err) {
            console.error(err);
            setSettingsError('Failed to save academic path configurations.');
        } finally {
            setSavingSettings(false);
        }
    };

    const renderIcon = (type: string, color: string) => {
        const hex = color === 'purple' ? '#7c5cff' : color === 'blue' || color === 'cyan' ? '#00e5ff' : '#00ff88';
        switch (type) {
            case 'book': return <Book size={18} color={hex} />;
            case 'pencil': return <Pencil size={18} color={hex} />;
            case 'award': return <Award size={18} color={hex} />;
            default: return <GraduationCap size={18} color={hex} />;
        }
    };

    if (loading && academics.length === 0) {
        return <div className="admin-loading">Loading academic details...</div>;
    }

    return (
        <div className="experience-manager-grid">
            {/* Left Side: Create/Edit and Settings Form */}
            <div className="experience-manager-left">
                {/* Milestone Form */}
                <form onSubmit={handleSubmit} className="settings-card experience-form-card">
                    <div className="settings-card-header" style={{ marginBottom: '20px', paddingBottom: '12px' }}>
                        <GraduationCap size={18} className="card-header-icon" />
                        <h3 style={{ margin: 0, fontSize: '16px' }}>
                            {editingId ? 'Edit Education Entry' : 'Add New Academic Milestone'}
                        </h3>
                    </div>

                    {successMessage && <div className="admin-success-toast" style={{ marginBottom: '16px' }}>{successMessage}</div>}
                    {error && <div className="admin-error" style={{ marginBottom: '16px' }}>{error}</div>}

                    <div className="form-group">
                        <label htmlFor="acad-title">Degree / Certificate Name *</label>
                        <input
                            id="acad-title"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. B.Tech in Computer Science & Engineering"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="acad-school">School / University *</label>
                        <input
                            id="acad-school"
                            type="text"
                            value={school}
                            onChange={e => setSchool(e.target.value)}
                            placeholder="e.g. Visvesvaraya Technological University"
                            required
                        />
                    </div>

                    <div className="form-grid-two">
                        <div className="form-group">
                            <label htmlFor="acad-loc">Location / Specialized Subjects *</label>
                            <input
                                id="acad-loc"
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                placeholder="e.g. Belagavi, Karnataka or Science (PCMB)"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="acad-score">Performance Score / CGPA *</label>
                            <input
                                id="acad-score"
                                type="text"
                                value={score}
                                onChange={e => setScore(e.target.value)}
                                placeholder="e.g. 8.5 CGPA or 91%"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-grid-three">
                        <div className="form-group">
                            <label htmlFor="acad-dates">Date Range *</label>
                            <input
                                id="acad-dates"
                                type="text"
                                value={dateRange}
                                onChange={e => setDateRange(e.target.value)}
                                placeholder="e.g. 2022 - 2026"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="acad-color">Accent Color Theme</label>
                            <select
                                id="acad-color"
                                value={colorTheme}
                                onChange={e => setColorTheme(e.target.value)}
                            >
                                <option value="purple">Purple Theme</option>
                                <option value="blue">Cyan / Blue Theme</option>
                                <option value="green">Green Theme</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="acad-icon">Timeline Icon</label>
                            <select
                                id="acad-icon"
                                value={iconType}
                                onChange={e => setIconType(e.target.value)}
                            >
                                <option value="graduation">Graduation Cap</option>
                                <option value="book">Open Book</option>
                                <option value="pencil">Pencil</option>
                                <option value="award">Badge / Award</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions-row">
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
                                    <Save size={16} /> {editingId ? 'Update Milestone' : 'Add Milestone'}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Left Side Description & Highlights Form */}
                <form onSubmit={handleSaveSettings} className="settings-card experience-form-card" style={{ marginTop: '24px' }}>
                    <div className="settings-card-header" style={{ marginBottom: '20px', paddingBottom: '12px' }}>
                        <Sliders size={18} className="card-header-icon" />
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Academic Summary & Highlights</h3>
                    </div>

                    {settingsSuccess && <div className="admin-success-toast" style={{ marginBottom: '16px' }}>{settingsSuccess}</div>}
                    {settingsError && <div className="admin-error" style={{ marginBottom: '16px' }}>{settingsError}</div>}

                    <div className="form-group">
                        <label htmlFor="acad-desc-text">Left-side Description Text</label>
                        <textarea
                            id="acad-desc-text"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe your academic foundation mindset..."
                            rows={3}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Academic Highlights (5 list points)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input
                                type="text"
                                value={highlight1}
                                onChange={e => setHighlight1(e.target.value)}
                                placeholder="Highlight 1 (e.g. Consistent Academic Excellence)"
                                required
                            />
                            <input
                                type="text"
                                value={highlight2}
                                onChange={e => setHighlight2(e.target.value)}
                                placeholder="Highlight 2 (e.g. Major Focus in Software Engineering)"
                                required
                            />
                            <input
                                type="text"
                                value={highlight3}
                                onChange={e => setHighlight3(e.target.value)}
                                placeholder="Highlight 3 (e.g. 10+ Technical Semester Projects)"
                                required
                            />
                            <input
                                type="text"
                                value={highlight4}
                                onChange={e => setHighlight4(e.target.value)}
                                placeholder="Highlight 4 (e.g. Consistent Dean's List Awardee)"
                                required
                            />
                            <input
                                type="text"
                                value={highlight5}
                                onChange={e => setHighlight5(e.target.value)}
                                placeholder="Highlight 5 (e.g. Specialized in Full-Stack Dev)"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Academic Stats Grid (3 display cards)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                            <input
                                type="text"
                                value={stat1Label}
                                onChange={e => setStat1Label(e.target.value)}
                                placeholder="Stat 1 Label (e.g. B.Tech)"
                                required
                            />
                            <input
                                type="text"
                                value={stat1Value}
                                onChange={e => setStat1Value(e.target.value)}
                                placeholder="Stat 1 Value (e.g. 8.5)"
                                required
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '8px' }}>
                            <input
                                type="text"
                                value={stat2Label}
                                onChange={e => setStat2Label(e.target.value)}
                                placeholder="Stat 2 Label (e.g. 12th (PCMB))"
                                required
                            />
                            <input
                                type="text"
                                value={stat2Value}
                                onChange={e => setStat2Value(e.target.value)}
                                placeholder="Stat 2 Value (e.g. 91%)"
                                required
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <input
                                type="text"
                                value={stat3Label}
                                onChange={e => setStat3Label(e.target.value)}
                                placeholder="Stat 3 Label (e.g. 10th)"
                                required
                            />
                            <input
                                type="text"
                                value={stat3Value}
                                onChange={e => setStat3Value(e.target.value)}
                                placeholder="Stat 3 Value (e.g. 80%)"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="save-settings-btn" 
                        disabled={savingSettings}
                        style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                    >
                        {savingSettings ? (
                            <>
                                <RefreshCw size={16} className="spin-icon" /> Saving Summary...
                            </>
                        ) : (
                            <>
                                <Save size={16} /> Save Academic Summary
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Right Side: Interactive Stored Entries Timeline */}
            <div className="experience-manager-right">
                <div className="settings-card-header" style={{ marginBottom: '16px', paddingBottom: '12px' }}>
                    <GraduationCap size={18} className="card-header-icon" />
                    <h3 style={{ margin: 0, fontSize: '16px' }}>Stored Timeline Milestones ({academics.length})</h3>
                </div>

                <div className="stored-experiences-list">
                    {academics.length === 0 ? (
                        <div className="no-messages" style={{ padding: '60px' }}>
                            No academic entries saved. Add your first milestone on the left!
                        </div>
                    ) : (
                        academics.map(acad => (
                            <div key={acad.id} className="admin-exp-item">
                                <div className="admin-exp-header">
                                    <div className="admin-exp-info">
                                        <div className="admin-exp-title-box" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className="edu-school-icon-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px' }}>
                                                {renderIcon(acad.icon_type, acad.color_theme)}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '15px', color: '#fff' }}>{acad.title}</h4>
                                                <span className="admin-exp-company" style={{ color: acad.color_theme === 'purple' ? '#a78bfa' : acad.color_theme === 'blue' || acad.color_theme === 'cyan' ? '#22d3ee' : '#34d399', fontSize: '13px', fontWeight: '500' }}>
                                                    {acad.school}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="admin-exp-meta" style={{ marginTop: '10px' }}>
                                            <span className="admin-exp-date">
                                                <Calendar size={12} />
                                                {acad.date_range}
                                            </span>
                                            <span className="admin-exp-loc">
                                                <MapPin size={12} />
                                                {acad.location}
                                            </span>
                                            <span className="admin-exp-loc" style={{ color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                                                Score: {acad.score}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="admin-exp-actions" style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                            className="exp-action-btn edit-btn" 
                                            onClick={() => handleEdit(acad)}
                                            title="Edit education milestone"
                                            style={{ background: 'rgba(124, 92, 255, 0.1)', color: '#7c5cff', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button 
                                            className="exp-action-btn delete-btn" 
                                            onClick={() => handleDelete(acad.id)}
                                            title="Delete education milestone"
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
