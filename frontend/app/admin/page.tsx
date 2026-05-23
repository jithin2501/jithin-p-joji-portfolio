'use client';
import React, { useState, useEffect } from 'react';
import { Shield, MessageSquare, Sliders, FileText, Image as ImageIcon, Briefcase, GraduationCap, Code, FolderOpen, Activity, Users } from 'lucide-react';
import MessagesPanel from './components/messages/MessagesPanel';
import SettingsPanel from './components/settings/SettingsPanel';
import ResumesPanel from './components/resumes/ResumesPanel';
import AboutImagePanel from './components/about/AboutImagePanel';
import ExperiencePanel from './components/experience/ExperiencePanel';
import AcademicPanel from './components/academic/AcademicPanel';
import SkillsPanel from './components/skills/SkillsPanel';
import ProjectsPanel from './components/projects/ProjectsPanel';
import AnalyticsPanel from './components/analytics/AnalyticsPanel';
import UsersPanel from './components/users/UsersPanel';
import './Admin.css';
import './components/messages/MessagesPanel.css';
import './components/settings/SettingsPanel.css';
import './components/resumes/ResumesPanel.css';
import './components/experience/ExperiencePanel.css';
import './components/academic/AcademicPanel.css';
import './components/skills/SkillsPanel.css';
import './components/projects/ProjectsPanel.css';
import './components/analytics/AnalyticsPanel.css';
import './components/users/UsersPanel.css';

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<'messages' | 'settings' | 'resumes' | 'aboutImage' | 'experience' | 'academic' | 'skills' | 'projects' | 'analytics' | 'users'>('messages');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [allowedTabs, setAllowedTabs] = useState<string[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const isAuth = sessionStorage.getItem('isAdminAuthenticated');
        if (isAuth !== 'true') {
            window.location.href = '/admin/login';
        } else {
            const accessStr = sessionStorage.getItem('adminPageAccess') || '';
            const tabs = accessStr.split(',').map(t => t.trim()).filter(Boolean);
            setAllowedTabs(tabs);
            
            // If the active tab is not in the allowed list, default to first allowed tab
            if (tabs.length > 0 && !tabs.includes(activeTab)) {
                setActiveTab(tabs[0] as any);
            }
            setIsCheckingAuth(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Lock page scroll when mobile sidebar is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    if (isCheckingAuth) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#030712',
                color: '#fff',
                fontFamily: 'sans-serif',
                gap: '16px'
            }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '3px solid rgba(255,255,255,0.05)',
                    borderTopColor: '#6366f1',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <span style={{ fontSize: '13px', color: '#8888aa', fontWeight: 600 }}>Verifying Credentials...</span>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    const handleTabClick = (tab: typeof activeTab) => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="admin-layout">
            {/* Mobile Header Bar */}
            <header className="admin-mobile-header">
                <button 
                    className={`admin-hamburger ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle Sidebar"
                >
                    <span className="admin-bar"></span>
                    <span className="admin-bar"></span>
                    <span className="admin-bar"></span>
                </button>
                <h1 className="admin-mobile-title">Admin Panel</h1>
            </header>

            {/* Sidebar Backdrop Overlay */}
            {isMobileMenuOpen && (
                <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <Shield size={20} />
                    <span>Admin Panel</span>
                </div>
                
                <nav className="sidebar-nav">
                    {allowedTabs.includes('messages') && (
                        <button 
                            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                            onClick={() => handleTabClick('messages')}
                        >
                            <MessageSquare size={18} />
                            Messages
                        </button>
                    )}
                    {allowedTabs.includes('settings') && (
                        <button 
                            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => handleTabClick('settings')}
                        >
                            <Sliders size={18} />
                            Settings
                        </button>
                    )}
                    {allowedTabs.includes('resumes') && (
                        <button 
                            className={`nav-item ${activeTab === 'resumes' ? 'active' : ''}`}
                            onClick={() => handleTabClick('resumes')}
                        >
                            <FileText size={18} />
                            Resumes
                        </button>
                    )}
                    {allowedTabs.includes('skills') && (
                        <button 
                            className={`nav-item ${activeTab === 'skills' ? 'active' : ''}`}
                            onClick={() => handleTabClick('skills')}
                        >
                            <Code size={18} />
                            Tech Stack
                        </button>
                    )}
                    {allowedTabs.includes('experience') && (
                        <button 
                            className={`nav-item ${activeTab === 'experience' ? 'active' : ''}`}
                            onClick={() => handleTabClick('experience')}
                        >
                            <Briefcase size={18} />
                            Experience
                        </button>
                    )}
                    {allowedTabs.includes('academic') && (
                        <button 
                            className={`nav-item ${activeTab === 'academic' ? 'active' : ''}`}
                            onClick={() => handleTabClick('academic')}
                        >
                            <GraduationCap size={18} />
                            Academic
                        </button>
                    )}
                    {allowedTabs.includes('aboutImage') && (
                        <button 
                            className={`nav-item ${activeTab === 'aboutImage' ? 'active' : ''}`}
                            onClick={() => handleTabClick('aboutImage')}
                        >
                            <ImageIcon size={18} />
                            About Image
                        </button>
                    )}
                    {allowedTabs.includes('projects') && (
                        <button 
                            className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}
                            onClick={() => handleTabClick('projects')}
                        >
                            <FolderOpen size={18} />
                            Projects
                        </button>
                    )}

                    {allowedTabs.includes('analytics') && (
                        <button 
                            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                            onClick={() => handleTabClick('analytics')}
                        >
                            <Activity size={18} />
                            Analytics
                        </button>
                    )}

                    {allowedTabs.includes('users') && (
                        <button 
                            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                            onClick={() => handleTabClick('users')}
                        >
                            <Users size={18} />
                            Users
                        </button>
                    )}
                </nav>
                 <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => {
                        sessionStorage.removeItem('isAdminAuthenticated');
                        window.location.href = '/';
                    }}>
                        <Shield size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                {activeTab === 'messages' ? (
                    <MessagesPanel />
                ) : activeTab === 'analytics' ? (
                    <>
                        <div className="content-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>Visitor Analytics & Map</h2>
                        </div>
                        <AnalyticsPanel />
                    </>
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
                ) : activeTab === 'projects' ? (
                    <>
                        <div className="content-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>Portfolio Projects</h2>
                        </div>
                        <ProjectsPanel />
                    </>
                ) : activeTab === 'resumes' ? (
                    <>
                        <div className="content-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>Resume Manager</h2>
                        </div>
                        <ResumesPanel />
                    </>
                ) : activeTab === 'users' ? (
                    <>
                        <div className="content-header" style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>Security Access Keys</h2>
                        </div>
                        <UsersPanel />
                    </>
                ) : activeTab === 'aboutImage' ? (
                    <AboutImagePanel />
                ) : (
                    <div style={{ padding: '40px', color: '#7070a0', textAlign: 'center' }}>
                        Loading permitted section...
                    </div>
                )}
            </main>
        </div>
    );
}
