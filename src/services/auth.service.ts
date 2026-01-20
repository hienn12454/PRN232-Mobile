import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAuthInstance } from '@/src/core/firebase/auth';

const TOKEN_KEY = 'firebase_id_token';
const TOKEN_EXPIRY_KEY = 'firebase_id_token_expiry';

// Base URL Azure backend
const BASE_URL =
  'https://nongxanhbe-g6h9aadudccrgzbs.eastasia-01.azurewebsites.net';

let inMemoryToken: string | null = null;
let tokenExpiryTime: number | null = null;

// Kiểm tra token có hết hạn chưa (Firebase token hết hạn sau 1 giờ)
const isTokenExpired = (): boolean => {
  if (!tokenExpiryTime) return true;
  return Date.now() >= tokenExpiryTime;
};

// Lưu token với thời gian hết hạn
const saveTokenWithExpiry = async (token: string): Promise<void> => {
  inMemoryToken = token;
  // Token expires in 55 minutes (5 minutes buffer before actual expiry)
  tokenExpiryTime = Date.now() + 55 * 60 * 1000;
  
  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, token),
    AsyncStorage.setItem(TOKEN_EXPIRY_KEY, tokenExpiryTime.toString()),
  ]);
};

// Đăng nhập bằng email & password
export async function loginWithEmailPassword(email: string, password: string) {
  const { signInWithEmailAndPassword } = await import('firebase/auth');
  const auth = await getAuthInstance();
  
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  const token = await cred.user.getIdToken();
  await saveTokenWithExpiry(token);
  return cred;
}

// Đăng nhập Firebase bằng Google ID token lấy từ expo-auth-session
export async function loginWithGoogleIdToken(idToken: string) {
  const { GoogleAuthProvider, signInWithCredential } = await import('firebase/auth');
  const auth = await getAuthInstance();
  
  const credential = GoogleAuthProvider.credential(idToken);
  const cred = await signInWithCredential(auth, credential);
  const token = await cred.user.getIdToken();
  await saveTokenWithExpiry(token);
  return cred;
}

// Lấy Firebase ID Token mới nhất từ currentUser
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const auth = await getAuthInstance();
  const user = auth.currentUser;
  if (!user) return null;

  // Nếu token đã hết hạn, force refresh
  if (isTokenExpired()) {
    forceRefresh = true;
  }

  const token = await user.getIdToken(forceRefresh);
  await saveTokenWithExpiry(token);
  return token;
}

// Lấy token cache (ưu tiên memory, fallback AsyncStorage nếu chưa hết hạn)
export async function getCachedIdToken(): Promise<string | null> {
  // Nếu có token trong memory và chưa hết hạn
  if (inMemoryToken && !isTokenExpired()) {
    return inMemoryToken;
  }

  // Lấy từ AsyncStorage
  try {
    const [storedToken, storedExpiry] = await Promise.all([
      AsyncStorage.getItem(TOKEN_KEY),
      AsyncStorage.getItem(TOKEN_EXPIRY_KEY),
    ]);

    if (storedToken && storedExpiry) {
      tokenExpiryTime = parseInt(storedExpiry, 10);
      
      // Kiểm tra xem token có hết hạn không
      if (!isTokenExpired()) {
        inMemoryToken = storedToken;
        return storedToken;
      }
    }
  } catch (error) {
    console.error('Error reading cached token:', error);
  }

  return null;
}

// Đăng xuất
export async function logout() {
  const { signOut } = await import('firebase/auth');
  const auth = await getAuthInstance();
  
  inMemoryToken = null;
  tokenExpiryTime = null;
  
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_KEY),
    AsyncStorage.removeItem(TOKEN_EXPIRY_KEY),
    signOut(auth),
  ]);
}

// API client: tự động attach Firebase ID Token, dùng base URL Azure
export async function apiFetch(path: string, options: RequestInit = {}): Promise<any> {
  let token = await getCachedIdToken();
  
  // Nếu không có token cache hoặc đã hết hạn, lấy token mới
  if (!token) {
    token = await getIdToken(true);
  }

  if (!token) {
    throw new Error('User not authenticated – no Firebase ID Token.');
  }

  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}

// Ví dụ: gọi endpoint protected (tuỳ backend có route này hay không)
export async function getUserProfile() {
  return apiFetch('/api/profile', { method: 'GET' });
}
