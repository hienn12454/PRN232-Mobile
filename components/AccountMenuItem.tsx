import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AccountMenuItemProps = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  onPress?: () => void;
  badge?: number;
};

export function AccountMenuItem({ icon, label, onPress, badge }: AccountMenuItemProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: themeColors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContainer}>
        <MaterialIcons name={icon} size={24} color={themeColors.icon} />
        <ThemedText style={[styles.label, { color: themeColors.text }]} type="default">
          {label}
        </ThemedText>
      </View>
      <View style={styles.rightContainer}>
        {badge !== undefined && badge > 0 && (
          <View style={[styles.badge, { backgroundColor: themeColors.tint }]}>
            <ThemedText style={styles.badgeText} type="default">
              {badge}
            </ThemedText>
          </View>
        )}
        <MaterialIcons name="chevron-right" size={24} color={themeColors.icon} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 1,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  label: {
    fontSize: 16,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
