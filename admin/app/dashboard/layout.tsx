// File: app/dashboard/layout.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import Sidebar from '../components/shared/Sidebar';
import Topbar from '../components/shared/Topbar';

interface JwtPayload {
  role: string;
  exp: number;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('sf_admin_token');
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const { role, exp } = jwtDecode<JwtPayload>(token);
      // Check role and expiration
      if (role !== 'admin' || exp * 1000 < Date.now()) {
        localStorage.removeItem('sf_admin_token');
        router.replace('/login');
        return;
      }
      setAuthorized(true);
    } catch {
      localStorage.removeItem('sf_admin_token');
      router.replace('/login');
    }
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar />

      {/* Main content with scroll */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0">
          <Topbar />
        </div>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
