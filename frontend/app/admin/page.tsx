'use client';
import React, { useState } from 'react';
import { Shield, MessageSquare, Sliders } from 'lucide-react';
import MessagesPanel from './components/messages/MessagesPanel';
import SettingsPanel from './components/settings/SettingsPanel';
import './Admin.css';
import './components/messages/MessagesPanel.css';
import './components/settings/SettingsPanel.css';

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<'messages' | 'settings'>('messages');

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
                ) : (
                    <SettingsPanel />
                )}
            </main>
        </div>
    );
}
