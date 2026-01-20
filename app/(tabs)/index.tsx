import { Image } from 'expo-image';
import React, { useCallback } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Product = {
  id: string;
  name: string;
  image: string;
};

const PRODUCTS: Product[] = [
  {
    id: 'SP001',
    name: 'Rau xà lách hữu cơ',
    image: 'https://images.pexels.com/photos/4051021/pexels-photo-4051021.jpeg',
  },
  {
    id: 'SP002',
    name: 'Cà chua bi Đà Lạt',
    image: 'https://images.pexels.com/photos/8390/food-wood-tomatoes.jpg',
  },
  {
    id: 'SP003',
    name: 'Khoai tây sạch',
    image: 'https://images.pexels.com/photos/4110473/pexels-photo-4110473.jpeg',
  },
  {
    id: 'SP004',
    name: 'Dưa leo hữu cơ',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
  },
];

// Memoized product card component
const ProductCard = React.memo(({ item }: { item: Product }) => (
  <View style={styles.card}>
    <Image
      source={{ uri: item.image }}
      style={styles.image}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      priority="high"
    />
    <View style={styles.cardBody}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.id}>Mã sản phẩm: {item.id}</Text>
    </View>
  </View>
));

ProductCard.displayName = 'ProductCard';

export default function HomeScreen() {
  const renderItem = useCallback(({ item }: { item: Product }) => (
    <ProductCard item={item} />
  ), []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 196, // height của card (160 + 36 padding)
      offset: 196 * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌱 Nông sản nổi bật</Text>
        <Text style={styles.subtitle}>Danh sách sản phẩm mẫu để bạn test UI</Text>
      </View>

      <FlatList
        data={PRODUCTS}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        initialNumToRender={4}
        windowSize={5}
        getItemLayout={getItemLayout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A3C2F',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  id: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
});
