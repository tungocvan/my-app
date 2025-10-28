import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosClient from '../api/axiosClient';
import { TAOBANGGIA } from '../data/url';
import { useSelector } from 'react-redux';

export default function LapBangGiaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product_ids = [] } = route.params || {}; // nhận từ màn trước
  const user = useSelector((state) => state.auth?.user); // nếu bạn có redux auth

  const [tenKhachHang, setTenKhachHang] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [maSo, setMaSo] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔹 Sinh mã số tự động
  useEffect(() => {
    const now = new Date();
    const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    setMaSo(`BG-${ymd}-${rand}`);
  }, []);

  const handleSubmit = async () => {
    if (!tenKhachHang.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên khách hàng.');
      return;
    }

    if (product_ids.length === 0) {
      Alert.alert('Thiếu sản phẩm', 'Bạn chưa chọn sản phẩm nào.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ma_so: maSo,
        ten_khach_hang: tenKhachHang,
        ghi_chu: ghiChu,
        product_ids: product_ids,
        user_id: user?.id || 1, // tạm thời nếu chưa có login
      };

      const res = await axiosClient.post(TAOBANGGIA, payload);
      const json = res.data;

      // ✅ Chuẩn hóa phản hồi từ server
      const isSuccess =
        json?.success === true ||
        (json?.message && json?.message.toLowerCase().includes('thành công'));

      if (isSuccess) {
        Alert.alert('Thành công', 'Đã tạo bảng báo giá!', [
          {
            text: 'OK',
            onPress: () => {
              // Quay về danh sách và trigger reload
              navigation.navigate('BanggiaListScreen', { refresh: true });
            },
          },
        ]);
      } else {
        console.log('Phản hồi server:', json);
        Alert.alert('Lỗi', json.message || 'Không thể tạo bảng báo giá.');
      }
    } catch (err) {
      console.error('Lỗi khi gửi dữ liệu:', err);
      Alert.alert('Lỗi kết nối', 'Không thể gửi dữ liệu lên server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Tạo bảng báo giá</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Mã số</Text>
        <TextInput
          value={maSo}
          editable={false}
          style={[styles.input, { backgroundColor: '#f2f2f2', color: '#555' }]}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tên khách hàng *</Text>
        <TextInput
          placeholder="Nhập tên khách hàng"
          value={tenKhachHang}
          onChangeText={setTenKhachHang}
          style={styles.input}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          placeholder="Ghi chú thêm..."
          value={ghiChu}
          onChangeText={setGhiChu}
          multiline
          numberOfLines={3}
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Tổng số sản phẩm đã chọn</Text>
        <Text style={styles.selected}>{product_ids.length} sản phẩm</Text>
      </View>

      <TouchableOpacity
        style={[styles.btnSubmit, loading && { opacity: 0.6 }]}
        disabled={loading}
        onPress={handleSubmit}
      >
        <Text style={styles.btnText}>{loading ? 'Đang tạo...' : 'Tạo bảng báo giá'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#007AFF',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  selected: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
  btnSubmit: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
