'use client';
import React, { useState, useEffect } from 'react';
import { 
    Users, User, Trash2, Shield, PlusCircle, RefreshCw, X, 
    MessageSquare, Sliders, FileText, Code, Briefcase, GraduationCap, 
    Image as ImageIcon, FolderOpen, Activity, ToggleLeft, ToggleRight, CheckSquare, Square,
    Eye, EyeOff
} from 'lucide-react';
import './UsersPanel.css';

interface AdminUser {
    id?: string;
    username: string;
    role: string;
    status: string;
    last_login: string;
    page_access: string;
}

const PAGE_OPTIONS = [
    { key: 'messages', label: 'Messages', icon: MessageSquare },
    { key: 'settings', label: 'Settings', icon: Sliders },
    { key: 'resumes', label: 'Resumes', icon: FileText },
    { key: 'skills', label: 'Tech Stack', icon: Code },
    { key: 'experience', label: 'Experience', icon: Briefcase },
    { key: 'academic', label: 'Academic', icon: GraduationCap },
    { key: 'aboutImage', label: 'About Image', icon: ImageIcon },
    { key: 'projects', label: 'Projects', icon: FolderOpen },
    { key: 'analytics', label: 'Analytics', icon: Activity }
];

export default function UsersPanel() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [username, setUsername] = useState('');
    const [pincode, setPincode] = useState('');
    const [showPasscode, setShowPasscode] = useState(false);
    
    // UI states
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Modal / Access control states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [selectedPages, setSelectedPages] = useState<string[]>([]);
    const [updatingAccess, setUpdatingAccess] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/v1/auth/users');
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Could not fetch admin users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !pincode.trim()) return;

        if (pincode.length !== 6 || isNaN(Number(pincode))) {
            setError('Passcode must be exactly 6 numeric digits.');
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await fetch('/api/v1/auth/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username.trim(),
                    pincode: pincode.trim()
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || 'Failed to create user');
            }

            setSuccessMessage('Admin user created successfully!');
            setUsername('');
            setPincode('');

            await fetchUsers();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to create admin user.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (user: AdminUser) => {
        if (!user.id || user.id === 'superadmin-id') return;

        try {
            const res = await fetch(`/api/v1/auth/users/${user.id}/status`, {
                method: 'PUT'
            });

            if (!res.ok) throw new Error('Failed to toggle status');

            setSuccessMessage(`Status of "${user.username}" updated successfully!`);
            await fetchUsers();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            alert('Failed to update admin user status.');
            console.error(err);
        }
    };

    const handleDeleteUser = async (id: string, name: string) => {
        if (id === 'superadmin-id') return;
        if (!confirm(`Are you sure you want to revoke admin keys for "${name}"?`)) return;

        try {
            const res = await fetch(`/api/v1/auth/users/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Deletion failed');

            setSuccessMessage(`Revoked access for "${name}".`);
            await fetchUsers();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            alert('Failed to delete user.');
            console.error(err);
        }
    };

    // Open permissions configuration modal
    const openAccessModal = (user: AdminUser) => {
        if (user.id === 'superadmin-id') return;
        setSelectedUser(user);
        const pages = user.page_access.split(',').map(p => p.trim()).filter(Boolean);
        setSelectedPages(pages);
        setIsModalOpen(true);
    };

    // Toggle a checkbox in the modal
    const handleTogglePage = (key: string) => {
        setSelectedPages(prev => {
            if (prev.includes(key)) {
                return prev.filter(p => p !== key);
            } else {
                return [...prev, key];
            }
        });
    };

    // Save customized permissions to backend
    const handleSavePermissions = async () => {
        if (!selectedUser || !selectedUser.id) return;
        setUpdatingAccess(true);

        try {
            const res = await fetch(`/api/v1/auth/users/${selectedUser.id}/access`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page_access: selectedPages.join(',') })
            });

            if (!res.ok) throw new Error('Failed to update access permissions');

            setSuccessMessage(`Permissions updated for "${selectedUser.username}".`);
            setIsModalOpen(false);
            setSelectedUser(null);
            await fetchUsers();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            alert('Failed to save access keys.');
            console.error(err);
        } finally {
            setUpdatingAccess(false);
        }
    };

    return (
        <div className="users-manager-grid">
            {/* Left Side: Create User Card (Passcode only) */}
            <div className="users-manager-left">
                <form onSubmit={handleCreateUser} className="upload-card">
                    <div className="settings-card-header" style={{ marginBottom: '20px', paddingBottom: '12px' }}>
                        <PlusCircle size={18} className="card-header-icon" />
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Create New Admin Key</h3>
                    </div>

                    {successMessage && <div className="admin-success-toast" style={{ marginBottom: '16px' }}>{successMessage}</div>}
                    {error && <div className="admin-error" style={{ marginBottom: '16px' }}>{error}</div>}

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                        <label htmlFor="user-username">Username</label>
                        <input
                            id="user-username"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="e.g. jefin"
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label htmlFor="user-pincode">passcode (6 Digits)</label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                                id="user-pincode"
                                type={showPasscode ? 'text' : 'password'}
                                maxLength={6}
                                minLength={6}
                                value={pincode}
                                onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                                placeholder="exactly 6 numeric digits"
                                required
                                style={{ paddingRight: '40px', width: '100%' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasscode(!showPasscode)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    background: 'none',
                                    border: 'none',
                                    color: '#8b8ba7',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '4px',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                onMouseLeave={e => e.currentTarget.style.color = '#8b8ba7'}
                            >
                                {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="save-settings-btn" 
                        disabled={submitting || !username.trim() || !pincode.trim()}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        {submitting ? (
                            <>
                                <RefreshCw size={16} className="spin-icon" /> Creating Key...
                            </>
                        ) : (
                            <>
                                <PlusCircle size={16} /> Create Admin Key
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Right Side: Existing Admin Users Table */}
            <div className="users-manager-right">
                <div className="stored-users-card">
                    <div className="stored-users-header">
                        <Users size={18} className="card-header-icon" />
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Existing Admin Users</h3>
                    </div>

                    {loading ? (
                        <div className="admin-loading" style={{ padding: '40px' }}>Loading admin logs...</div>
                    ) : (
                        <div className="users-table-container">
                            <table className="users-data-table">
                                <thead>
                                    <tr>
                                        <th>USERNAME</th>
                                        <th>ROLE</th>
                                        <th>STATUS</th>
                                        <th>LAST LOGIN</th>
                                        <th>PAGE ACCESS</th>
                                        <th>ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => {
                                        const isSuper = user.id === 'superadmin-id';
                                        return (
                                            <tr key={user.id || user.username}>
                                                <td className="username-cell">{user.username}</td>
                                                <td>
                                                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-text ${user.status.toLowerCase()}`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="monospace-cell">{user.last_login}</td>
                                                <td>
                                                    {isSuper ? (
                                                        <span className="full-access-text">Full Access</span>
                                                    ) : (
                                                        <button 
                                                            onClick={() => openAccessModal(user)}
                                                            className="access-pill-btn"
                                                            title="Configure Permitted Tabs"
                                                        >
                                                            Access
                                                        </button>
                                                    )}
                                                </td>
                                                <td>
                                                    {!isSuper ? (
                                                        <div className="action-cell-flex">
                                                            {/* User Icon acts as Toggle Activate / Deactivate status */}
                                                            <button 
                                                                onClick={() => handleToggleStatus(user)}
                                                                className={`user-toggle-btn ${user.status.toLowerCase() === 'active' ? 'active' : 'inactive'}`}
                                                                title={user.status.toLowerCase() === 'active' ? "Deactivate Account" : "Activate Account"}
                                                            >
                                                                <User size={16} />
                                                            </button>
                                                            
                                                            <button 
                                                                className="delete-user-btn"
                                                                title="Revoke Admin Access"
                                                                onClick={() => handleDeleteUser(user.id!, user.username)}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="protected-text">Protected</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Access configuration modal */}
            {isModalOpen && selectedUser && (
                <div className="premium-modal-overlay">
                    <div className="access-modal-card">
                        <div className="access-modal-header">
                            <div className="access-modal-title-group">
                                <Shield size={18} className="text-indigo-400" />
                                <h3>Page Access Keys - {selectedUser.username}</h3>
                            </div>
                            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="access-modal-body">
                            <p className="access-modal-intro">
                                Select which navigation tabs this admin is allowed to access upon login.
                            </p>
                            
                            <div className="access-options-grid">
                                {PAGE_OPTIONS.map((opt) => {
                                    const IconComponent = opt.icon;
                                    const isChecked = selectedPages.includes(opt.key);
                                    return (
                                        <div 
                                            key={opt.key} 
                                            className={`access-option-item ${isChecked ? 'selected' : ''}`}
                                            onClick={() => handleTogglePage(opt.key)}
                                        >
                                            <div className="option-left-group">
                                                <IconComponent size={16} className="option-icon" />
                                                <span>{opt.label}</span>
                                            </div>
                                            {isChecked ? (
                                                <CheckSquare size={18} className="checkbox-icon checked" />
                                            ) : (
                                                <Square size={18} className="checkbox-icon unchecked" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        <div className="access-modal-footer">
                            <button 
                                className="modal-cancel-btn" 
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="modal-save-btn" 
                                onClick={handleSavePermissions}
                                disabled={updatingAccess}
                            >
                                {updatingAccess ? 'Saving Access...' : 'Save Permissions'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
