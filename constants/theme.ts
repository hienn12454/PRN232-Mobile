/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Màu chủ đạo cho app Nông Sản Tươi
const primaryGreenLight = '#2E7D32';
const primaryGreenDark = '#66BB6A';

export const Colors = {
  light: {
    text: '#1B1B1B',
    textSecondary: '#6C6C6C',
    background: '#F4F8F4',
    card: '#FFFFFF',
    headerBackground: primaryGreenLight,
    searchBackground: '#FFFFFF',
    categoryBackground: '#E9F5EC',
    badgeDiscountBackground: '#FFE5E5',
    badgeDiscountText: '#E53935',
    price: '#1B1B1B',
    priceOld: '#9E9E9E',
    tint: primaryGreenLight,
    icon: '#8A8A8A',
    tabIconDefault: '#8A8A8A',
    tabIconSelected: primaryGreenLight,
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#C4C4C4',
    background: '#101512',
    card: '#1B231D',
    headerBackground: primaryGreenDark,
    searchBackground: '#1E2720',
    categoryBackground: '#223027',
    badgeDiscountBackground: '#3B1E1E',
    badgeDiscountText: '#FF8A80',
    price: '#FFFFFF',
    priceOld: '#9E9E9E',
    tint: primaryGreenDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryGreenDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
