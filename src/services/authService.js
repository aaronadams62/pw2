import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const normalizeApiBaseUrl = () => {
  let baseUrl = API_URL.trim().replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) {
    baseUrl = baseUrl.slice(0, -4);
  }
  return baseUrl;
};

export const isFirebaseAuthEnabled = () => Boolean(isFirebaseConfigured && auth);

export const subscribeToAuth = (callback) => {
  if (!isFirebaseAuthEnabled()) {
    const hasToken = Boolean(sessionStorage.getItem('adminToken'));
    callback(hasToken ? { email: null } : null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export const signInAdmin = async ({ identifier, email, password }) => {
  const loginId = (identifier || email || '').trim();

  if (isFirebaseAuthEnabled()) {
    const cred = await signInWithEmailAndPassword(auth, loginId, password);
    return { mode: 'firebase', user: cred.user };
  }

  const baseUrl = normalizeApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: loginId, password }),
  });
  if (!response.ok) {
    throw new Error('Invalid credentials');
  }
  const data = await response.json();
  sessionStorage.setItem('adminToken', data.token);
  return { mode: 'api' };
};

export const signOutAdmin = async () => {
  if (isFirebaseAuthEnabled()) {
    await signOut(auth);
    return;
  }
  sessionStorage.removeItem('adminToken');
};
