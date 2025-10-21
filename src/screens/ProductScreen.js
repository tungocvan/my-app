import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ProductScreen() {
  const route = useRoute();
  const { slug } = route.params || {};

  useEffect(() => {
    if (slug) {
      // console.log('Slug nhận được:', slug);
      // Gọi API để load danh sách sản phẩm theo slug
    }
  }, [slug]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Danh mục: {slug}</Text>
    </View>
  );
}
