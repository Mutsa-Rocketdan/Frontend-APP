import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getMe } from '../api/auth';
import type { UserResponse } from '../types';

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  demoLogin: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token === 'demo_mode') {
      // 데모 모드: 서버 없이 mock 데이터로 체험
      setUser({ id: 'demo', email: 'demo@example.com', nickname: '데모 사용자', is_active: true, created_at: new Date().toISOString() });
      setIsLoading(false);
    } else if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('access_token');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (newToken: string) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    const res = await getMe();
    setUser(res.data);
  };

  const demoLogin = () => {
    localStorage.setItem('access_token', 'demo_mode');
    setToken('demo_mode');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, demoLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
