// context/UserContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import FootballLoader from '@/app/components/shared/Footballloader';

interface User {
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch profile
  const refreshUser = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_APIURL;
      console.log('API URL:', apiUrl);
      const res = await axios.get(`/api/auth/profile`, {
        withCredentials: true,
      });
      setUser(res.data.user);
      console.log('User fetched:', res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      toast.success('Logged out');
      router.push('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  // On mount, fetch user
  useEffect(() => {
    refreshUser();
  }, []);

  if (loading) return <FootballLoader />;

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook
export function useUser() {
  return useContext(UserContext);
}
