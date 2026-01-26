import { STORAGE_KEYS } from '@/config/constants';
import { auth } from '@/config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithCredential,
    signInWithEmailAndPassword,
    updateProfile,
    User,
} from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getAuthToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Expo Go với proxy: PHẢI dùng Web Client ID cho cả iOS/Android để redirect_uri https://auth.expo.io/... thuộc đúng client.
  // Nếu dùng iosClientId/androidClientId riêng, Google từ chối vì redirect URI chỉ có trong Web client.
  const WEB_CLIENT_ID = '1073724553842-vaa0e7pqu9dm052r775hpfbkrk771ekv.apps.googleusercontent.com';
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: WEB_CLIENT_ID,
    androidClientId: WEB_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    redirectUri: 'https://auth.expo.io/@namnm309/PRN232_Mobile',
    scopes: ['openid', 'profile', 'email'],
    responseType: 'id_token',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        // Lưu token vào AsyncStorage
        const token = await user.getIdToken();
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential)
          .then(() => {
            // Sign-in thành công, onAuthStateChanged sẽ tự động cập nhật user state
            console.log('Google Sign-In thành công');
          })
          .catch((error: any) => {
            console.error('Google Sign-In Credential Error:', error);
            // Log chi tiết lỗi để debug
            if (error.code) {
              console.error('Error Code:', error.code);
              console.error('Error Message:', error.message);
            }
          });
      } else {
        console.error('Google Sign-In: Không có id_token trong response');
      }
    } else if (response?.type === 'error') {
      console.error('Google Sign-In Response Error:', response.error);
      console.error('Error Code:', response.error?.code);
      console.error('Error Description:', response.error?.description);
    } else if (response?.type === 'cancel') {
      console.log('Google Sign-In bị hủy bởi user');
    }
  }, [response]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Đăng nhập thất bại');
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Đăng ký thất bại');
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!request) {
        throw new Error('Google OAuth request chưa sẵn sàng. Vui lòng thử lại.');
      }

      // Cần mở qua proxy /start để auth.expo.io biết returnUrl và redirect đúng về app.
      const authUrl = request.url ?? (await request.makeAuthUrlAsync(Google.discovery));
      if (!authUrl) {
        throw new Error('Không tạo được OAuth URL.');
      }

      const returnUrl = AuthSession.getDefaultReturnUrl();
      const startUrl =
        `https://auth.expo.io/@namnm309/PRN232_Mobile/start?` +
        `authUrl=${encodeURIComponent(authUrl)}&returnUrl=${encodeURIComponent(returnUrl)}`;

      console.log('Starting Google Sign-In via proxy /start...');
      const result = await WebBrowser.openAuthSessionAsync(startUrl, returnUrl);

      if (result.type !== 'success' || !result.url) {
        if (result.type === 'cancel') {
          console.log('Google Sign-In bị hủy.');
        }
        return;
      }

      const url = result.url;
      // OAuth có thể trả params ở query (?...) hoặc fragment (#...) — Google id_token thường nằm trong fragment.
      const parsed = new URL(url);
      const queryParams = Object.fromEntries(parsed.searchParams);
      const hashParams = parsed.hash
        ? Object.fromEntries(new URLSearchParams(parsed.hash.replace(/^#/, '')))
        : {};
      const params = { ...queryParams, ...hashParams };
      const idToken = params.id_token ?? params.id_token_hint;

      if (idToken) {
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
        console.log('Google Sign-In thành công.');
      } else {
        console.error('Google Sign-In: không có id_token trong URL:', url);
        throw new Error('Đăng nhập Google thất bại: thiếu token.');
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      if (error?.message) console.error('Error message:', error.message);
      if (error?.code) console.error('Error code:', error.code);
      throw new Error(error?.message || 'Đăng nhập Google thất bại');
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error: any) {
      throw new Error(error.message || 'Đăng xuất thất bại');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Gửi email đặt lại mật khẩu thất bại');
    }
  };

  const getAuthToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      const token = await user.getIdToken();
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    getAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
