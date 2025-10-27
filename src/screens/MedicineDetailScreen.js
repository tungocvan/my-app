import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { BASE_URL_IMG, MEDICINES } from '../data/url';
import axiosClient from '../api/axiosClient';

export default function MedicineDetailScreen({ route }) {
  const { medicine_id } = route.params;
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await axiosClient.post(MEDICINES, {
          id: medicine_id,
          fields: [
            'id',
            'ten_biet_duoc',
            'ten_hoat_chat',
            'nong_do_ham_luong',
            'dang_bao_che',
            'duong_dung',
            'co_so_san_xuat',
            'nuoc_san_xuat',
            'han_dung',
            'don_gia',
            'link_hinh_anh',
          ],
        });

        if (res.data?.success && res.data.data?.length > 0) {
          setMedicine(res.data.data[0]); // lấy record đầu tiên
        } else {
          console.log('Không tìm thấy thuốc');
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết thuốc:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [medicine_id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Đang tải thông tin thuốc...</Text>
      </View>
    );
  }

  if (!medicine) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy thông tin thuốc.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {medicine.link_hinh_anh ? (
        <Image source={{ uri: `${BASE_URL_IMG}/${medicine.link_hinh_anh}` }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={{ color: '#999' }}>Không có hình ảnh</Text>
        </View>
      )}

      <Text style={styles.name}>{medicine.ten_biet_duoc}</Text>
      <Text style={styles.price}>
        {medicine.don_gia ? `${medicine.don_gia.toLocaleString('vi-VN')} ₫` : 'Chưa có giá'}
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Hoạt chất:</Text>
        <Text style={styles.value}>{medicine.ten_hoat_chat || '-'}</Text>

        <Text style={styles.label}>Hàm lượng:</Text>
        <Text style={styles.value}>{medicine.nong_do_ham_luong || '-'}</Text>

        <Text style={styles.label}>Dạng bào chế:</Text>
        <Text style={styles.value}>{medicine.dang_bao_che || '-'}</Text>

        <Text style={styles.label}>Đường dùng:</Text>
        <Text style={styles.value}>{medicine.duong_dung || '-'}</Text>

        <Text style={styles.label}>Cơ sở sản xuất:</Text>
        <Text style={styles.value}>{medicine.co_so_san_xuat || '-'}</Text>

        <Text style={styles.label}>Nước sản xuất:</Text>
        <Text style={styles.value}>{medicine.nuoc_san_xuat || '-'}</Text>

        <Text style={styles.label}>Hạn dùng:</Text>
        <Text style={styles.value}>{medicine.han_dung || '-'}</Text>
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
  noImage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f4',
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
