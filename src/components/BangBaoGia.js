import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { MEDICINES, BASE_URL_IMG, TAO_BANG_GIA } from '../data/url';
import axiosClient from '../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import SearchInput from './SearchInput';

export default function BangBaoGia({ navigation }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  // MODAL
  const [modalVisible, setModalVisible] = useState(false);
  const [tenKhachHang, setTenKhachHang] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [tieuDe, setTieuDe] = useState('');
  const [nguoiDuyet, setNguoiDuyet] = useState('');

  const commonFields = {
    fields: ['id', 'ten_biet_duoc', 'don_gia', 'don_vi_tinh', 'quy_cach_dong_goi', 'link_hinh_anh'],
  };

  // 🔹 Load danh sách thuốc
  const fetchMedicines = async () => {
    try {
      const response = await axiosClient.post(MEDICINES, commonFields);
      const json = response.data;

      if (json.success && Array.isArray(json.data)) {
        setMedicines(json.data);
      }
    } catch (error) {
      console.error('Lỗi API:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // 🔹 Tìm kiếm
  const fetchMedicinesByKeyword = async (keyword) => {
    try {
      const response = await axiosClient.post(MEDICINES, {
        ...commonFields,
        search: keyword,
      });

      const json = response.data;
      if (json.success && Array.isArray(json.data)) {
        setMedicines(json.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Toggle chọn sản phẩm
  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  // 🔹 Gọi API TẠO BẢNG GIÁ
  const handleCreateBangGia = async () => {
    if (!tenKhachHang || !tieuDe) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ tiêu đề & tên khách hàng');
      return;
    }

    try {
      const payload = {
        user_id: 1,
        product_ids: selectedItems,
        ten_khach_hang: tenKhachHang,
        ghi_chu: ghiChu,
        company: [
          {
            title: tieuDe,
            date: new Date().toLocaleDateString('vi-VN'),
            departments: nguoiDuyet,
          },
        ],
      };

      const response = await axiosClient.post(TAO_BANG_GIA, payload);
      console.log('Kết quả:', response.data);

      Alert.alert('Thành công', '✅ Bảng báo giá đã được tạo!');
      setModalVisible(false);
      setSelectedItems([]);
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Không thể tạo bảng giá!');
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => toggleSelect(item.id)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: BASE_URL_IMG + '/' + item.link_hinh_anh }} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {item.ten_biet_duoc}
          </Text>

          <Text style={styles.price}>
            {item.don_gia ? `${item.don_gia.toLocaleString('vi-VN')} ₫` : 'Chưa có giá'}
          </Text>

          {item.don_vi_tinh && <Text style={styles.unit}>{item.don_vi_tinh}</Text>}
        </View>

        <Ionicons
          name={isSelected ? 'checkbox-outline' : 'square-outline'}
          size={26}
          color={isSelected ? '#007AFF' : '#ccc'}
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải danh sách thuốc...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Ô tìm kiếm */}
      <SearchInput
        placeholder="Tìm tên thuốc..."
        onSearch={(text) => {
          if (text.length >= 3) fetchMedicinesByKeyword(text);
          else if (text === '') fetchMedicines();
        }}
      />

      {/* Danh sách */}
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Đã chọn: <Text style={{ fontWeight: 'bold' }}>{selectedItems.length}</Text>
        </Text>

        <TouchableOpacity
          style={[styles.btnCreate, selectedItems.length === 0 && { opacity: 0.5 }]}
          disabled={selectedItems.length === 0}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnText}>Tạo bảng giá</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ MODAL NHẬP THÔNG TIN */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Tạo bảng báo giá</Text>

            <TextInput
              style={styles.input}
              placeholder="Tiêu đề bảng giá"
              value={tieuDe}
              onChangeText={setTieuDe}
            />

            <TextInput
              style={styles.input}
              placeholder="Tên khách hàng"
              value={tenKhachHang}
              onChangeText={setTenKhachHang}
            />

            <TextInput
              style={styles.input}
              placeholder="Người duyệt"
              value={nguoiDuyet}
              onChangeText={setNguoiDuyet}
            />

            <TextInput
              style={[styles.input, { height: 70 }]}
              placeholder="Ghi chú"
              multiline
              value={ghiChu}
              onChangeText={setGhiChu}
            />

            {/* Nút */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnSubmit} onPress={handleCreateBangGia}>
                <Text style={styles.submitText}>Tạo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 10, paddingBottom: 100 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 6,
    padding: 10,
    elevation: 2,
  },

  cardSelected: {
    borderWidth: 1.5,
    borderColor: '#007AFF',
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },

  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: '#222' },
  price: { fontSize: 15, fontWeight: 'bold', color: '#007AFF', marginTop: 4 },
  unit: { fontSize: 13, color: '#666' },

  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },

  footerText: { fontSize: 15, color: '#333' },

  btnCreate: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  btnText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  /* ✅ MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

  input: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },

  btnCancel: { padding: 10, marginRight: 10 },
  cancelText: { color: '#888' },

  btnSubmit: {
    backgroundColor: '#007AFF',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  submitText: { color: '#fff', fontWeight: '600' },
});
