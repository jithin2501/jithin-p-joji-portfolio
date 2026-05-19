'use client';
import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, Trash2, Edit2, Save, RefreshCw, 
  Search, Star, Globe, GitBranch,
  Award, Layers, Upload, ExternalLink, Sliders, BookOpen, FileText, Info
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

  // Details Editor states
  const [detailsProject, setDetailsProject] = useState<ProjectData | null>(null);
  const [detailSubtitle, setDetailSubtitle] = useState('');
  const [detailRole, setDetailRole] = useState('');
  const [detailDuration, setDetailDuration] = useState('');
  const [detailCompleted, setDetailCompleted] = useState('');
  const [detailTools, setDetailTools] = useState('');
  const [detailMethodology, setDetailMethodology] = useState('');
  const [detailLongDesc, setDetailLongDesc] = useState('');
  const [detailLearned, setDetailLearned] = useState('');
  const [detailImagesStr, setDetailImagesStr] = useState('');
  const [detailFeatures, setDetailFeatures] = useState<FeatureItem[]>([]);

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

  const handleOpenDetails = (project: ProjectData) => {
    setDetailsProject(project);
    setDetailSubtitle(project.subtitle || 'PROJECT DETAILS');
    setDetailRole(project.role || 'Developer');
    setDetailDuration(project.duration || '4 Weeks');
    setDetailCompleted(project.completed || 'N/A');
    setDetailTools(project.tools || 'VS Code');
    setDetailMethodology(project.methodology || 'Agile');
    setDetailLongDesc(project.long_desc || project.longDesc || project.description || '');
    setDetailLearned(project.learned || '');
    setDetailImagesStr((project.images && project.images.length > 0 ? project.images : [project.image || '']).join(', '));
    setDetailFeatures(project.features || []);
    
    // Smooth scroll to details editor section
    setTimeout(() => {
      document.getElementById('project-details-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailsProject) return;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    const imagesList = detailImagesStr.split(',').map(img => img.trim()).filter(img => img.length > 0);

    const payload = {
      ...detailsProject,
      subtitle: detailSubtitle.trim(),
      role: detailRole.trim(),
      duration: detailDuration.trim(),
      completed: detailCompleted.trim(),
      tools: detailTools.trim(),
      methodology: detailMethodology.trim(),
      long_desc: detailLongDesc.trim(),
      learned: detailLearned.trim(),
      images: imagesList.length > 0 ? imagesList : [detailsProject.image],
      features: detailFeatures
    };

    try {
      const response = await fetch(`http://localhost:8080/api/projects/${detailsProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update project details');
      
      setSuccessMessage(`Project details for "${detailsProject.title}" saved successfully!`);
      setDetailsProject(null);
      fetchProjects();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to update project details. Please check your backend connection.');
    } finally {
      setSaving(false);
    }
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

      {/* Stateful Project Details Editor Form Card */}
      {detailsProject && (
        <form 
          id="project-details-section" 
          onSubmit={handleSaveDetails} 
          className="settings-card project-admin-form"
          style={{ marginTop: '30px', border: '1px solid rgba(59, 130, 246, 0.25)', boxShadow: '0 0 25px rgba(59, 130, 246, 0.1)' }}
        >
          <div className="settings-card-header" style={{ marginBottom: '20px', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} className="card-header-icon" style={{ color: '#3b82f6' }} />
              <h3 style={{ margin: 0, fontSize: '16px' }}>
                Project Details Editor: <span style={{ color: '#60a5fa' }}>{detailsProject.title}</span>
              </h3>
            </div>
            <button 
              type="button" 
              onClick={() => setDetailsProject(null)} 
              className="remove-action-btn"
              style={{ margin: 0, padding: '4px 12px', fontSize: '12px', width: 'auto' }}
            >
              Close
            </button>
          </div>

          <div className="form-sections-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            {/* Details Column 1: Core Technical Details */}
            <div className="form-sub-section">
              <h4 className="section-subtitle" style={{ color: '#60a5fa', borderBottom: '1px solid rgba(59, 130, 246, 0.15)', paddingBottom: '8px', marginBottom: '20px' }}><Sliders size={14} /> Core Metrics & Meta</h4>
              
              <div className="form-grid-two">
                <div className="form-group">
                  <label htmlFor="detail-subtitle">Details Page Subtitle *</label>
                  <input
                    id="detail-subtitle"
                    type="text"
                    value={detailSubtitle}
                    onChange={e => setDetailSubtitle(e.target.value)}
                    placeholder="e.g. FULL-STACK WEB DEVELOPMENT"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="detail-role">My Role *</label>
                  <input
                    id="detail-role"
                    type="text"
                    value={detailRole}
                    onChange={e => setDetailRole(e.target.value)}
                    placeholder="e.g. Lead Full Stack Developer"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-two">
                <div className="form-group">
                  <label htmlFor="detail-duration">Duration *</label>
                  <input
                    id="detail-duration"
                    type="text"
                    value={detailDuration}
                    onChange={e => setDetailDuration(e.target.value)}
                    placeholder="e.g. 3 Months"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="detail-completed">Completed Date *</label>
                  <input
                    id="detail-completed"
                    type="text"
                    value={detailCompleted}
                    onChange={e => setDetailCompleted(e.target.value)}
                    placeholder="e.g. Dec 2026"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-two">
                <div className="form-group">
                  <label htmlFor="detail-tools">Tools & Environment *</label>
                  <input
                    id="detail-tools"
                    type="text"
                    value={detailTools}
                    onChange={e => setDetailTools(e.target.value)}
                    placeholder="e.g. Git, Docker, MongoDB"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="detail-methodology">Methodology *</label>
                  <input
                    id="detail-methodology"
                    type="text"
                    value={detailMethodology}
                    onChange={e => setDetailMethodology(e.target.value)}
                    placeholder="e.g. Agile Scrum"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="detail-images">Details Image Gallery (comma separated URLs)</label>
                <textarea
                  id="detail-images"
                  value={detailImagesStr}
                  onChange={e => setDetailImagesStr(e.target.value)}
                  placeholder="Paste thumbnail URL or multiple URLs separated by commas..."
                  rows={2}
                />
              </div>
            </div>

            {/* Details Column 2: Detailed Text Narratives */}
            <div className="form-sub-section">
              <h4 className="section-subtitle" style={{ color: '#60a5fa', borderBottom: '1px solid rgba(59, 130, 246, 0.15)', paddingBottom: '8px', marginBottom: '20px' }}><BookOpen size={14} /> Narratives & Insights</h4>

              <div className="form-group">
                <label htmlFor="detail-longdesc">Long Detailed Description *</label>
                <textarea
                  id="detail-longdesc"
                  value={detailLongDesc}
                  onChange={e => setDetailLongDesc(e.target.value)}
                  placeholder="Provide an extensive walkthrough of the project, architecture choice, challenge solved..."
                  rows={5}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="detail-learned">Key Takeaways & What was learned *</label>
                <textarea
                  id="detail-learned"
                  value={detailLearned}
                  onChange={e => setDetailLearned(e.target.value)}
                  placeholder="What libraries or architectural patterns did you master in this project?"
                  rows={5}
                  required
                />
              </div>
            </div>

          </div>

          {/* Key Features Array Editor Section */}
          <div className="form-sub-section" style={{ marginTop: '30px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px' }}>
            <h4 className="section-subtitle" style={{ color: '#60a5fa', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={14} style={{ color: '#60a5fa' }} /> Key Features List
            </h4>

            {detailFeatures.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px', color: '#7070a0', marginBottom: '20px' }}>
                No features added yet. Click "+ Add New Key Feature Item" below to build your dynamic features section!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                {detailFeatures.map((feat, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 2fr 1fr auto', 
                      gap: '12px', 
                      alignItems: 'center', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid rgba(255, 255, 255, 0.05)', 
                      padding: '16px', 
                      borderRadius: '10px'
                    }}
                  >
                    {/* Feature Title */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px', color: '#7070a0', marginBottom: '4px' }}>Feature Title *</label>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={e => {
                          const updated = [...detailFeatures];
                          updated[index] = { ...updated[index], title: e.target.value };
                          setDetailFeatures(updated);
                        }}
                        placeholder="e.g. Real-time Chats"
                        required
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                      />
                    </div>

                    {/* Feature Description */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px', color: '#7070a0', marginBottom: '4px' }}>Description *</label>
                      <input
                        type="text"
                        value={feat.desc}
                        onChange={e => {
                          const updated = [...detailFeatures];
                          updated[index] = { ...updated[index], desc: e.target.value };
                          setDetailFeatures(updated);
                        }}
                        placeholder="e.g. Instant communication between users powered by Socket.io"
                        required
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                      />
                    </div>

                    {/* Feature Icon Name Selection */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px', color: '#7070a0', marginBottom: '4px' }}>Visual Icon *</label>
                      <select
                        value={feat.icon}
                        onChange={e => {
                          const updated = [...detailFeatures];
                          updated[index] = { ...updated[index], icon: e.target.value };
                          setDetailFeatures(updated);
                        }}
                        style={{
                          width: '100%',
                          background: '#0a0a1f',
                          border: '1px solid rgba(124, 92, 255, 0.15)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          color: '#fff',
                          fontSize: '13px',
                          outline: 'none',
                          height: '37px'
                        }}
                      >
                        <option value="Zap" style={{ background: '#0e0e28' }}>Zap (Performance / Speed)</option>
                        <option value="Layout" style={{ background: '#0e0e28' }}>Layout (UI / Dashboard)</option>
                        <option value="Users" style={{ background: '#0e0e28' }}>Users (Collaboration)</option>
                        <option value="Rocket" style={{ background: '#0e0e28' }}>Rocket (Launch / Deploy)</option>
                        <option value="Smartphone" style={{ background: '#0e0e28' }}>Smartphone (Mobile / Responsive)</option>
                        <option value="BarChart3" style={{ background: '#0e0e28' }}>BarChart (Analytics / Metrics)</option>
                        <option value="CheckCircle2" style={{ background: '#0e0e28' }}>CheckCircle (Verification / Tasks)</option>
                        <option value="Sparkles" style={{ background: '#0e0e28' }}>Sparkles (Premium Features)</option>
                        <option value="Settings" style={{ background: '#0e0e28' }}>Settings (Control / Options)</option>
                        <option value="BookOpen" style={{ background: '#0e0e28' }}>BookOpen (Documentation / Guides)</option>
                        <option value="Info" style={{ background: '#0e0e28' }}>Info (Details / FAQ)</option>
                        <option value="Code2" style={{ background: '#0e0e28' }}>Code (Tech Stack)</option>
                      </select>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = detailFeatures.filter((_, idx) => idx !== index);
                        setDetailFeatures(updated);
                      }}
                      style={{
                        padding: '10px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '16px',
                        width: '38px',
                        height: '37px',
                        transition: 'all 0.2s ease',
                        margin: '16px 0 0 0'
                      }}
                      title="Remove Feature"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Feature Button */}
            <button
              type="button"
              onClick={() => {
                setDetailFeatures([...detailFeatures, { title: '', desc: '', icon: 'Zap' }]);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'rgba(124, 92, 255, 0.12)',
                border: '1px dashed rgba(124, 92, 255, 0.3)',
                borderRadius: '8px',
                color: '#a78bfa',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                width: 'auto',
                margin: 0
              }}
            >
              + Add New Key Feature Item
            </button>
          </div>

          {/* Form Actions */}
          <div className="form-actions-row" style={{ marginTop: '30px', display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="remove-action-btn"
              onClick={() => setDetailsProject(null)}
              style={{ padding: '12px 24px', width: 'auto', margin: 0 }}
            >
              Cancel Edit
            </button>
            <button
              type="submit"
              className="save-settings-btn"
              disabled={saving}
              style={{ flex: 1, justifyContent: 'center', padding: '12px 24px', background: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.4)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)' }}
            >
              {saving ? (
                <>
                  <RefreshCw size={16} className="spin-icon" /> Saving Details...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Project Details
                </>
              )}
            </button>
          </div>
        </form>
      )}

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
                        className="action-btn details-btn"
                        title="Edit Project Details"
                        onClick={() => handleOpenDetails(p)}
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          padding: 0, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderRadius: '8px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.25)',
                          color: '#60a5fa',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          margin: 0
                        }}
                      >
                        <FileText size={13} />
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
