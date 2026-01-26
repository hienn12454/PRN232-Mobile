import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AccountHeaderProps = {
  showAuthButtons?: boolean;
  onLoginPress?: () => void;
  onRegisterPress?: () => void;
};

export function AccountHeader({ showAuthButtons = false, onLoginPress, onRegisterPress }: AccountHeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeColors.headerBackground }]}>
      <View style={styles.content}>
        {showAuthButtons ? (
          <View style={styles.authButtonsContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={onLoginPress || (() => {})}
              activeOpacity={0.7}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <View style={styles.buttonSpacer} />
            <TouchableOpacity
              style={styles.registerButton}
              onPress={onRegisterPress || (() => {})}
              activeOpacity={0.7}
            >
              <Text style={[styles.registerButtonText, { color: themeColors.headerBackground }]}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ThemedText style={[styles.title, { color: '#FFFFFF' }]} type="defaultSemiBold">
            Tài khoản
          </ThemedText>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  authButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  loginButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSpacer: {
    width: 12,
  },
});
