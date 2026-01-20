import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getAuthInstance } from '@/src/core/firebase/auth';
import {
  getIdToken,
  loginWithEmailPassword,
  loginWithGoogleIdToken,
} from '@/src/features/auth/services/auth.service';

WebBrowser.maybeCompleteAuthSession();

// Redirect URI cho OAuth (dùng scheme app)
const redirectUri = AuthSession.makeRedirectUri({
  scheme: 'prn232mobile',
});

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  // Dùng Web Client ID cho Google OAuth
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useIdTokenAuthRequest({
    clientId: '811222423359-3h7s65fglv08o1vb8q61n6vlbnr49spu.apps.googleusercontent.com',
    redirectUri,
  });

  useEffect(() => {
    isMounted.current = true;

    const initAuthListener = async () => {
      const { onAuthStateChanged } = await import('firebase/auth');
      const auth = await getAuthInstance();

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!isMounted.current) return;

        if (user) {
          console.log('✅ User logged in (Firebase):', user.email);
          const token = await getIdToken();
          console.log('🔥 Firebase ID Token:', token);
          router.replace('/(tabs)');
        }
      });

      return unsubscribe;
    };

    let unsubscribe: (() => void) | undefined;
    initAuthListener().then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      isMounted.current = false;
      unsubscribe?.();
    };
  }, [router]);

  useEffect(() => {
    if (!googleResponse || !isMounted.current) return;

    if (
      googleResponse.type === 'success' &&
      'params' in googleResponse &&
      typeof googleResponse.params?.id_token === 'string'
    ) {
      (async () => {
        try {
          setLoading(true);
          setError('');
          const idToken = googleResponse.params.id_token;
          console.log('✅ Google OAuth success, idToken:', idToken);
          await loginWithGoogleIdToken(idToken);
          const token = await getIdToken();
          console.log('🔥 Firebase ID Token (Google):', token);
        } catch (err) {
          console.error('❌ Google login error', err);
          if (isMounted.current) {
            setError('Không đăng nhập được bằng Google, thử lại.');
          }
        } finally {
          if (isMounted.current) {
            setLoading(false);
          }
        }
      })();
    } else if (googleResponse.type === 'error') {
      console.error('❌ Google auth error:', 'error' in googleResponse ? googleResponse.error : undefined);
      if (isMounted.current) {
        setError('Có lỗi xảy ra với Google Sign-in.');
      }
    } else if (googleResponse.type === 'cancel') {
      console.log('ℹ️ User cancelled Google login');
    }
  }, [googleResponse]);

  const handleEmailLogin = useCallback(async () => {
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    Keyboard.dismiss();
    setError('');
    setLoading(true);

    try {
      const result = await loginWithEmailPassword(email, password);
      console.log('✅ Email login success:', result.user.email);
      const token = await getIdToken();
      console.log('🔥 Firebase ID Token (email/password):', token);
    } catch (err: any) {
      console.error('❌ Email login error', err);
      if (!isMounted.current) return;

      let msg = 'Đăng nhập thất bại, thử lại.';
      if (err.code === 'auth/invalid-email') msg = 'Email không hợp lệ.';
      if (err.code === 'auth/user-not-found') msg = 'Không tìm thấy tài khoản.';
      if (err.code === 'auth/wrong-password') msg = 'Mật khẩu không đúng.';
      if (err.code === 'auth/too-many-requests') msg = 'Thử quá nhiều lần, chờ thêm.';
      if (err.code === 'auth/invalid-credential') msg = 'Email hoặc mật khẩu không đúng.';
      setError(msg);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [email, password]);

  const handleGoogleLogin = useCallback(async () => {
    console.log('🔵 Google login button pressed');
    if (!googleRequest) {
      Alert.alert('Lỗi', 'Google Sign-in chưa sẵn sàng, thử lại sau.');
      return;
    }
    setError('');
    await googlePromptAsync();
  }, [googleRequest, googlePromptAsync]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>NongXanh 🌱</Text>
            <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleEmailLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              <Text style={styles.socialText}>🔍 Đăng nhập với Google</Text>
            </TouchableOpacity>

            <Text style={styles.debugText}>
              Redirect URI: {redirectUri}
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginTop: 6,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#ffecec',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 13,
  },
  socialButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleButton: {
    backgroundColor: '#f1f3f4',
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  socialText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '600',
  },
  debugText: {
    fontSize: 10,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

