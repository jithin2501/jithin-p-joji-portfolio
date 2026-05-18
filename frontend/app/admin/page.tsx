'use client';
import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Trash2, Shield, Calendar, Eye, X, Sliders } from 'lucide-react';
import SettingsPanel from './components/SettingsPanel';
import './Admin.css';

interface Contact {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
}

export default function AdminPanel() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'messages' | 'settings'>('messages');

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/contacts');
            if (!response.ok) throw new Error('Failed to fetch contacts');
            const data = await response.json();
            setContacts(data);
            setError(null);
        } catch (err) {
            setError('Could not connect to the backend.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const deleteContact = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        try {
            const response = await fetch(`http://localhost:8080/api/contacts/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Delete failed');
            setContacts(contacts.filter(c => c.id !== id));
        } catch (err) {
            alert('Delete failed');
        }
    };

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
                    <>
                        <div className="content-header">
                            <h2>Client Messages</h2>
                            <span className="msg-count">{contacts.length} total</span>
                        </div>

                        {error && <div className="admin-error">{error}</div>}

                        {loading && contacts.length === 0 ? (
                            <div className="admin-loading">Fetching data...</div>
                        ) : (
                            <div className="messages-grid">
                                {contacts.length === 0 && !error ? (
                                    <div className="no-messages">No messages yet.</div>
                                ) : (
                                    contacts.map(contact => (
                                        <div key={contact.id} className="message-card">
                                            <div className="sender-info">
                                                <div className="sender-avatar">{contact.name.charAt(0)}</div>
                                                <div className="sender-details">
                                                    <h3>{contact.name}</h3>
                                                    <p><Mail size={12} /> {contact.email}</p>
                                                    <div className="msg-date">
                                                        <Calendar size={12} />
                                                        {new Date(contact.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="msg-subject">{contact.subject}</div>
                                                <p className="msg-text">{contact.message}</p>
                                            </div>
                                            <div className="card-actions">
                                                <button className="view-btn" onClick={() => setSelectedContact(contact)}>
                                                    <Eye size={16} />
                                                </button>
                                                <button className="del-btn" onClick={() => deleteContact(contact.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="content-header">
                            <h2>Portfolio Settings</h2>
                        </div>
                        <SettingsPanel />
                    </>
                )}
            </main>

            {/* Floating Message Detail Box */}
            {selectedContact && (
                <div className="admin-modal-overlay" onClick={() => setSelectedContact(null)}>
                    <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="sender-info">
                                <div className="sender-avatar">{selectedContact.name.charAt(0)}</div>
                                <div className="sender-details">
                                    <h3>{selectedContact.name}</h3>
                                    <p><Mail size={12} /> {selectedContact.email}</p>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedContact(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Subject</span>
                                    <p className="meta-value">{selectedContact.subject}</p>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Received At</span>
                                    <p className="meta-value">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="modal-message">
                                <span className="meta-label">Message</span>
                                <div className="message-text-full">
                                    {selectedContact.message}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
