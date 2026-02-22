'use client';

import { useCallback, useEffect, useState } from 'react';

const SESSION_KEY = 'dj-admin-key';

export const useAdminAuth = () => {
  const [accessKey, setAccessKey] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);

    if (stored) {
      setAccessKey(stored);
    }

    setReady(true);
  }, []);

  const login = useCallback((key: string) => {
    sessionStorage.setItem(SESSION_KEY, key);
    setAccessKey(key);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAccessKey('');
  }, []);

  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers);
      headers.set('x-admin-key', accessKey);

      return fetch(url, { ...options, headers, cache: 'no-store' });
    },
    [accessKey],
  );

  return {
    accessKey,
    isAuthenticated: ready && accessKey.length > 0,
    ready,
    login,
    logout,
    fetchWithAuth,
  };
};
