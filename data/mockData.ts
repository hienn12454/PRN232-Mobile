import { Category } from '@/components/CategoryCard';
import { Product } from '@/components/ProductCard';

// Mock images - bạn có thể thay thế bằng ảnh thật sau
const placeholderImage = require('@/assets/images/icon.png');

export const categories: Category[] = [
  {
    id: '1',
    name: 'Trái Cây',
    icon: 'local-grocery-store',
    color: '#E8F5E9',
    iconColor: '#2E7D32',
  },
  {
    id: '2',
    name: 'Thịt',
    icon: 'restaurant',
    color: '#FCE4EC',
    iconColor: '#C2185B',
  },
  {
    id: '3',
    name: 'Sữa',
    icon: 'local-drink',
    color: '#E3F2FD',
    iconColor: '#1976D2',
  },
  {
    id: '4',
    name: 'Rau Củ',
    icon: 'eco',
    color: '#E8F5E9',
    iconColor: '#2E7D32',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Thanh Long Ruột Đỏ',
    image: placeholderImage,
    rating: 4.8,
    currentPrice: '29.750đ/kg',
    oldPrice: '35.000₫',
    discount: 15,
  },
  {
    id: '2',
    name: 'Nhãn Lồng Hưng Yên',
    image: placeholderImage,
    rating: 4.7,
    currentPrice: '37.800đ/kg',
    oldPrice: '42.000₫',
    discount: 10,
  },
  {
    id: '3',
    name: 'Trái Cây Sấy Khô',
    image: placeholderImage,
    rating: 4.6,
    currentPrice: '45.000đ/túi',
    oldPrice: '56.000₫',
    discount: 20,
  },
];
