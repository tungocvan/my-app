import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { BASE_URL_IMG } from '../data/url';

export default function MedicineDetailScreen({ route }) {
  const { medicine } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: BASE_URL_IMG + '/' + medicine.link_hinh_anh }} style={styles.image} />

      <Text style={styles.name}>{medicine.ten_biet_duoc}</Text>
      <Text style={styles.price}>
        {medicine.don_gia ? `${medicine.don_gia.toLocaleString('vi-VN')} ₫` : 'Chưa có giá'}
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Hoạt chất:</Text>
        <Text style={styles.value}>{medicine.ten_hoat_chat}</Text>

        <Text style={styles.label}>Hàm lượng:</Text>
        <Text style={styles.value}>{medicine.nong_do_ham_luong}</Text>

        <Text style={styles.label}>Dạng bào chế:</Text>
        <Text style={styles.value}>{medicine.dang_bao_che}</Text>

        <Text style={styles.label}>Đường dùng:</Text>
        <Text style={styles.value}>{medicine.duong_dung}</Text>

        <Text style={styles.label}>Cơ sở sản xuất:</Text>
        <Text style={styles.value}>{medicine.co_so_san_xuat}</Text>

        <Text style={styles.label}>Nước sản xuất:</Text>
        <Text style={styles.value}>{medicine.nuoc_san_xuat}</Text>

        <Text style={styles.label}>Hạn dùng:</Text>
        <Text style={styles.value}>{medicine.han_dung}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    color: '#333',
  },
  price: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoBox: { marginTop: 10 },
  label: { fontWeight: '600', marginTop: 8, color: '#555' },
  value: { color: '#222', fontSize: 14 },
});
