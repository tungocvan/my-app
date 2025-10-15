// screens/SearchScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProductGrid } from '../components/ProductGrid'; // đường dẫn tùy dự án

const SearchScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 16 }}>Search</Text>
      <ProductGrid />
    </View>
  );
};

export default SearchScreen;
