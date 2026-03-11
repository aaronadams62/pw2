import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

const assertFirebaseData = () => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured. Set REACT_APP_FIREBASE_* variables.');
  }
};

const PROJECT_TYPE_PRIORITY = {
  client: 0,
  personal: 1,
};

const normalizeProjectType = (value) => (value === 'client' ? 'client' : 'personal');

const normalizeSortOrder = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const timestampToMillis = (value) => {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (value instanceof Date) return value.getTime();
  return 0;
};

export const sortProjects = (projects) => [...projects].sort((a, b) => {
  const typeDiff =
    (PROJECT_TYPE_PRIORITY[normalizeProjectType(a.project_type)] ?? PROJECT_TYPE_PRIORITY.personal) -
    (PROJECT_TYPE_PRIORITY[normalizeProjectType(b.project_type)] ?? PROJECT_TYPE_PRIORITY.personal);

  if (typeDiff !== 0) {
    return typeDiff;
  }

  const aOrder = normalizeSortOrder(a.sort_order);
  const bOrder = normalizeSortOrder(b.sort_order);

  if (aOrder !== null && bOrder !== null && aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  if (aOrder !== null) return -1;
  if (bOrder !== null) return 1;

  const createdDiff = timestampToMillis(b.created_at) - timestampToMillis(a.created_at);
  if (createdDiff !== 0) {
    return createdDiff;
  }

  return (a.title || '').localeCompare(b.title || '');
});

const normalizeProject = (project) => ({
  id: project.id,
  title: project.title || '',
  description: project.description || '',
  image_url: project.image_url || '',
  live_url: project.live_url || '',
  category: project.category || 'web',
  project_type: normalizeProjectType(project.project_type),
  sort_order: normalizeSortOrder(project.sort_order),
  tech: Array.isArray(project.tech) ? project.tech : [],
  created_at: project.created_at || null,
});

export const getProjects = async () => {
  assertFirebaseData();
  const projectsRef = collection(db, 'projects');
  const q = query(projectsRef, orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return sortProjects(snapshot.docs.map((d) => normalizeProject({ id: d.id, ...d.data() })));
};

export const createProject = async (project) => {
  const payload = {
    title: project.title,
    description: project.description,
    image_url: project.image_url,
    live_url: project.live_url,
    category: project.category || 'web',
    project_type: normalizeProjectType(project.project_type),
    sort_order: normalizeSortOrder(project.sort_order),
    tech: Array.isArray(project.tech) ? project.tech : [],
  };

  assertFirebaseData();
  const projectsRef = collection(db, 'projects');
  const docRef = await addDoc(projectsRef, {
    ...payload,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return normalizeProject({ id: docRef.id, ...payload });
};

export const updateProject = async (id, project) => {
  const payload = {
    title: project.title,
    description: project.description,
    image_url: project.image_url,
    live_url: project.live_url,
    category: project.category || 'web',
    project_type: normalizeProjectType(project.project_type),
    sort_order: normalizeSortOrder(project.sort_order),
    tech: Array.isArray(project.tech) ? project.tech : [],
  };

  assertFirebaseData();
  const projectRef = doc(db, 'projects', String(id));
  await updateDoc(projectRef, {
    ...payload,
    updated_at: serverTimestamp(),
  });
  return normalizeProject({ id: String(id), ...payload });
};

export const deleteProjectById = async (id) => {
  assertFirebaseData();
  await deleteDoc(doc(db, 'projects', String(id)));
};

export const updateProjectsOrder = async (projects) => {
  assertFirebaseData();
  const batch = writeBatch(db);

  projects.forEach((project) => {
    const projectRef = doc(db, 'projects', String(project.id));
    batch.update(projectRef, {
      sort_order: normalizeSortOrder(project.sort_order),
      updated_at: serverTimestamp(),
    });
  });

  await batch.commit();
};

