import { Tabs } from 'expo-router';
import React, { useCallback, useMemo } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const screenOptions = useMemo(() => ({
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false,
    tabBarButton: HapticTab,
    // Performance optimizations
    lazy: true,
    tabBarHideOnKeyboard: true,
  }), [colorScheme]);

  const homeIcon = useCallback(({ color }: { color: string }) => (
    <IconSymbol size={28} name="house.fill" color={color} />
  ), []);

  const exploreIcon = useCallback(({ color }: { color: string }) => (
    <IconSymbol size={28} name="paperplane.fill" color={color} />
  ), []);

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: homeIcon,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: exploreIcon,
        }}
      />
    </Tabs>
  );
}
