import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import Navbar from "./components/shared/navbar";
import { ToastContainer } from 'react-toastify';
import LayoutWithNavbar from './components/LayoutWithNavbar';
import { UserProvider } from '../context/UserContext';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StreamFutbol - Watch Live Football Matches',
  description:
    'StreamFutbol lets you watch live football matches from around the world. No account required. Just stream and enjoy.',
  keywords: [
    'football streaming',
    'live sports',
    'watch football online',
    'StreamFutbol',
    'free football stream',
    'live football',
    'sports app',
  ],
  authors: [{ name: 'Marvellous Ibironke', url: 'https://streamfutbol.com' }],
  creator: 'Techistry Integrated',
  openGraph: {
    title: 'StreamFutbol - Watch Live Football Matches',
    description:
      'Catch live football games without signing up. Free, fast, and accessible on all devices.',
    url: 'https://streamfutbol.com',
    siteName: 'StreamFutbol',
    images: [
      {
        url: 'https://streamfutbol.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'StreamFutbol - Watch Live Football',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreamFutbol - Watch Live Football',
    description:
      'Watch football matches live and free. Powered by licensed sources.',
    images: ['https://streamfutbol.com/twitter-image.jpg'],
    creator: '@streamfutbol',
  },
  metadataBase: new URL('https://streamfutbol.com'),
  themeColor: '#0d1117',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: hooks like usePathname only work inside Client Components
  // So wrap your layout in a Client Component if it's not already

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ToastContainer position="bottom-right" theme="dark" />
        <UserProvider>
          <LayoutWithNavbar>{children}</LayoutWithNavbar>
        </UserProvider>
      </body>
    </html>
  );
}
