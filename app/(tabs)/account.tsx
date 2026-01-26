import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProfileSection } from '@/components/ProfileSection';
import { AccountHeader } from '@/components/AccountHeader';
import { AccountMenuItem } from '@/components/AccountMenuItem';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { user, signOut } = useAuth();

  // Helper function để yêu cầu đăng nhập
  const requireAuth = (action?: () => void) => {
    if (user) {
      // Đã đăng nhập, thực hiện action
      action?.();
    } else {
      // Chưa đăng nhập, hiển thị alert
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Bạn cần đăng nhập để sử dụng tính năng này',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Đăng nhập',
            onPress: () => router.push('/login'),
          },
        ]
      );
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Không redirect, để user ở lại tab account
            } catch (error: any) {
              Alert.alert('Lỗi', error.message || 'Đăng xuất thất bại');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
      {/* Header với 2 nút khi chưa đăng nhập */}
      {!user && (
        <AccountHeader
          showAuthButtons={true}
          onLoginPress={() => router.push('/login')}
          onRegisterPress={() => router.push('/register')}
        />
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section - chỉ hiển thị khi đã đăng nhập */}
        {user && (
          <ProfileSection
            name={user?.displayName || user?.email?.split('@')[0] || 'Người dùng'}
            email={user?.email || ''}
            avatarUri={user?.photoURL || undefined}
            isLoyalCustomer={true}
          />
        )}

        {/* Account Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionHeader, { color: themeColors.textSecondary }]} type="default">
            TÀI KHOẢN
          </ThemedText>
          <View style={styles.menuContainer}>
            <AccountMenuItem
              icon="shopping-bag"
              label="Đơn hàng của tôi"
              badge={3}
              onPress={() => requireAuth(() => console.log('My orders pressed'))}
            />
            <AccountMenuItem
              icon="location-on"
              label="Địa chỉ giao hàng"
              onPress={() => requireAuth(() => console.log('Delivery address pressed'))}
            />
            <AccountMenuItem
              icon="favorite"
              label="Yêu thích"
              onPress={() => requireAuth(() => console.log('Favorites pressed'))}
            />
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionHeader, { color: themeColors.textSecondary }]} type="default">
            CÀI ĐẶT
          </ThemedText>
          <View style={styles.menuContainer}>
            <AccountMenuItem
              icon="notifications"
              label="Thông báo"
              onPress={() => requireAuth(() => console.log('Notifications pressed'))}
            />
            <AccountMenuItem
              icon="settings"
              label="Cài đặt"
              onPress={() => requireAuth(() => console.log('Settings pressed'))}
            />
            <AccountMenuItem
              icon="help-outline"
              label="Trợ giúp & Hỗ trợ"
              onPress={() => requireAuth(() => console.log('Help & Support pressed'))}
            />
          </View>
        </View>

        {/* Logout Button - chỉ hiển thị khi đã đăng nhập */}
        {user && (
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: '#E57373' }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <MaterialIcons name="logout" size={20} color="#E57373" />
            <ThemedText style={[styles.logoutText, { color: '#E57373' }]} type="defaultSemiBold">
              Đăng xuất
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* Version */}
        <ThemedText style={[styles.version, { color: themeColors.textSecondary }]} type="default">
          Phiên bản 1.0.0
        </ThemedText>

        {/* Bottom padding để không bị che bởi tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginTop: 8,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E57373',
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
