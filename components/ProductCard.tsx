import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type Product = {
  id: string;
  name: string;
  image: any; // require() image hoặc URI
  rating: number;
  currentPrice: string;
  oldPrice: string;
  discount: number;
};

type ProductCardProps = {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
};

export function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: themeColors.card }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.image} resizeMode="cover" />
        <View style={[styles.discountBadge, { backgroundColor: themeColors.badgeDiscountBackground }]}>
          <ThemedText style={[styles.discountText, { color: themeColors.badgeDiscountText }]}>
            -{product.discount}%
          </ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.productName} type="defaultSemiBold" numberOfLines={2}>
          {product.name}
        </ThemedText>

        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={14} color="#FFB800" />
          <ThemedText style={styles.rating} type="default">
            {product.rating}
          </ThemedText>
        </View>

        <View style={styles.priceContainer}>
          <ThemedText style={[styles.currentPrice, { color: themeColors.price }]} type="defaultSemiBold">
            {product.currentPrice}
          </ThemedText>
          <ThemedText style={[styles.oldPrice, { color: themeColors.priceOld }]} type="default">
            {product.oldPrice}
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: themeColors.tint }]}
          onPress={onAddToCart}
          activeOpacity={0.7}
        >
          <MaterialIcons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    marginBottom: 6,
    minHeight: 36,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
});
