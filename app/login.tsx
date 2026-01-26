import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { user, signInWithEmail, signInWithGoogle } = useAuth();
  const inputColors =
    colorScheme === 'light'
      ? {
          label: '#2D3A2E',
          placeholder: '#9FAF9E',
          text: '#1F2A1F',
        }
      : {
          label: '#E4F7E7',
          placeholder: '#B5CDBC',
          text: '#F6FFF7',
        };
  const backgroundLayer = colorScheme === 'light' ? '#DFF5E1' : themeColors.background;
  const cardBackground = colorScheme === 'light' ? '#FFFFFF' : themeColors.card;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Khi đăng nhập thành công (email hoặc Google) thì redirect về app
  useEffect(() => {
    if (user) {
      setLoading(false);
      router.replace('/(tabs)');
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Lỗi đăng nhập', error.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Redirect về app khi user có trong useEffect
    } catch (error: any) {
      console.error('Google Login Error:', error);
      Alert.alert(
        'Lỗi đăng nhập Google',
        error.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.',
        [{ text: 'OK' }]
      );
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    Alert.alert('Quên mật khẩu', 'Tính năng này sẽ được triển khai sau');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: backgroundLayer }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.pageContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.appName}>Nông Sản Tươi</Text>
              <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>
            </View>

            {/* Form Card */}
            <View
              style={[
                styles.formCard,
                { backgroundColor: cardBackground },
                colorScheme === 'light' ? styles.cardShadowLight : styles.cardShadowDark,
              ]}
            >
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="example@email.com"
                icon="mail"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                labelColor={inputColors.label}
                placeholderColor={inputColors.placeholder}
                textColor={inputColors.text}
              />

              <Input
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                icon="lock"
                secureTextEntry
                error={errors.password}
                labelColor={inputColors.label}
                placeholderColor={inputColors.placeholder}
                textColor={inputColors.text}
              />

              <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>

              <Button
                title="Đăng nhập"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
              />

              {/* Separator */}
              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>Hoặc</Text>
                <View style={styles.separatorLine} />
              </View>

              {/* Google Sign-In Button */}
              <Button
                title="Đăng nhập với Google"
                onPress={handleGoogleLogin}                
                style={styles.googleButton}    
                textColor='green'            
              />

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Chưa có tài khoản? </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text style={styles.registerLink}>Đăng ký ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  pageContent: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1D5A2E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#75B282',
  },
  formCard: {
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
  },
  cardShadowLight: {
    shadowColor: '#61AD77',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  cardShadowDark: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#1F6D38',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 24,
    borderRadius: 18,
    shadowColor: '#2D7036',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DEE7DC',
  },
  separatorText: {
    marginHorizontal: 16,
    color: '#8AA08C',
    fontSize: 14,
  },
  googleButton: {
    marginBottom: 24,
    borderRadius: 18,
    borderColor: '#E1EAE0',
    backgroundColor: '#F9FFFA',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerText: {
    color: '#6D7F71',
    fontSize: 14,
  },
  registerLink: {
    color: '#1F7A3A',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
