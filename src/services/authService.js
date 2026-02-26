import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, isAdminEmail, isFirebaseConfigured } from '../firebase';

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

export const signInAdmin = async ({ email, password }) => {
  if (isFirebaseAuthEnabled()) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!isAdminEmail(cred.user.email)) {
      await signOut(auth);
      throw new Error('This account is not authorized for admin access.');
    }
    return { mode: 'firebase', user: cred.user };
  }

  const baseUrl = normalizeApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
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
