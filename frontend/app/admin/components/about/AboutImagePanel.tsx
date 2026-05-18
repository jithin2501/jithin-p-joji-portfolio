'use client';
import React, { useState, useEffect } from 'react';
import { User, Trash2, Upload, Save, RefreshCw } from 'lucide-react';
import './AboutImagePanel.css';

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
    about_image?: string;
}

export default function AboutImagePanel() {
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [tempImage, setTempImage] = useState<string | null>(null);
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

    const handleUpload = async () => {
        if (!settings || !tempImage) return;
        setSaving(true);
        setSuccessMessage(null);
        setError(null);

        try {
            const updatedSettings = {
                ...settings,
                about_image: tempImage
            };
            const response = await fetch('http://localhost:8080/api/settings/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedSettings)
            });

            if (!response.ok) throw new Error('Failed to save settings');
            const updatedData = await response.json();
            setSettings(updatedData);
            setTempImage(null);
            setSuccessMessage('About Me profile image uploaded successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError('Could not upload image.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async () => {
        if (!settings) return;
        setSaving(true);
        setSuccessMessage(null);
        setError(null);

        try {
            const updatedSettings = {
                ...settings,
                about_image: ""
            };
            const response = await fetch('http://localhost:8080/api/settings/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedSettings)
            });
            if (response.ok) {
                const data = await response.json();
                setSettings(data);
                setTempImage(null);
                setSuccessMessage('Image removed successfully!');
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                throw new Error('Failed to remove image');
            }
        } catch (err) {
            setError('Could not remove image.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="admin-loading">Loading About image settings...</div>;
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

    const currentDisplayImage = tempImage || settings.about_image;

    return (
        <div className="settings-form">
            <div className="content-header" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>About Image Settings</h2>
            </div>

            {successMessage && <div className="admin-success-toast" style={{ width: '100%' }}>{successMessage}</div>}
            {error && <div className="admin-error" style={{ width: '100%', marginBottom: '20px' }}>{error}</div>}

            <div className="about-image-panel-container">
                <div className="about-image-card">
                    {/* Glowing Curved Shape Preview Container */}
                    <div className="about-image-preview-wrapper">
                        <div className="about-image-preview-mask">
                            {currentDisplayImage ? (
                                <img 
                                    src={currentDisplayImage} 
                                    alt="About Profile Preview" 
                                />
                            ) : (
                                <div className="about-image-placeholder">
                                    <User size={48} style={{ opacity: 0.15, color: '#7c5cff' }} />
                                    <span style={{ fontSize: '13px', color: '#505080' }}>No profile image uploaded.<br/>Click below to upload.</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image Upload Actions */}
                    <div className="about-image-controls">
                        {tempImage ? (
                            /* User has chosen a new image but NOT uploaded yet */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                                <button
                                    type="button"
                                    className="upload-action-btn"
                                    onClick={handleUpload}
                                    style={{
                                        background: '#8b5cf6',
                                        color: '#fff',
                                        borderColor: '#8b5cf6'
                                    }}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <RefreshCw size={18} className="spin-icon" /> Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={18} /> Upload
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="remove-action-btn"
                                    onClick={() => setTempImage(null)}
                                    disabled={saving}
                                >
                                    <Trash2 size={18} />
                                    Cancel Selection
                                </button>
                            </div>
                        ) : (
                            /* No temporary selection: show Choose Profile Image and Remove if an image already exists in MongoDB */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                                <button
                                    type="button"
                                    className="upload-action-btn"
                                    onClick={() => document.getElementById('about-profile-image-input')?.click()}
                                >
                                    <Upload size={18} />
                                    Choose Profile Image
                                </button>
                                
                                {settings.about_image && (
                                    <button
                                        type="button"
                                        className="remove-action-btn"
                                        onClick={handleRemove}
                                        disabled={saving}
                                    >
                                        <Trash2 size={18} />
                                        Remove
                                    </button>
                                )}
                            </div>
                        )}
                        <input
                            id="about-profile-image-input"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => {
                                    if (typeof reader.result === 'string') {
                                        setTempImage(reader.result);
                                    }
                                };
                                reader.readAsDataURL(file);
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
