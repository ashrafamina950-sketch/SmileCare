import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('sc_token'));

  useEffect(() => {
    if (!localStorage.getItem('sc_token')) return;
    api
      .get('/auth/me')
      .then((r) => setAdmin(r.data))
      .catch(() => localStorage.removeItem('sc_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('sc_token', data.token);
    setAdmin(data.admin);
  };

  const logout = () => {
    localStorage.removeItem('sc_token');
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>;
}
