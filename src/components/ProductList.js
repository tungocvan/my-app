import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import axiosClient from '../api/axiosClient';
import { PRODUCTS, BASE_URL } from '../data/url';
import { IMG_PRODUCT_DEFAULT } from '../constants';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      // ✅ Gọi API bằng POST, truyền tham số cần thiết
      const params = {
        order_by: 'created_at',
        sort: 'desc',
        paginate: 20,
        fields: ['id', 'title', 'regular_price', 'sale_price', 'image'], // 👈 backend có thể dùng nếu bạn hỗ trợ chọn field
      };

      const response = await axiosClient.post(PRODUCTS, params);

      // ✅ Mảng sản phẩm thực tế
      const items = response.data?.data?.data || [];

      console.log('📦 Tổng sản phẩm:', items.length);
      //console.log('📦 Tổng sản phẩm:', items[0]);
      setProducts(items);
    } catch (err) {
      console.log('❌ Lỗi khi load products:', err.response?.data || err.message);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    // ✅ Ghép URL ảnh chuẩn
    const imageUrl = (
      item.image?.startsWith('http') ? item.image : `${BASE_URL.replace('/api', '')}/${item.image}`
    ).trim();

    // ✅ Lấy giá hiển thị
    const price =
      item.sale_price && item.sale_price !== '0.00' ? item.sale_price : item.regular_price;

    return (
      <View style={styles.card}>
        <Image
          source={{
            uri: imageUrl || IMG_PRODUCT_DEFAULT,
          }}
          style={styles.image}
        />
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.price}>{parseInt(price).toLocaleString('vi-VN')} ₫</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  price: {
    fontSize: 15,
    fontWeight: '500',
    color: '#e11d48',
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default ProductList;
