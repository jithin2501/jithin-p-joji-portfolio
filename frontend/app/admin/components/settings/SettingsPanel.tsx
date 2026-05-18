'use client';
import React, { useState, useEffect } from 'react';
import { Sliders, Link as LinkIcon, Share2, Save, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';

interface SettingsData {
    hero: {
        projects: string;
        experience: string;
        commits: string;
        satisfaction: string;
    };
    socials: {
        github: string;
        linkedin: string;
        email: string;
        phone: string;
        location: string;
    };
}

export default function SettingsPanel() {
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/settings/');
            if (!response.ok) throw new Error('Failed to fetch settings');
            const data = await response.json();
            setSettings(data);
            setError(null);
        } catch (err) {
            setError('Could not fetch settings from backend.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleChange = (section: 'hero' | 'socials', field: string, value: string) => {
        if (!settings) return;
        setSettings({
            ...settings,
            [section]: {
                ...settings[section],
                [field]: value
            }
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;
        setSaving(true);
        setSuccessMessage(null);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/settings/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (!response.ok) throw new Error('Failed to save settings');
            const updatedData = await response.json();
            setSettings(updatedData);
            setSuccessMessage('Settings updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError('Could not save settings.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="admin-loading">Loading settings...</div>;
    }

    if (!settings) {
        return (
            <div className="no-messages" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p>{error || 'Failed to load settings.'}</p>
                <button className="view-btn" onClick={fetchSettings} style={{ padding: '8px 16px', width: 'auto', display: 'flex', gap: '8px', margin: '0 auto' }}>
                    <RefreshCw size={16} /> Retry
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="settings-form">
            <div className="content-header">
                <h2>Portfolio Settings</h2>
                <button type="submit" className="save-settings-btn" disabled={saving}>
                    {saving ? (
                        <>
                            <RefreshCw size={16} className="spin-icon" /> Saving...
                        </>
                    ) : (
                        <>
                            <Save size={16} /> Save Changes
                        </>
                    )}
                </button>
            </div>

            {successMessage && <div className="admin-success-toast">{successMessage}</div>}
            {error && <div className="admin-error">{error}</div>}

            <div className="settings-grid">
                {/* Hero Stats Card */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <Sliders size={18} className="card-header-icon" />
                        <h3>Hero Statistics Values</h3>
                    </div>
                    <div className="settings-card-body">
                        <div className="form-group">
                            <label htmlFor="stat-projects">Projects Count (e.g. 15+)</label>
                            <input
                                id="stat-projects"
                                type="text"
                                value={settings.hero.projects || ''}
                                onChange={e => handleChange('hero', 'projects', e.target.value)}
                                placeholder="15+"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="stat-experience">Experience (e.g. 1yr)</label>
                            <input
                                id="stat-experience"
                                type="text"
                                value={settings.hero.experience || ''}
                                onChange={e => handleChange('hero', 'experience', e.target.value)}
                                placeholder="1yr"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="stat-commits">GitHub Commits (e.g. 2K+)</label>
                            <input
                                id="stat-commits"
                                type="text"
                                value={settings.hero.commits || ''}
                                onChange={e => handleChange('hero', 'commits', e.target.value)}
                                placeholder="2K+"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="stat-satisfaction">Client Satisfaction (e.g. 99%)</label>
                            <input
                                id="stat-satisfaction"
                                type="text"
                                value={settings.hero.satisfaction || ''}
                                onChange={e => handleChange('hero', 'satisfaction', e.target.value)}
                                placeholder="99%"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Social & Contact Card */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <Share2 size={18} className="card-header-icon" />
                        <h3>Social & Contact Details</h3>
                    </div>
                    <div className="settings-card-body">
                        <div className="form-group">
                            <label htmlFor="social-github">GitHub Profile URL</label>
                            <div className="input-with-icon">
                                <LinkIcon size={14} className="input-field-icon" />
                                <input
                                    id="social-github"
                                    type="url"
                                    value={settings.socials.github || ''}
                                    onChange={e => handleChange('socials', 'github', e.target.value)}
                                    placeholder="https://github.com/..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="social-linkedin">LinkedIn Profile URL</label>
                            <div className="input-with-icon">
                                <LinkIcon size={14} className="input-field-icon" />
                                <input
                                    id="social-linkedin"
                                    type="url"
                                    value={settings.socials.linkedin || ''}
                                    onChange={e => handleChange('socials', 'linkedin', e.target.value)}
                                    placeholder="https://www.linkedin.com/in/..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact-email">Email Address</label>
                            <div className="input-with-icon">
                                <Mail size={14} className="input-field-icon" />
                                <input
                                    id="contact-email"
                                    type="email"
                                    value={settings.socials.email || ''}
                                    onChange={e => handleChange('socials', 'email', e.target.value)}
                                    placeholder="your-name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact-phone">Phone Number</label>
                            <div className="input-with-icon">
                                <Phone size={14} className="input-field-icon" />
                                <input
                                    id="contact-phone"
                                    type="text"
                                    value={settings.socials.phone || ''}
                                    onChange={e => handleChange('socials', 'phone', e.target.value)}
                                    placeholder="+91 98765 43210"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact-location">Location Address</label>
                            <div className="input-with-icon">
                                <MapPin size={14} className="input-field-icon" />
                                <input
                                    id="contact-location"
                                    type="text"
                                    value={settings.socials.location || ''}
                                    onChange={e => handleChange('socials', 'location', e.target.value)}
                                    placeholder="Bengaluru, Kerala, India"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
