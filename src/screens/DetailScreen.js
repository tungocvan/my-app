import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // 📦 Dữ liệu nhận từ HomeScreen (nếu có)
  const { item } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết sản phẩm</Text>

      {item ? (
        <View style={styles.card}>
          <Text style={styles.label}>Tên sản phẩm:</Text>
          <Text style={styles.value}>{item.name}</Text>

          <Text style={styles.label}>Mô tả:</Text>
          <Text style={styles.value}>{item.description || 'Không có mô tả.'}</Text>

          <Text style={styles.label}>Giá:</Text>
          <Text style={styles.price}>{item.price ? `${item.price} đ` : 'N/A'}</Text>
        </View>
      ) : (
        <Text style={styles.noData}>Không có dữ liệu sản phẩm.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>⬅ Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 20,
  },
  label: {
    color: '#6B7280',
    fontSize: 15,
    marginTop: 10,
  },
  value: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
  },
  price: {
    color: '#16A34A',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 6,
  },
  noData: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 40,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default DetailScreen;
