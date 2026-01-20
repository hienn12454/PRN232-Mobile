import type { Auth } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { firebaseConfig } from './config';

let authInstance: Auth | null = null;

// Lazy initialization - chỉ khởi tạo Firebase khi thực sự cần
export const getAuthInstance = async (): Promise<Auth> => {
  if (authInstance) return authInstance;

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  authInstance = getAuth(app);

  return authInstance;
};

// Backwards compatibility - proxy để dùng như auth đồng bộ sau khi init
export const auth = new Proxy({} as Auth, {
  get: (_, prop) => {
    if (!authInstance) {
      throw new Error('Auth not initialized. Call getAuthInstance() first.');
    }
    return (authInstance as any)[prop];
  },
});

