'use client';
import React, { useState, useEffect } from 'react';
import { FileText, UploadCloud, CheckCircle, Eye, Trash2, Calendar, X, RefreshCw } from 'lucide-react';
import './ResumesPanel.css';

interface Resume {
    id: string;
    name: string;
    is_active: boolean;
    created_at: string;
}

export default function ResumesPanel() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [name, setName] = useState('');
    const [fileBase64, setFileBase64] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    // Preview states
    const [previewName, setPreviewName] = useState<string | null>(null);
    const [previewBase64, setPreviewBase64] = useState<string | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

    const fetchResumes = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/resumes/');
            if (!response.ok) throw new Error('Failed to fetch resumes');
            const data = await response.json();
            setResumes(data);
            setError(null);
            
            // Auto-load the active resume's preview by default if nothing is selected yet
            const activeResume = data.find((r: Resume) => r.is_active);
            if (activeResume && !previewName && !fileBase64) {
                loadResumePreview(activeResume.id, activeResume.name);
            }
        } catch (err) {
            setError('Could not fetch resumes from backend.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please select a valid PDF file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setFileBase64(reader.result);
                // Also set live preview immediately for wow factor!
                setPreviewName(`Live Upload Preview: ${file.name}`);
                setPreviewBase64(reader.result);
                
                if (!name) {
                    setName(file.name.replace(/\.[^/.]+$/, ""));
                }
            }
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileBase64 || !name.trim()) return;

        setUploading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('http://localhost:8080/api/resumes/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), base64_data: fileBase64 })
            });

            if (!response.ok) throw new Error('Upload failed');
            
            setSuccessMessage('Resume uploaded and stored successfully!');
            setName('');
            setFileBase64(null);
            
            const fileInput = document.getElementById('resume-file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            await fetchResumes();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError('Failed to upload and store resume.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const loadResumePreview = async (id: string, resumeName: string) => {
        setLoadingPreview(true);
        setPreviewName(resumeName);
        setPreviewBase64(null);
        try {
            const response = await fetch(`http://localhost:8080/api/resumes/${id}`);
            if (!response.ok) throw new Error('Failed to load preview');
            const data = await response.json();
            setPreviewBase64(data.base64_data);
        } catch (err) {
            console.error(err);
            setError('Failed to load PDF preview.');
        } finally {
            setLoadingPreview(false);
        }
    };

    const activateResume = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/resumes/${id}/activate`, {
                method: 'POST'
            });
            if (!response.ok) throw new Error('Activation failed');
            
            // Reload list and update state
            await fetchResumes();
        } catch (err) {
            alert('Failed to activate resume.');
        }
    };

    const deleteResume = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;
        try {
            const response = await fetch(`http://localhost:8080/api/resumes/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Deletion failed');
            
            // Clear preview if we deleted the currently previewed item
            setPreviewName(null);
            setPreviewBase64(null);
            
            await fetchResumes();
        } catch (err) {
            alert('Failed to delete resume.');
        }
    };

    return (
        <div className="resume-manager-grid">
            {/* Left Side: Upload Zone and Stored Lists */}
            <div className="resume-manager-left">
                {/* Upload Form */}
                <form onSubmit={handleUpload} className="upload-card">
                    <div className="settings-card-header" style={{ marginBottom: '20px', paddingBottom: '12px' }}>
                        <UploadCloud size={18} className="card-header-icon" />
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Upload & Store PDF Resume</h3>
                    </div>
                    
                    {successMessage && <div className="admin-success-toast" style={{ marginBottom: '16px' }}>{successMessage}</div>}
                    {error && <div className="admin-error" style={{ marginBottom: '16px' }}>{error}</div>}

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label htmlFor="resume-file-input">Select PDF File</label>
                        <div 
                            className={`upload-zone ${fileBase64 ? 'upload-zone-active' : ''}`}
                            onClick={() => document.getElementById('resume-file-input')?.click()}
                        >
                            <UploadCloud size={32} style={{ color: fileBase64 ? '#00ff88' : '#7c5cff' }} />
                            {fileBase64 ? (
                                <div className="file-selected-badge">
                                    <FileText size={14} /> PDF Selected & Ready
                                </div>
                            ) : (
                                <span className="upload-text">Click to browse your device for a PDF</span>
                            )}
                        </div>
                        <input
                            id="resume-file-input"
                            type="file"
                            accept=".pdf"
                            className="file-input"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label htmlFor="resume-name">Resume Display Title (e.g. CV 2026)</label>
                        <input
                            id="resume-name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="My Professional Resume"
                            required
                            disabled={!fileBase64}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="save-settings-btn" 
                        disabled={uploading || !fileBase64}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        {uploading ? (
                            <>
                                <RefreshCw size={16} className="spin-icon" /> Storing Resume...
                            </>
                        ) : (
                            <>
                                <UploadCloud size={16} /> Store & Save Resume
                            </>
                        )}
                    </button>
                </form>

                {/* Stored Resumes List */}
                <div className="settings-card-header" style={{ marginBottom: '16px', paddingBottom: '12px' }}>
                    <FileText size={18} className="card-header-icon" />
                    <h3 style={{ margin: 0, fontSize: '16px' }}>Stored Resumes ({resumes.length})</h3>
                </div>

                {loading ? (
                    <div className="admin-loading" style={{ padding: '40px' }}>Fetching stored resumes...</div>
                ) : (
                    <div className="resumes-list">
                        {resumes.length === 0 ? (
                            <div className="no-messages" style={{ padding: '40px' }}>No resumes stored. Upload one above!</div>
                        ) : (
                            resumes.map(resume => (
                                <div key={resume.id} className={`resume-item ${resume.is_active ? 'active' : ''}`}>
                                    <div className="resume-info">
                                        <div className="resume-icon-container">
                                            <FileText size={20} />
                                        </div>
                                        <div className="resume-details">
                                            <h4>{resume.name}</h4>
                                            <p>
                                                <Calendar size={12} />
                                                {new Date(resume.created_at).toLocaleDateString()}
                                                {resume.is_active && <span className="active-tag">Active</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="resume-actions">
                                        <button 
                                            className="action-btn preview-btn" 
                                            title="Preview Document Content"
                                            onClick={() => loadResumePreview(resume.id, resume.name)}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {!resume.is_active && (
                                            <button 
                                                className="action-btn activate-btn" 
                                                title="Choose as Active Resume"
                                                onClick={() => activateResume(resume.id)}
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                        )}
                                        <button 
                                            className="action-btn delete-btn" 
                                            title="Delete Stored Resume"
                                            onClick={() => deleteResume(resume.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Right Side: High-End Live/Preview Pane */}
            <div className="preview-panel">
                <div className="preview-header">
                    <h3>Document Preview</h3>
                    {previewName && (
                        <span style={{ fontSize: '12px', color: '#7070a0', fontWeight: '500' }}>
                            {previewName}
                        </span>
                    )}
                </div>
                <div className="preview-body">
                    {loadingPreview ? (
                        <div className="admin-loading" style={{ background: 'transparent' }}>
                            <RefreshCw size={24} className="spin-icon" style={{ marginBottom: '12px' }} />
                            Rendering PDF content...
                        </div>
                    ) : previewBase64 ? (
                        <iframe 
                            src={`${previewBase64}#toolbar=0`} 
                            className="preview-iframe"
                            title="PDF Previewer"
                        />
                    ) : (
                        <div className="preview-placeholder">
                            <FileText size={48} style={{ opacity: 0.15 }} />
                            <p>No document preview selected.<br/>Select a file to upload or click preview icon in your list!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
