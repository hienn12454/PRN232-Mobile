import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ProfileSectionProps = {
  name: string;
  email: string;
  isLoyalCustomer?: boolean;
  avatarUri?: string;
};

export function ProfileSection({ name, email, isLoyalCustomer = true, avatarUri }: ProfileSectionProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: themeColors.headerBackground }]}
    >
      <View style={styles.profileContainer}>
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: '#E8F5E9' }]}>
              <MaterialIcons name="person" size={40} color={themeColors.headerBackground} />
            </View>
          )}
        </View>
        <View style={styles.infoContainer}>
          <ThemedText style={[styles.name, { color: '#FFFFFF' }]} type="defaultSemiBold">
            {name}
          </ThemedText>
          <ThemedText style={[styles.email, { color: '#FFFFFF' }]} type="default">
            {email}
          </ThemedText>
          {isLoyalCustomer && (
            <View style={styles.loyaltyContainer}>
              <MaterialIcons name="star" size={14} color="#FFB800" />
              <ThemedText style={[styles.loyaltyText, { color: '#FFFFFF' }]} type="default">
                Khách hàng thân thiết
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  loyaltyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  loyaltyText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
});
