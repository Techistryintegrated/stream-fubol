// app/components/LayoutWithNavbar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './shared/navbar';

export default function LayoutWithNavbar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? '';
  const hideNavbarOn = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
  ];
  const shouldHideNavbar = hideNavbarOn.includes(pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
}
