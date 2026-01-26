import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function HomeHeader() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: themeColors.headerBackground }]}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="menu" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.centerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <MaterialIcons name="crop-square" size={20} color="#FFFFFF" />
            </View>
            <ThemedText 
              style={[styles.appName, { color: '#FFFFFF' }]} 
              type="defaultSemiBold"
            >
              Nông Sản Tươi
            </ThemedText>
          </View>
          <ThemedText 
            style={[styles.tagline, { color: '#E8F5E9' }]} 
            lightColor="#E8F5E9"
            darkColor="#E8F5E9"
          >
            Fresh from farm
          </ThemedText>
        </View>

        <TouchableOpacity style={styles.cartButton}>
          <MaterialIcons name="shopping-cart" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 12,
    marginTop: 2,
    color: '#E8F5E9',
  },
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
