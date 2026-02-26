import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase';

export const isFirebaseAuthEnabled = () => Boolean(isFirebaseConfigured && auth);

export const subscribeToAuth = (callback) => {
  if (!isFirebaseAuthEnabled()) {
    callback(null);
    return () => { };
  }
  return onAuthStateChanged(auth, callback);
};

export const signInAdmin = async ({ identifier, email, password }) => {
  const loginId = (identifier || email || '').trim();

  if (!isFirebaseAuthEnabled()) {
    throw new Error('Firebase Auth is not configured. Set REACT_APP_FIREBASE_* variables.');
  }

  const cred = await signInWithEmailAndPassword(auth, loginId, password);
  return { mode: 'firebase', user: cred.user };
};

export const signOutAdmin = async () => {
  if (!isFirebaseAuthEnabled()) {
    return;
  }
  await signOut(auth);
};

export const resetAdminPassword = async ({ identifier, email }) => {
  const loginId = (identifier || email || '').trim();

  if (!isFirebaseAuthEnabled()) {
    throw new Error('Firebase Auth is not configured. Set REACT_APP_FIREBASE_* variables.');
  }

  if (!loginId) {
    throw new Error('Enter your admin email first.');
  }

  await sendPasswordResetEmail(auth, loginId);
};
