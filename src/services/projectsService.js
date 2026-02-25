import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const normalizeApiBaseUrl = () => {
  let baseUrl = API_URL.trim().replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.slice(0, -4);
  }
  return baseUrl;
};

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeProject = (project) => ({
  id: project.id,
  title: project.title || '',
  description: project.description || '',
  image_url: project.image_url || '',
  live_url: project.live_url || '',
  category: project.category || 'web',
  created_at: project.created_at || null,
});

export const getProjects = async () => {
  if (isFirebaseConfigured && db) {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => normalizeProject({ id: d.id, ...d.data() }));
  }

  const baseUrl = normalizeApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/projects`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  const payload = await response.json();
  return (payload.data || []).map(normalizeProject);
};

export const createProject = async (project) => {
  const payload = {
    title: project.title,
    description: project.description,
    image_url: project.image_url,
    live_url: project.live_url,
    category: project.category || 'web',
  };

  if (isFirebaseConfigured && db) {
    const projectsRef = collection(db, 'projects');
    const docRef = await addDoc(projectsRef, {
      ...payload,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    return normalizeProject({ id: docRef.id, ...payload });
  }

  const baseUrl = normalizeApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Create failed: ${response.status} ${response.statusText}`);
  }
  return normalizeProject(await response.json());
};

export const updateProject = async (id, project) => {
  const payload = {
    title: project.title,
    description: project.description,
    image_url: project.image_url,
    live_url: project.live_url,
    category: project.category || 'web',
  };

  if (isFirebaseConfigured && db) {
    const projectRef = doc(db, 'projects', String(id));
    await updateDoc(projectRef, {
      ...payload,
      updated_at: serverTimestamp(),
    });
    return normalizeProject({ id: String(id), ...payload });
  }

  const baseUrl = normalizeApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Update failed: ${response.status} ${response.statusText}`);
  }
  return normalizeProject(await response.json());
};

export const deleteProjectById = async (id) => {
  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'projects', String(id)));
    return;
  }

  const baseUrl = normalizeApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
  }
};
