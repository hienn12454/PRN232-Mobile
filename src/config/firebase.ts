import type { Auth } from 'firebase/auth';

// Firebase config cho PRN232 (không dùng analytics)
const firebaseConfig = {
  apiKey: 'AIzaSyARVRkB_8oI94qCS2cV9eZLhdxL5WqMHSI',
  authDomain: 'prn232-9581d.firebaseapp.com',
  projectId: 'prn232-9581d',
  storageBucket: 'prn232-9581d.firebasestorage.app',
  messagingSenderId: '811222423359',
  appId: '1:811222423359:web:2fb5265d545f49760d258a',
};

let authInstance: Auth | null = null;

// Lazy initialization - chỉ khởi tạo Firebase khi thực sự cần
export const getAuthInstance = async (): Promise<Auth> => {
  if (authInstance) return authInstance;

  // Dynamic import để giảm bundle size ban đầu
  const { getApps, initializeApp } = await import('firebase/app');
  const { getAuth } = await import('firebase/auth');

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  authInstance = getAuth(app);

  return authInstance;
};

// Backwards compatibility - lazy load auth instance
export const auth = new Proxy({} as Auth, {
  get: (_, prop) => {
    if (!authInstance) {
      throw new Error('Auth not initialized. Call getAuthInstance() first.');
    }
    return (authInstance as any)[prop];
  },
});
