import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axiosClient from '../api/axiosClient';
import { LinearGradient } from 'expo-linear-gradient';
import { MEDICINES } from '../data/url';
import ProductGrid from '../components/ProductGrid'; // đường dẫn bạn đổi cho đúng

export default function ProductScreen({ offSearch = true, params }) {
  const route = useRoute();

  const { slug, name } = route.params || params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchProducts();
    }
  }, [slug]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.post(MEDICINES, { slug });

      if (res?.data?.success) {
        // Giữ nguyên toàn bộ dữ liệu sản phẩm trả về
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error('Lỗi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <LinearGradient
        colors={['#a8edea', '#fed6e3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.titleBadge}
      >
        <Text style={styles.title}>{name}</Text>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#4ADE80" style={{ marginTop: 40 }} />
      ) : (
        <ProductGrid productsData={products} offSearch={offSearch} />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  titleBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 5,
    marginLeft: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
