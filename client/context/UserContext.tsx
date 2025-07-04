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
import FootballLoader from '@/app/components/shared/Footballloader';

interface User {
  email: string;
  name?: string;
  role: 'user' | 'admin';
  _id: string;
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
      const res = await fetch('/api/auth/profile', {
        credentials: 'include',
      });
      if (!res.ok) {
        setUser(null);
      } else {
        const json = await res.json();
        setUser(json.user);
        console.log('User fetched:', json.user);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
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

  if (loading) return <FootballLoader />

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
