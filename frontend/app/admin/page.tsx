'use client';
import React, { useState } from 'react';
import { Shield, MessageSquare, Sliders, FileText, Image as ImageIcon, Briefcase, GraduationCap, Code } from 'lucide-react';
import MessagesPanel from './components/messages/MessagesPanel';
import SettingsPanel from './components/settings/SettingsPanel';
import ResumesPanel from './components/resumes/ResumesPanel';
import AboutImagePanel from './components/about/AboutImagePanel';
import ExperiencePanel from './components/experience/ExperiencePanel';
import AcademicPanel from './components/academic/AcademicPanel';
import SkillsPanel from './components/skills/SkillsPanel';
import './Admin.css';
import './components/messages/MessagesPanel.css';
import './components/settings/SettingsPanel.css';
import './components/resumes/ResumesPanel.css';
import './components/experience/ExperiencePanel.css';
import './components/academic/AcademicPanel.css';
import './components/skills/SkillsPanel.css';

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<'messages' | 'settings' | 'resumes' | 'aboutImage' | 'experience' | 'academic' | 'skills'>('messages');

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <Shield size={20} />
                    <span>Admin Panel</span>
                </div>
                <nav className="sidebar-nav">
                    <button 
                        className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        <MessageSquare size={18} />
                        Messages
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Sliders size={18} />
                        Settings
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'experience' ? 'active' : ''}`}
                        onClick={() => setActiveTab('experience')}
                    >
                        <Briefcase size={18} />
                        Experience
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'academic' ? 'active' : ''}`}
                        onClick={() => setActiveTab('academic')}
                    >
                        <GraduationCap size={18} />
                        Academic
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'skills' ? 'active' : ''}`}
                        onClick={() => setActiveTab('skills')}
                    >
                        <Code size={18} />
                        Tech Stack
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'resumes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resumes')}
                    >
                        <FileText size={18} />
                        Resumes
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'aboutImage' ? 'active' : ''}`}
                        onClick={() => setActiveTab('aboutImage')}
                    >
                        <ImageIcon size={18} />
                        About Image
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => window.location.href = '/'}>
                        <Shield size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                {activeTab === 'messages' ? (
                    <MessagesPanel />
                ) : activeTab === 'settings' ? (
                    <SettingsPanel />
                ) : activeTab === 'experience' ? (
                    <>
                        <div className="content-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>Career Timeline</h2>
                        </div>
                        <ExperiencePanel />
                    </>
                ) : activeTab === 'academic' ? (
                    <>
                        <div className="content-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>Academic Path</h2>
                        </div>
                        <AcademicPanel />
                    </>
                ) : activeTab === 'skills' ? (
                    <>
                        <div className="content-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>Tech Stack Manager</h2>
                        </div>
                        <SkillsPanel />
                    </>
                ) : activeTab === 'resumes' ? (
                    <>
                        <div className="content-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>Resume Manager</h2>
                        </div>
                        <ResumesPanel />
                    </>
                ) : (
                    <AboutImagePanel />
                )}
            </main>
        </div>
    );
}
