// screens/SearchScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProductGrid } from '../components/ProductGrid'; // đường dẫn tùy dự án

const SearchScreen = () => {
  const navigation = useNavigation();
  const products = [
    {
      id: '1',
      title: 'Áo Thun Nam Trắng',
      regular_price: 200000,
      sale_price: 150000,
      image: 'images/default.jpg',
    },
    {
      id: '2',
      title: 'Giày Thể Thao Nữ',
      regular_price: 500000,
      sale_price: 500000,
      image: 'images/default.jpg',
    },
    {
      id: '3',
      title: 'Balo Du Lịch',
      regular_price: 350000,
      sale_price: 300000,
      image: 'images/default.jpg',
    },
    {
      id: '4',
      title: 'Đồng Hồ Nam',
      regular_price: 800000,
      sale_price: 650000,
      image: 'images/default.jpg',
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 16 }}>Search</Text>
      <ProductGrid productsData={products} />
    </View>
  );
};

export default SearchScreen;
