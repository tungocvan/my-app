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
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import SearchInput from '../components/SearchInput';
import axiosClient from '../api/axiosClient';

export default function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const commonFields = {
    fields: ['id', 'ten_biet_duoc', 'don_gia', 'don_vi_tinh', 'quy_cach_dong_goi', 'link_hinh_anh'],
  };

  // 🔹 Gọi danh sách thuốc
  const fetchMedicines = async () => {
    try {
      const response = await axiosClient.post(MEDICINES, commonFields);
      const json = response.data;

      if (json.success && Array.isArray(json.data)) {
        setMedicines(json.data);
      } else {
        console.log('Không có dữ liệu hợp lệ');
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

  const handleAdd = (item) => {
    dispatch(
      addToCart({
        id: item.id,
        title: item.ten_biet_duoc,
        price: item.don_gia || 0,
        dvt: item.don_vi_tinh,
        quycach: item.quy_cach_dong_goi,
        image: item.link_hinh_anh,
        quantity: 1,
      }),
    );
  };

  const handleRemove = (item) => {
    const existing = cartItems.find((p) => p.id === item.id);
    if (existing && existing.quantity > 1) {
      dispatch(
        addToCart({
          id: item.id,
          title: item.ten_biet_duoc,
          price: item.don_gia || 0,
          dvt: item.don_vi_tinh,
          image: item.link_hinh_anh,
          quantity: -1,
        }),
      );
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

  // 🔹 Tìm kiếm thuốc
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

  const renderItem = ({ item }) => {
    const existing = cartItems.find((p) => p.id === item.id);
    const quantity = existing ? existing.quantity : 0;

    return (
      <View style={styles.card}>
        <Image source={{ uri: BASE_URL_IMG + '/' + item.link_hinh_anh }} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {item.ten_biet_duoc}
          </Text>

          <Text style={styles.price}>
            {item.don_gia ? `${item.don_gia.toLocaleString('vi-VN')} ₫` : 'Chưa có giá'}
          </Text>

          {item.don_vi_tinh && <Text style={styles.unit}>{item.don_vi_tinh}</Text>}

          <TouchableOpacity
            style={styles.detailBtn}
            onPress={() => navigation.navigate('MedicineDetail', { medicine_id: item.id })}
          >
            <Text style={styles.detailText}>Chi tiết</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, quantity === 0 && { opacity: 0.5 }]}
            disabled={quantity === 0}
            onPress={() => handleRemove(item)}
          >
            <Text style={styles.btnText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qty}>{quantity}</Text>

          <TouchableOpacity style={styles.btn} onPress={() => handleAdd(item)}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải dữ liệu thuốc...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SearchInput
        placeholder="Tìm tên thuốc, hoạt chất..."
        onSearch={(text) => {
          if (text.length >= 3) {
            fetchMedicinesByKeyword(text);
          } else if (text === '') {
            fetchMedicines(); // reset khi xoá tìm kiếm
          }
        }}
      />

      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 6,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  info: { flex: 1, justifyContent: 'center' },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  price: { fontSize: 15, fontWeight: 'bold', color: '#007AFF' },
  unit: { fontSize: 13, color: '#666', marginTop: 2 },
  detailBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 6,
  },
  detailText: { fontSize: 13, color: '#007AFF', fontWeight: '600' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    backgroundColor: '#007AFF',
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 18, lineHeight: 20 },
  qty: { marginHorizontal: 8, fontSize: 16, fontWeight: '600' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
