'use client';

import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { UserProvider } from '../context/UserContext';
import LayoutWithNavbar from './components/LayoutWithNavbar';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} antialiased`}>
      <ToastContainer position="bottom-right" theme="dark" />
      <Provider store={store}>
        <UserProvider>
          <LayoutWithNavbar>{children}</LayoutWithNavbar>
        </UserProvider>
      </Provider>
    </div>
  );
}
