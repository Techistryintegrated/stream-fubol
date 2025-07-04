/** @type {import('next').NextConfig} */
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel-insights.com
    https://www.googletagmanager.com https://www.google-analytics.com
    https://pagead2.googlesyndication.com https://adservice.google.com
    https://securepubads.g.doubleclick.net https://www.gstatic.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com;
  img-src * data: blob: https://www.google-analytics.com
    https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net
    https://www.googletagmanager.com https://www.gstatic.com
    https://tpc.googlesyndication.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src * https://www.google-analytics.com https://region1.google-analytics.com
    https://stats.g.doubleclick.net https://pagead2.googlesyndication.com
    https://adservice.google.com https://securepubads.g.doubleclick.net;
  frame-ancestors 'self';
  frame-src https://*.scoreswift.in https://googleads.g.doubleclick.net
    https://tpc.googlesyndication.com https://www.youtube.com;
  object-src 'none';
  base-uri 'self';
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Content-Security-Policy', value: csp },
];

const corsHeaders = [
  { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3001' },
  { key: 'Access-Control-Allow-Credentials', value: 'true' },
  { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
  { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
];

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://streamfutball.com/api/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply both CORS and security headers on every /api/* response
        source: '/api/:path*',
        headers: [...corsHeaders, ...securityHeaders],
      },
    ];
  },
};
