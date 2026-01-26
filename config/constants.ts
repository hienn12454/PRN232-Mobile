/**
 * App Constants và Configuration
 * 
 * HƯỚNG DẪN LẤY FIREBASE CONFIG:
 * 1. Truy cập https://console.firebase.google.com/
 * 2. Chọn project của bạn (hoặc tạo mới)
 * 3. Vào Project Settings > General > Your apps
 * 4. Nếu chưa có app Web, click "Add app" > chọn Web (</>)
 * 5. Copy các giá trị từ Firebase config object và paste vào dưới đây
 * 
 * Lưu ý: Đảm bảo đã bật Google Sign-In method trong Firebase Console:
 * - Vào Authentication > Sign-in method
 * - Bật Google provider và nhập Web client ID
 */

export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDuhSFYOeM3NWg_ot1PgSAmHHU1Fl7LA9s',
  authDomain: 'prn232-dc13f.firebaseapp.com',
  projectId: 'prn232-dc13f',
  storageBucket: 'prn232-dc13f.firebasestorage.app',
  messagingSenderId: '1073724553842',
  appId: '1:1073724553842:web:c94317ba3047da2530a0eb',
  measurementId: 'G-P113M3HXD0',
};

// API Configuration
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' // Development
  : 'https://your-api-domain.com/api'; // Production

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
};
