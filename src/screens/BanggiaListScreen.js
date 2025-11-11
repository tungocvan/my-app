import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import axiosClient from '../api/axiosClient';
import { BANGGIA_LIST } from '../data/url';
import { Ionicons } from '@expo/vector-icons';

export default function BanggiaListScreen({ navigation }) {
  // const navigation = useNavigation();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(BANGGIA_LIST);
      const json = res.data;
      if (json.success && Array.isArray(json.data)) {
        setList(json.data);
      } else {
        console.log('Không có dữ liệu hợp lệ:', json);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách báo giá:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchList();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const totalProducts = Array.isArray(item.product_ids) ? item.product_ids.length : 0;

    return (
      <TouchableOpacityBanggiaScreen
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('BanggiaScreen', { id: item.id })}
      >
        <View style={styles.info}>
          <Text style={styles.code}>{item.ma_so}</Text>
          <Text style={styles.name}>{item.ten_khach_hang}</Text>
          <Text style={styles.note} numberOfLines={1}>
            {item.ghi_chu || 'Không có ghi chú'}
          </Text>
          <Text style={styles.meta}>
            {totalProducts} sản phẩm • {new Date(item.created_at).toLocaleDateString('vi-VN')}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color="#888" />
      </TouchableOpacityBanggiaScreen>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải danh sách báo giá...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách bảng báo giá</Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('BanggiaScreen')}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addText}>Tạo mới</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
            Chưa có bảng báo giá nào.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#005FCC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addText: { color: '#fff', fontWeight: '600' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    elevation: 2,
    alignItems: 'center',
  },
  info: { flex: 1 },
  code: { fontWeight: '700', color: '#007AFF', fontSize: 15 },
  name: { fontSize: 15, color: '#222', marginVertical: 2 },
  note: { fontSize: 13, color: '#666' },
  meta: { fontSize: 12, color: '#888', marginTop: 4 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
