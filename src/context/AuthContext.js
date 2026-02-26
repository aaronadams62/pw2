import React, { createContext, useEffect, useMemo, useState } from 'react';
import { isFirebaseAuthEnabled, subscribeToAuth } from '../services/authService';

export const AuthContext = createContext({
  authReady: false,
  authEnabled: false,
  user: null,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const authEnabled = isFirebaseAuthEnabled();

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      setAuthReady(true);
      return () => { };
    }

    const unsubscribe = subscribeToAuth((nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({
    user,
    authReady,
    authEnabled,
  }), [user, authReady, authEnabled]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
