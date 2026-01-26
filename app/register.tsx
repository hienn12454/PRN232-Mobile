import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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

export default function RegisterScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { signUpWithEmail } = useAuth();
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

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUpWithEmail(formData.email, formData.password, formData.fullName);
      Alert.alert('Thành công', 'Đăng ký thành công!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Lỗi đăng ký', error.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
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
              <Text style={styles.subtitle}>Tạo tài khoản mới</Text>
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
                label="Họ và tên"
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                placeholder="Nguyễn Văn A"
                icon="person"
                autoCapitalize="words"
                error={errors.fullName}
                required
                labelColor={inputColors.label}
                placeholderColor={inputColors.placeholder}
                textColor={inputColors.text}
              />

              <Input
                label="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="example@email.com"
                icon="mail"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                required
                labelColor={inputColors.label}
                placeholderColor={inputColors.placeholder}
                textColor={inputColors.text}
              />

              <Input
                label="Số điện thoại"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="0912345678"
                icon="phone"
                keyboardType="phone-pad"
                error={errors.phone}
                required
                labelColor={inputColors.label}
                placeholderColor={inputColors.placeholder}
                textColor={inputColors.text}
              />

              <Input
                label="Mật khẩu"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                placeholder="••••••••"
                icon="lock"
                secureTextEntry
                error={errors.password}
                required
                labelColor={inputColors.label}
                placeholderColor={inputColors.placeholder}
                textColor={inputColors.text}
              />

              <Input
                label="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                placeholder="••••••••"
                icon="lock"
                secureTextEntry
                error={errors.confirmPassword}
                required
                labelColor={inputColors.label}
                placeholderColor={inputColors.placeholder}
                textColor={inputColors.text}
              />

              <Button
                title="Đăng ký"
                onPress={handleRegister}
                loading={loading}
                style={styles.registerButton}
              />

              {/* Terms and Privacy */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  Bằng việc đăng ký, bạn đồng ý với{' '}
                  <Text style={styles.termsLink}>Điều khoản sử dụng</Text> và{' '}
                  <Text style={styles.termsLink}>Chính sách bảo mật</Text>
                </Text>
              </View>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.loginLink}>Đăng nhập ngay</Text>
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
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 18,
    shadowColor: '#2D7036',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  termsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: '#6D7F71',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#1F7A3A',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#6D7F71',
    fontSize: 14,
  },
  loginLink: {
    color: '#1F7A3A',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
