import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import {
    createProject,
    deleteProjectById,
    getProjects,
    sortProjects,
    updateProject,
    updateProjectsOrder,
} from '../../services/projectsService';
import { signOutAdmin } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

const PLACEHOLDER_IMG = '/placeholder-project.svg';
const EMPTY_FORM = {
    title: '',
    description: '',
    image_url: PLACEHOLDER_IMG,
    live_url: '',
    category: 'web',
    project_type: 'personal',
    techInput: '',
};

const reorderProjects = (items, fromId, toId) => {
    const fromIndex = items.findIndex((item) => item.id === fromId);
    const toIndex = items.findIndex((item) => item.id === toId);

    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
        return items;
    }

    const nextItems = [...items];
    const [movedItem] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, movedItem);
    return nextItems;
};

function AdminDashboard() {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [editingProject, setEditingProject] = useState(null);
    const [draggedProjectId, setDraggedProjectId] = useState(null);
    const [isOrderDirty, setIsOrderDirty] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [saveError, setSaveError] = useState('');
    const [isSavingOrder, setIsSavingOrder] = useState(false);
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
            setProjects(sortProjects(await getProjects()));
            setIsOrderDirty(false);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        }
    };

    const clearFeedback = () => {
        setSaveMessage('');
        setSaveError('');
    };

    const getNextSortOrder = (projectType, excludeId = null) => {
        const siblingOrders = projects
            .filter((project) => project.id !== excludeId && (project.project_type || 'personal') === projectType)
            .map((project) => project.sort_order)
            .filter((value) => Number.isFinite(value));

        if (siblingOrders.length === 0) {
            return 0;
        }

        return Math.max(...siblingOrders) + 1;
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try {
            await deleteProjectById(id);
            clearFeedback();
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
            project_type: formData.project_type || 'personal',
            tech: formData.techInput.split(',').map(t => t.trim()).filter(Boolean),
        };

        try {
            if (editingProject) {
                payload.sort_order =
                    editingProject.project_type === payload.project_type && Number.isFinite(editingProject.sort_order)
                        ? editingProject.sort_order
                        : getNextSortOrder(payload.project_type, editingProject.id);
                await updateProject(editingProject.id, payload);
                setEditingProject(null);
            } else {
                payload.sort_order = getNextSortOrder(payload.project_type);
                await createProject(payload);
            }
        } catch (err) {
            alert(err.message || 'Save failed');
            return;
        }

        setFormData(EMPTY_FORM);
        clearFeedback();
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
            project_type: project.project_type || 'personal',
            techInput: Array.isArray(project.tech) ? project.tech.join(', ') : '',
        });
        clearFeedback();
    };

    const cancelEdit = () => {
        setEditingProject(null);
        setFormData(EMPTY_FORM);
    };

    const handleMoveProject = (projectId, direction) => {
        const currentIndex = projects.findIndex((project) => project.id === projectId);
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (currentIndex < 0 || targetIndex < 0 || targetIndex >= projects.length) {
            return;
        }

        const reorderedProjects = [...projects];
        const [project] = reorderedProjects.splice(currentIndex, 1);
        reorderedProjects.splice(targetIndex, 0, project);
        setProjects(reorderedProjects);
        setIsOrderDirty(true);
        clearFeedback();
    };

    const handleDragStart = (projectId) => {
        setDraggedProjectId(projectId);
        clearFeedback();
    };

    const handleDragOver = (event, projectId) => {
        event.preventDefault();

        if (!draggedProjectId || draggedProjectId === projectId) {
            return;
        }

        setProjects((currentProjects) => reorderProjects(currentProjects, draggedProjectId, projectId));
    };

    const handleDragEnd = () => {
        if (draggedProjectId) {
            setIsOrderDirty(true);
        }
        setDraggedProjectId(null);
    };

    const handleSaveOrder = async () => {
        setIsSavingOrder(true);
        clearFeedback();

        const reorderedProjects = [];
        let nextSortOrder = 0;

        projects
            .filter((project) => project.project_type === 'client')
            .forEach((project) => {
                reorderedProjects.push({ id: project.id, sort_order: nextSortOrder++ });
            });

        projects
            .filter((project) => project.project_type !== 'client')
            .forEach((project) => {
                reorderedProjects.push({ id: project.id, sort_order: nextSortOrder++ });
            });

        try {
            await updateProjectsOrder(reorderedProjects);
            setSaveMessage('Portfolio order saved.');
            await fetchProjects();
        } catch (err) {
            console.error('Failed to save project order:', err);
            setSaveError(err.message || 'Unable to save order.');
        } finally {
            setIsSavingOrder(false);
        }
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
                <div className="dashboard-header-actions">
                    <button
                        type="button"
                        className="home-btn"
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </button>
                    <button
                        type="button"
                        className="logout-btn"
                        onClick={async () => { await signOutAdmin(); navigate('/'); }}
                    >
                        Logout
                    </button>
                </div>
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
                        <div className="field-group">
                            <label htmlFor="project-type">Project Type</label>
                            <select
                                id="project-type"
                                value={formData.project_type}
                                onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                            >
                                <option value="client">Client Work</option>
                                <option value="personal">Personal Project</option>
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
                        <div>
                            <h3>Your Projects ({projects.length})</h3>
                            <p>Drag to reorder. Client work always renders above personal projects.</p>
                        </div>
                        <button
                            type="button"
                            className="save-order-btn"
                            onClick={handleSaveOrder}
                            disabled={!isOrderDirty || isSavingOrder}
                        >
                            {isSavingOrder ? 'Saving...' : 'Save Order'}
                        </button>
                    </div>
                    {saveError && <p className="error-message">{saveError}</p>}
                    {saveMessage && <p className="success-message">{saveMessage}</p>}
                    <div className="project-list-scroll">
                        {projects.length === 0 && <p className="empty-state">No projects yet. Add one!</p>}
                        {projects.map((p, index) => (
                            <div
                                key={p.id}
                                className={`project-row ${editingProject?.id === p.id ? 'editing' : ''} ${draggedProjectId === p.id ? 'dragging' : ''}`}
                                draggable
                                onDragStart={() => handleDragStart(p.id)}
                                onDragOver={(event) => handleDragOver(event, p.id)}
                                onDragEnd={handleDragEnd}
                                onDrop={handleDragEnd}
                            >
                                <div className="project-info">
                                    <div className="project-row-topline">
                                        <span className="project-order">{index + 1}</span>
                                        <span className="project-title">{p.title}</span>
                                    </div>
                                    <div className="project-meta">
                                        <span className={`project-type-chip project-type-chip--${p.project_type || 'personal'}`}>
                                            {p.project_type === 'client' ? 'Client Work' : 'Personal Project'}
                                        </span>
                                        <span className="project-category">{p.category}</span>
                                        {p.live_url && <span className="project-live-chip">Live Site</span>}
                                    </div>
                                </div>
                                <div className="project-actions">
                                    <button
                                        type="button"
                                        className="reorder-btn"
                                        onClick={() => handleMoveProject(p.id, 'up')}
                                        disabled={index === 0}
                                    >
                                        Up
                                    </button>
                                    <button
                                        type="button"
                                        className="reorder-btn"
                                        onClick={() => handleMoveProject(p.id, 'down')}
                                        disabled={index === projects.length - 1}
                                    >
                                        Down
                                    </button>
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



