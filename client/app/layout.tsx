// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
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
        url: '/streamfutball.png',
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
    images: ['/streamfutball.png'],
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
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LT1GNPBVXD"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LT1GNPBVXD');
            `,
          }}
        />

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4883362165426113"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2587638381589796');
          fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* noscript fallback for Meta Pixel */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2587638381589796&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
