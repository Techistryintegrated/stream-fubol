

import type { Metadata } from 'next';
import './globals.css';
// import Navbar from "./components/shared/navbar";

import ClientLayout from './ClientLayout';


export const metadata: Metadata = {
  title: 'Streamfutball - Watch Live Football Matches',
  description:
    'Streamfutball lets you watch live football matches from around the world. No account required. Just stream and enjoy.',
  keywords: [
    'football streaming',
    'live sports',
    'watch football online',
    'Streamfutball',
    'free football stream',
    'live football',
    'sports app',
  ],
  authors: [{ name: 'Marvellous Ibironke', url: 'https://streamfutball.com' }],
  creator: 'Techistry Integrated',
  openGraph: {
    title: 'Streamfutball - Watch Live Football Matches',
    description:
      'Catch live football games without signing up. Free, fast, and accessible on all devices.',
    url: 'https://streamfutball.com',
    siteName: 'Streamfutball',
    images: [
      {
        url: 'https://streamfutball.com/streamfutball.png',
        width: 1200,
        height: 630,
        alt: 'Streamfutball - Watch Live Football',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streamfutball - Watch Live Football',
    description:
      'Watch football matches live and free. Powered by licensed sources.',
    images: ['https://streamfutball.com/streamfutball.png'],
    creator: '@Streamfutball',
  },
  metadataBase: new URL('https://streamfutball.com'),
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
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
