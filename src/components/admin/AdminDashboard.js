import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import { createProject, deleteProjectById, getProjects, updateProject } from '../../services/projectsService';
import { signOutAdmin } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

const PLACEHOLDER_IMG = '/placeholder-project.svg';

function AdminDashboard() {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: PLACEHOLDER_IMG,
        live_url: '',
        category: 'web',
        techInput: '',
    });
    const [editingProject, setEditingProject] = useState(null);
    const { authEnabled, authReady, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authReady) return;
        if (!authEnabled || !user) {
            navigate('/admin');
            return;
        }
        fetchProjects();
    }, [authEnabled, authReady, navigate, user]);

    const fetchProjects = async () => {
        try {
            setProjects(await getProjects());
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await deleteProjectById(id);
            fetchProjects();
        } catch (err) {
            alert(err.message || 'Delete failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            image_url: formData.image_url.trim() || PLACEHOLDER_IMG,
            tech: formData.techInput.split(',').map(t => t.trim()).filter(Boolean),
        };

        try {
            if (editingProject) {
                await updateProject(editingProject.id, payload);
                setEditingProject(null);
            } else {
                await createProject(payload);
            }
        } catch (err) {
            alert(err.message || 'Save failed');
            return;
        }

        setFormData({ title: '', description: '', image_url: PLACEHOLDER_IMG, live_url: '', category: 'web', techInput: '' });
        fetchProjects();
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description || '',
            image_url: project.image_url || PLACEHOLDER_IMG,
            live_url: project.live_url || '',
            category: project.category || 'web',
            techInput: Array.isArray(project.tech) ? project.tech.join(', ') : '',
        });
    };

    const cancelEdit = () => {
        setEditingProject(null);
        setFormData({ title: '', description: '', image_url: PLACEHOLDER_IMG, live_url: '', category: 'web', techInput: '' });
    };

    if (!authReady) {
        return (
            <div className="admin-dashboard">
                <p className="empty-state">Checking admin session...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div className="dashboard-header-copy">
                    <h1>Manage Projects</h1>
                    <p>Update your portfolio content and keep listings current.</p>
                </div>
                <button
                    className="logout-btn"
                    onClick={async () => { await signOutAdmin(); navigate('/'); }}
                >
                    Logout
                </button>
            </div>

            <div className="admin-grid">
                <div className="admin-card admin-card--form">
                    <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                    <form className="admin-project-form" onSubmit={handleSubmit}>
                        <div className="field-group">
                            <label htmlFor="project-title">Project Title</label>
                            <input
                                id="project-title"
                                placeholder="United Camper — Regional Rental Hub"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="field-group">
                            <label htmlFor="project-description">Description</label>
                            <textarea
                                id="project-description"
                                placeholder="Summarize the problem, solution, and outcome."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                required
                            />
                        </div>

                        <div className="upload-section">
                            <p className="upload-note">
                                Direct upload is on hold. Using a standard placeholder image by default.
                            </p>
                            {formData.image_url && (
                                <div className="image-preview">
                                    <img src={formData.image_url} alt="Preview" />
                                    <span className="image-url">{formData.image_url}</span>
                                </div>
                            )}
                        </div>

                        <div className="field-group">
                            <label htmlFor="project-image-url">Image URL</label>
                            <input
                                id="project-image-url"
                                placeholder="Optional: paste custom image URL"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            />
                        </div>
                        <div className="field-group">
                            <label htmlFor="project-live-url">Live URL</label>
                            <input
                                id="project-live-url"
                                type="url"
                                placeholder="https://example.com"
                                value={formData.live_url}
                                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                            />
                        </div>
                        <div className="field-group">
                            <label htmlFor="project-tech">Tech Stack</label>
                            <input
                                id="project-tech"
                                placeholder="React, Node.js, Firebase"
                                value={formData.techInput}
                                onChange={(e) => setFormData({ ...formData, techInput: e.target.value })}
                            />
                        </div>
                        <div className="field-group">
                            <label htmlFor="project-category">Category</label>
                            <select
                                id="project-category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="web">Web Development</option>
                                <option value="marketing">Marketing</option>
                            </select>
                        </div>
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

                <div className="project-list">
                    <div className="project-list-header">
                        <h3>Your Projects ({projects.length})</h3>
                        <p>Select one to edit or remove.</p>
                    </div>
                    <div className="project-list-scroll">
                        {projects.length === 0 && <p className="empty-state">No projects yet. Add one!</p>}
                        {projects.map((p) => (
                            <div key={p.id} className={`project-row ${editingProject?.id === p.id ? 'editing' : ''}`}>
                                <div className="project-info">
                                    <span className="project-title">{p.title}</span>
                                    <span className="project-category">{p.category}</span>
                                </div>
                                <div className="project-actions">
                                    <button type="button" onClick={() => handleEdit(p)} className="edit-btn">Edit</button>
                                    <button type="button" onClick={() => handleDelete(p.id)} className="delete-btn">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
