'use client';
import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, Trash2, Edit2, Save, RefreshCw, 
  Search, Star, Globe, GitBranch,
  Award, Layers, Upload, ExternalLink
} from 'lucide-react';
import './ProjectsPanel.css';

interface FeatureItem {
  title: string;
  desc: string;
  icon: string;
}

interface TechStackItem {
  name: string;
  icon: string;
}

interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  long_desc: string;
  longDesc?: string;
  image: string;
  images: string[];
  category: string;
  role: string;
  duration: string;
  completed: string;
  tools: string;
  methodology: string;
  features: FeatureItem[];
  tech_stack: TechStackItem[];
  techStack?: TechStackItem[];
  learned: string;
  featured: string;
  live_url: string;
  liveUrl?: string;
  github_url: string;
  githubUrl?: string;
  created_at: string;
}

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('All');

  // Form states (simplified: card fields only)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalProject, setOriginalProject] = useState<any>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Web Apps');
  const [featured, setFeatured] = useState('project'); // feature, project, new, freelancing
  const [liveUrl, setLiveUrl] = useState('#');
  const [githubUrl, setGithubUrl] = useState('#');
  const [techStackStr, setTechStackStr] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/projects/');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Could not connect to the backend server to fetch projects.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project: ProjectData) => {
    setEditingId(project.id);
    setOriginalProject(project); // Retain original detail structures so we merge and do not delete them
    setTitle(project.title);
    setDescription(project.description);
    setImage(project.image);
    setCategory(project.category || 'Web Apps');
    setFeatured(project.featured || 'project');
    setLiveUrl(project.live_url || project.liveUrl || '#');
    setGithubUrl(project.github_url || project.githubUrl || '#');
    
    // Convert tech stack tags back to comma-separated string for editing
    const techTags = project.tech_stack || project.techStack || [];
    setTechStackStr(techTags.map((tech: any) => tech.name).join(', '));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setOriginalProject(null);
    setTitle('');
    setDescription('');
    setImage('');
    setCategory('Web Apps');
    setFeatured('project');
    setLiveUrl('#');
    setGithubUrl('#');
    setTechStackStr('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    if (!image) {
      setError('Please choose or upload a thumbnail image file.');
      setSaving(false);
      return;
    }

    // Convert comma-separated string back to models tech_stack array
    const techStackList = techStackStr.split(',').map(item => {
      const name = item.trim();
      let icon = "fas fa-code";
      const lower = name.toLowerCase();
      if (lower.includes("react")) icon = "fab fa-react";
      else if (lower.includes("node")) icon = "fab fa-node-js";
      else if (lower.includes("next")) icon = "fab fa-react";
      else if (lower.includes("tailwind")) icon = "fab fa-css3-alt";
      else if (lower.includes("figma")) icon = "fab fa-figma";
      else if (lower.includes("js") || lower.includes("javascript")) icon = "fab fa-js";
      else if (lower.includes("css")) icon = "fab fa-css3-alt";
      else if (lower.includes("html")) icon = "fab fa-html5";
      else if (lower.includes("database") || lower.includes("mongo") || lower.includes("sql") || lower.includes("postgres")) icon = "fas fa-database";
      else if (lower.includes("github")) icon = "fab fa-github";
      else if (lower.includes("git")) icon = "fab fa-git-alt";
      else if (lower.includes("stripe")) icon = "fab fa-stripe";
      else if (lower.includes("flutter")) icon = "fas fa-mobile-screen-button";
      return { name, icon };
    }).filter(t => t.name.length > 0);

    const payload = {
      ...originalProject,
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      category: category,
      tech_stack: techStackList,
      featured: featured,
      live_url: liveUrl.trim() || '#',
      github_url: githubUrl.trim() || '#',
      
      // Preserve detail properties if editing, otherwise assign clean fallbacks for new card publications
      subtitle: originalProject?.subtitle || 'PROJECT DETAILS',
      long_desc: originalProject?.long_desc || originalProject?.longDesc || description.trim(),
      images: originalProject?.images && originalProject.images.length > 0 ? originalProject.images : [image.trim()],
      role: originalProject?.role || 'Developer',
      duration: originalProject?.duration || '4 Weeks',
      completed: originalProject?.completed || 'N/A',
      tools: originalProject?.tools || 'VS Code',
      methodology: originalProject?.methodology || 'Agile',
      features: originalProject?.features || [
        { title: 'Responsive Layout', desc: 'Optimized for mobile and tablet views.', icon: 'Layout' },
        { title: 'High Performance', desc: 'Smooth animations and lightning-fast pages.', icon: 'Zap' }
      ],
      learned: originalProject?.learned || 'Strengthened development skills and dynamic architecture.'
    };

    try {
      let response;
      if (editingId) {
        // Update existing project
        response = await fetch(`http://localhost:8080/api/projects/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new project
        response = await fetch('http://localhost:8080/api/projects/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) throw new Error('Failed to save project');

      setSuccessMessage(editingId ? 'Project updated successfully!' : 'Project added successfully!');
      resetForm();
      fetchProjects();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend database server to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this project?')) return;

    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`http://localhost:8080/api/projects/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete project');

      setSuccessMessage('Project deleted successfully!');
      fetchProjects();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Could not delete project from the database.');
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesFeatured = featuredFilter === 'All' || p.featured === featuredFilter;
    return matchesSearch && matchesCategory && matchesFeatured;
  });

  if (loading && projects.length === 0) {
    return <div className="admin-loading">Loading projects...</div>;
  }

  return (
    <div className="projects-admin-layout">
      {successMessage && <div className="admin-success-toast" style={{ marginBottom: '20px' }}>{successMessage}</div>}
      {error && <div className="admin-error" style={{ marginBottom: '20px' }}>{error}</div>}

      {/* Form Section (Unified Card Properties Form) */}
      <form onSubmit={handleSubmit} className="settings-card project-admin-form">
        <div className="settings-card-header" style={{ marginBottom: '20px', paddingBottom: '12px' }}>
          <FolderOpen size={18} className="card-header-icon" />
          <h3 style={{ margin: 0, fontSize: '16px' }}>
            {editingId ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
          </h3>
        </div>

        <div className="form-sections-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          
          {/* Column 1: Card Appearance */}
          <div className="form-sub-section">
            <h4 className="section-subtitle"><Award size={14} /> Card Appearance</h4>
            
            <div className="form-group">
              <label htmlFor="proj-title">Project Title *</label>
              <input
                id="proj-title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Analytics Dashboard, Travel Site"
                required
              />
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label htmlFor="proj-category">Category *</label>
                <select
                  id="proj-category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(124, 92, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="Web Apps" style={{ background: '#0e0e28' }}>Web Apps</option>
                  <option value="E-Commerce" style={{ background: '#0e0e28' }}>E-Commerce</option>
                  <option value="Design" style={{ background: '#0e0e28' }}>Design</option>
                  <option value="Others" style={{ background: '#0e0e28' }}>Others</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="proj-featured">Classification *</label>
                <select
                  id="proj-featured"
                  value={featured}
                  onChange={e => setFeatured(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(124, 92, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  <option value="feature" style={{ background: '#0e0e28' }}>Featured</option>
                  <option value="project" style={{ background: '#0e0e28' }}>Project</option>
                  <option value="new" style={{ background: '#0e0e28' }}>New</option>
                  <option value="freelancing" style={{ background: '#0e0e28' }}>Freelancing</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="proj-desc">Short Description *</label>
              <input
                id="proj-desc"
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="A responsive dashboard with real-time analytics..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="proj-image-file-input">Thumbnail Image *</label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
                {image ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={image}
                      alt="Thumbnail Preview"
                      style={{ width: '120px', height: '90px', borderRadius: '8px', objectFit: 'cover', border: '2px solid rgba(124, 92, 255, 0.3)', boxShadow: '0 8px 24px rgba(124, 92, 255, 0.15)' }}
                    />
                  </div>
                ) : (
                  <div style={{ width: '120px', height: '90px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(124, 92, 255, 0.15)', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#7070a0' }}>
                    <Upload size={20} style={{ opacity: 0.4, color: '#7c5cff' }} />
                    <span>No Image Chosen</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => document.getElementById('proj-image-file-input')?.click()}
                    style={{
                      padding: '10px 18px',
                      background: 'rgba(124, 92, 255, 0.12)',
                      border: '1px solid rgba(124, 92, 255, 0.25)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: 'auto',
                      margin: 0,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Upload size={16} /> Choose Image File
                  </button>
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      style={{
                        padding: '10px 18px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: 'auto',
                        margin: 0,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Trash2 size={16} /> Clear Selection
                    </button>
                  )}
                </div>
              </div>
              
              <input
                id="proj-image-file-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === 'string') {
                      setImage(reader.result);
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </div>
          </div>

          {/* Column 2: Links & Tech Stack */}
          <div className="form-sub-section">
            <h4 className="section-subtitle"><Layers size={14} /> Links & Technologies</h4>

            <div className="form-group">
              <label htmlFor="proj-tech-stack">Tech Stack Tags (comma separated) *</label>
              <input
                id="proj-tech-stack"
                type="text"
                value={techStackStr}
                onChange={e => setTechStackStr(e.target.value)}
                placeholder="e.g. React.js, Next.js, TypeScript, Tailwind CSS"
                required
              />
              <small style={{ color: '#7070a0', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                We will automatically allocate FontAwesome icons for common tags!
              </small>
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label htmlFor="proj-live-url">Live Preview Link URL</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    id="proj-live-url"
                    type="text"
                    value={liveUrl}
                    onChange={e => setLiveUrl(e.target.value)}
                    placeholder="https://example.com"
                    style={{ paddingLeft: '38px' }}
                  />
                  <Globe size={14} style={{ position: 'absolute', left: '14px', color: '#7070a0' }} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="proj-github-url">GitHub Repository Link URL</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    id="proj-github-url"
                    type="text"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/user/repo"
                    style={{ paddingLeft: '38px' }}
                  />
                  <GitBranch size={14} style={{ position: 'absolute', left: '14px', color: '#7070a0' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Form Actions */}
        <div className="form-actions-row" style={{ marginTop: '30px', display: 'flex', gap: '12px' }}>
          {editingId && (
            <button
              type="button"
              className="remove-action-btn"
              onClick={resetForm}
              style={{ padding: '12px 24px', width: 'auto', margin: 0 }}
            >
              Cancel Edit
            </button>
          )}
          <button
            type="submit"
            className="save-settings-btn"
            disabled={saving}
            style={{ flex: 1, justifyContent: 'center', padding: '12px 24px' }}
          >
            {saving ? (
              <>
                <RefreshCw size={16} className="spin-icon" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> {editingId ? 'Update Project' : 'Publish Project'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Projects List Container */}
      <div className="settings-card stored-projects-card" style={{ marginTop: '30px' }}>
        <div className="settings-card-header" style={{ marginBottom: '20px', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} className="card-header-icon" />
            <h3 style={{ margin: 0, fontSize: '16px' }}>Stored Projects ({projects.length})</h3>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginLeft: 'auto' }}>
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(124, 92, 255, 0.08)',
                borderRadius: '20px',
                padding: '5px 12px',
                color: '#fff',
                fontSize: '11px',
                outline: 'none'
              }}
            >
              <option value="All" style={{ background: '#0e0e28' }}>All Categories</option>
              <option value="Web Apps" style={{ background: '#0e0e28' }}>Web Apps</option>
              <option value="E-Commerce" style={{ background: '#0e0e28' }}>E-Commerce</option>
              <option value="Design" style={{ background: '#0e0e28' }}>Design</option>
              <option value="Others" style={{ background: '#0e0e28' }}>Others</option>
            </select>

            {/* Classification Filter */}
            <select
              value={featuredFilter}
              onChange={e => setFeaturedFilter(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(124, 92, 255, 0.08)',
                borderRadius: '20px',
                padding: '5px 12px',
                color: '#fff',
                fontSize: '11px',
                outline: 'none'
              }}
            >
              <option value="All" style={{ background: '#0e0e28' }}>All Classifications</option>
              <option value="feature" style={{ background: '#0e0e28' }}>Featured</option>
              <option value="project" style={{ background: '#0e0e28' }}>Project</option>
              <option value="new" style={{ background: '#0e0e28' }}>New</option>
              <option value="freelancing" style={{ background: '#0e0e28' }}>Freelancing</option>
            </select>

            {/* Search Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '180px' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(124, 92, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '5px 12px 5px 30px',
                  color: '#fff',
                  fontSize: '11px',
                  outline: 'none'
                }}
              />
              <Search size={12} style={{ position: 'absolute', left: '11px', color: '#7070a0' }} />
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="no-messages" style={{ padding: '60px' }}>
            {searchQuery || categoryFilter !== 'All' || featuredFilter !== 'All' 
              ? 'No projects match your current filters.' 
              : 'No projects stored yet. Publish your first project above!'}
          </div>
        ) : (
          <div className="admin-projects-list-grid">
            {filteredProjects.map(p => {
              const techTags = p.tech_stack || p.techStack || [];
              const liveUrl = p.live_url || p.liveUrl || "#";
              const githubUrl = p.github_url || p.githubUrl || "#";
              return (
                <div key={p.id} className="project-card-new">
                  <div className="project-img-box">
                    {p.featured === 'feature' && (
                      <div className="featured-badge" style={{ background: 'linear-gradient(135deg, #ffd700, #ff8c00)', color: '#000', fontWeight: 'bold' }}>
                        <Star size={12} fill="black" />
                        Featured
                      </div>
                    )}
                    {p.featured === 'new' && (
                      <div className="featured-badge" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 'bold' }}>
                        <Star size={12} fill="white" />
                        New
                      </div>
                    )}
                    {p.featured === 'freelancing' && (
                      <div className="featured-badge" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff', fontWeight: 'bold' }}>
                        <Star size={12} fill="white" />
                        Freelance
                      </div>
                    )}
                    {p.featured === 'project' && (
                      <div className="featured-badge" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', fontWeight: 'bold' }}>
                        <Star size={12} fill="white" />
                        Project
                      </div>
                    )}
                    <img 
                      src={p.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"} 
                      alt={p.title} 
                      className="project-img-placeholder" 
                    />
                  </div>

                  <div className="project-info-new">
                    <div className="project-header-new">
                      <h3 className="project-title-new">{p.title}</h3>
                      <span style={{ fontSize: '9px', background: 'rgba(124, 92, 255, 0.08)', color: '#a78bfa', padding: '1px 6px', borderRadius: '10px', fontWeight: 600 }}>
                        {p.category}
                      </span>
                    </div>
                    <p className="project-desc-new">{p.description}</p>
                    
                    {techTags.length > 0 && (
                      <div className="project-tags-new">
                        {techTags.map((tech: any, idx: number) => (
                          <span key={idx} className="tag-new">
                            <i className={tech.icon || "fas fa-code"} style={{ marginRight: '4px', fontSize: '10px', color: '#a78bfa' }}></i>
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="project-footer-new">
                    {/* Admin Actions */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="action-btn edit-btn"
                        title="Edit Project"
                        onClick={() => handleEdit(p)}
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          padding: 0, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: '8px',
                          background: 'rgba(124, 92, 255, 0.1)',
                          border: '1px solid rgba(124, 92, 255, 0.2)',
                          color: '#a78bfa',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        className="action-btn delete-btn"
                        title="Delete Project"
                        onClick={() => handleDelete(p.id)}
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          padding: 0, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Public Links */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {liveUrl && liveUrl !== '#' && (
                        <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="view-details-btn">
                          Preview
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {githubUrl && githubUrl !== '#' && (
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="github-btn-new">
                          GitHub
                          <i className="fab fa-github" style={{ fontSize: '16px' }} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
