import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import { createProject, deleteProjectById, getProjects, updateProject } from '../../services/projectsService';
import { isFirebaseAuthEnabled, signOutAdmin, subscribeToAuth } from '../../services/authService';

const PLACEHOLDER_IMG = '/placeholder-project.svg';

function AdminDashboard() {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: PLACEHOLDER_IMG,
        live_url: '',
        category: 'web'
    });
    const [editingProject, setEditingProject] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = subscribeToAuth((user) => {
            if (isFirebaseAuthEnabled() && !user) {
                navigate('/admin');
                setAuthReady(true);
                return;
            }
            if (!isFirebaseAuthEnabled() && !sessionStorage.getItem('adminToken')) {
                navigate('/admin');
                setAuthReady(true);
                return;
            }
            setAuthReady(true);
            fetchProjects();
        });

        return () => unsubscribe();
    }, [navigate]);

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

        setFormData({ title: '', description: '', image_url: PLACEHOLDER_IMG, live_url: '', category: 'web' });
        fetchProjects();
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description || '',
            image_url: project.image_url || PLACEHOLDER_IMG,
            live_url: project.live_url || '',
            category: project.category || 'web'
        });
    };

    const cancelEdit = () => {
        setEditingProject(null);
        setFormData({ title: '', description: '', image_url: PLACEHOLDER_IMG, live_url: '', category: 'web' });
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
                <h1>Manage Projects</h1>
                <button onClick={async () => { await signOutAdmin(); navigate('/'); }}>Logout</button>
            </div>

            <div className="admin-grid">
                <div className="admin-card">
                    <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />

                        <div className="upload-section">
                            <p className="empty-state">
                                Direct upload is on hold. Using a standard placeholder image by default.
                            </p>
                            {formData.image_url && (
                                <div className="image-preview">
                                    <img src={formData.image_url} alt="Preview" />
                                    <span className="image-url">{formData.image_url}</span>
                                </div>
                            )}
                        </div>

                        <input
                            placeholder="Optional: paste custom Image URL"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        />
                        <input
                            placeholder="Live URL"
                            value={formData.live_url}
                            onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                        />
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
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

                <div className="project-list">
                    <h3>Your Projects ({projects.length})</h3>
                    {projects.length === 0 && <p className="empty-state">No projects yet. Add one!</p>}
                    {projects.map((p) => (
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
