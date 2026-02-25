import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import { createProject, deleteProjectById, getProjects, updateProject } from '../../services/projectsService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function AdminDashboard() {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        live_url: '',
        category: 'web'
    });
    const [editingProject, setEditingProject] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const token = sessionStorage.getItem('adminToken');

    useEffect(() => {
        if (!token) {
            navigate('/admin');
            return;
        }
        fetchProjects();
    }, [token, navigate]);

    const fetchProjects = async () => {
        try {
            setProjects(await getProjects());
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this project?")) return;
        try {
            await deleteProjectById(id);
            fetchProjects();
        } catch (err) {
            alert(err.message || 'Delete failed');
            return;
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            const res = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formDataUpload
            });
            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, image_url: data.url }));
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Image upload failed');
        }
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingProject) {
                await updateProject(editingProject.id, formData);
                setEditingProject(null);
            } else {
                await createProject(formData);
            }
        } catch (err) {
            alert(err.message || 'Save failed');
            return;
        }

        setFormData({ title: '', description: '', image_url: '', live_url: '', category: 'web' });
        fetchProjects();
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description || '',
            image_url: project.image_url || '',
            live_url: project.live_url || '',
            category: project.category || 'web'
        });
    };

    const cancelEdit = () => {
        setEditingProject(null);
        setFormData({ title: '', description: '', image_url: '', live_url: '', category: 'web' });
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Manage Projects</h1>
                <button onClick={() => { sessionStorage.removeItem('adminToken'); navigate('/'); }}>Logout</button>
            </div>

            <div className="admin-grid">
                {/* Add/Edit Project Form */}
                <div className="admin-card">
                    <h3>{editingProject ? '✏️ Edit Project' : '➕ Add New Project'}</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            placeholder="Title"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />

                        {/* Image Upload Section */}
                        <div className="upload-section">
                            <label className="upload-label">
                                📷 {uploading ? 'Uploading...' : 'Upload Image'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    style={{ display: 'none' }}
                                />
                            </label>
                            {formData.image_url && (
                                <div className="image-preview">
                                    <img src={formData.image_url} alt="Preview" />
                                    <span className="image-url">{formData.image_url}</span>
                                </div>
                            )}
                        </div>

                        <input
                            placeholder="Or paste Image URL manually"
                            value={formData.image_url}
                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                        />
                        <input
                            placeholder="Live URL"
                            value={formData.live_url}
                            onChange={e => setFormData({ ...formData, live_url: e.target.value })}
                        />
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            <option value="web">Web Development</option>
                            <option value="marketing">Marketing</option>
                        </select>
                        <div className="form-actions">
                            <button type="submit" className="admin-btn">
                                {editingProject ? 'Save Changes' : 'Add Project'}
                            </button>
                            {editingProject && (
                                <button type="button" className="cancel-btn" onClick={cancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Project List */}
                <div className="project-list">
                    <h3>📁 Your Projects ({projects.length})</h3>
                    {projects.length === 0 && <p className="empty-state">No projects yet. Add one!</p>}
                    {projects.map(p => (
                        <div key={p.id} className={`project-row ${editingProject?.id === p.id ? 'editing' : ''}`}>
                            <div className="project-info">
                                <span className="project-title">{p.title}</span>
                                <span className="project-category">{p.category}</span>
                            </div>
                            <div className="project-actions">
                                <button onClick={() => handleEdit(p)} className="edit-btn">Edit</button>
                                <button onClick={() => handleDelete(p.id)} className="delete-btn">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
