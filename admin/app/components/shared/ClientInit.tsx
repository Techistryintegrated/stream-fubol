'use client';

import { useEffect } from 'react';

export default function ClientInit() {
  useEffect(() => {
    const token = localStorage.getItem('sf_admin_token');
    if (token) {
      // Override global fetch to always include your Bearer header
      const originalFetch = window.fetch.bind(window);
      window.fetch = (input, init = {}) => {
        init.headers = {
          ...((init.headers as Record<string, string>) || {}),
          Authorization: `Bearer ${token}`,
        };
        return originalFetch(input, init);
      };
    }
  }, []);

  return null;
}
