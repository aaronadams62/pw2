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

const assertFirebaseData = () => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured. Set REACT_APP_FIREBASE_* variables.');
  }
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
  assertFirebaseData();
  const projectsRef = collection(db, 'projects');
  const q = query(projectsRef, orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => normalizeProject({ id: d.id, ...d.data() }));
};

export const createProject = async (project) => {
  const payload = {
    title: project.title,
    description: project.description,
    image_url: project.image_url,
    live_url: project.live_url,
    category: project.category || 'web',
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
