import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { MEDICINES, BASE_URL_IMG } from '../data/url';
import axiosClient from '../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import SearchInput from './SearchInput';

export default function BangBaoGia({ navigation }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  const commonFields = {
    fields: ['id', 'ten_biet_duoc', 'don_gia', 'don_vi_tinh', 'quy_cach_dong_goi', 'link_hinh_anh'],
  };

  // 🔹 Lấy danh sách thuốc
  const fetchMedicines = async () => {
    try {
      const response = await axiosClient.post(MEDICINES, commonFields);
      const json = response.data;
      if (json.success && Array.isArray(json.data)) {
        setMedicines(json.data);
      }
    } catch (error) {
      console.error('Lỗi gọi API:', error);
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
      console.error('Lỗi tìm kiếm:', error);
    }
  };

  // 🔹 Tick chọn / bỏ chọn sản phẩm
  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
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
        placeholder="Tìm tên thuốc, hoạt chất..."
        onSearch={(text) => {
          if (text.length >= 3) {
            fetchMedicinesByKeyword(text);
          } else if (text === '') {
            fetchMedicines();
          }
        }}
      />

      {/* Danh sách sản phẩm */}
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Thanh hành động */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Đã chọn: <Text style={{ fontWeight: 'bold' }}>{selectedItems.length}</Text> sản phẩm
        </Text>

        <TouchableOpacity
          style={[styles.btnCreate, selectedItems.length === 0 && { opacity: 0.6 }]}
          disabled={selectedItems.length === 0}
          onPress={() => {
            navigation.navigate('LapbanggiaScreen', { product_ids: selectedItems });
          }}
        >
          <Text style={styles.btnText}>Tạo bảng báo giá</Text>
        </TouchableOpacity>
      </View>
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
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '600', color: '#222' },
  price: { fontSize: 15, fontWeight: 'bold', color: '#007AFF', marginTop: 4 },
  unit: { fontSize: 13, color: '#666', marginTop: 2 },
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
});
