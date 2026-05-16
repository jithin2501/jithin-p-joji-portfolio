'use client';
import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Trash2, Shield, RefreshCw, Calendar } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            await fetch(`http://localhost:8080/api/contacts/${id}`, { method: 'DELETE' });
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
                    <button className="nav-item active">
                        <MessageSquare size={18} />
                        Messages
                    </button>
                    <button className="nav-item" onClick={fetchContacts}>
                        <RefreshCw size={18} />
                        Refresh Data
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">JP</div>
                        <span>Jithin P Joji</span>
                    </div>
                </div>
            </aside>

            <main className="admin-content">
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
                                    <div className="card-header">
                                        <div className="sender-info">
                                            <div className="sender-avatar">{contact.name.charAt(0)}</div>
                                            <div>
                                                <h3>{contact.name}</h3>
                                                <p><Mail size={12} /> {contact.email}</p>
                                            </div>
                                        </div>
                                        <button className="del-btn" onClick={() => deleteContact(contact.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        <div className="msg-subject">{contact.subject}</div>
                                        <p className="msg-text">{contact.message}</p>
                                    </div>
                                    <div className="card-footer">
                                        <Calendar size={14} />
                                        <span>{new Date(contact.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
