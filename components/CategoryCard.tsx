import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type Category = {
  id: string;
  name: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
  iconColor: string;
};

type CategoryCardProps = {
  category: Category;
  onPress?: () => void;
};

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: category.color,
          borderColor: category.iconColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name={category.icon} size={32} color={category.iconColor} />
      </View>
      <ThemedText style={styles.name} type="defaultSemiBold">
        {category.name}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 100,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    paddingVertical: 12,
  },
  iconContainer: {
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
  },
});
