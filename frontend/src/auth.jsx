import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'sacco-auth';
const AuthContext = createContext(null);

function loadSavedAuth() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) {
      return { authenticated: false, role: null, memberNumber: '' };
    }
    const parsed = JSON.parse(value);
    return {
      authenticated: !!parsed.authenticated,
      role: parsed.role || null,
      memberNumber: parsed.memberNumber || '',
    };
  } catch {
    return { authenticated: false, role: null, memberNumber: '' };
  }
}

function saveAuth(authState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadSavedAuth());

  useEffect(() => {
    saveAuth(auth);
  }, [auth]);

  const loginAdmin = (username, password) => {
    if (username !== 'admin' || password !== 'admin123') {
      throw new Error('Invalid admin credentials');
    }
    setAuth({ authenticated: true, role: 'admin', memberNumber: '' });
  };

  const loginMember = (memberNumber) => {
    if (!memberNumber) {
      throw new Error('Member number is required');
    }
    setAuth({ authenticated: true, role: 'member', memberNumber });
  };

  const logout = () => {
    setAuth({ authenticated: false, role: null, memberNumber: '' });
  };

  const value = useMemo(
    () => ({ ...auth, loginAdmin, loginMember, logout }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
