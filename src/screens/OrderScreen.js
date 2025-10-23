import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { ORDERS } from '../data/url';

const OrderScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bộ lọc
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Gọi API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.post(ORDERS);
      const data = response.data.data || [];
      // console.log(data[0]);
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 Chuyển dd/mm/yyyy -> Date object
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}T00:00:00`);
  };

  // 🔹 Lọc danh sách dựa trên trạng thái và ngày
  const applyFilters = (status = statusFilter, from = fromDate, to = toDate) => {
    let result = [...orders];

    // Lọc trạng thái
    if (status) result = result.filter((o) => o.status === status);

    // Lọc ngày
    if (from || to) {
      let start = from ? parseDate(from) : null;
      let end = to ? parseDate(to) : null;

      if (from && !to) end = start;
      if (!from && to) start = end;

      if (end) end.setHours(23, 59, 59, 999);

      result = result.filter((o) => {
        const d = new Date(o.created_at);
        return (!start || d >= start) && (!end || d <= end);
      });
    }

    setFilteredOrders(result);
  };

  // 🔹 Khi click chọn trạng thái
  const handleStatusChange = (value) => {
    const newStatus = value === statusFilter ? '' : value;
    setStatusFilter(newStatus);
    applyFilters(newStatus, fromDate, toDate);
  };

  // 🔹 Khi nhấn Tìm kiếm ngày
  const handleSearch = () => {
    applyFilters(statusFilter, fromDate, toDate);
  };

  const resetFilters = () => {
    setStatusFilter('');
    setFromDate('');
    setToDate('');
    setFilteredOrders(orders);
  };

  // Hàm format tự động
  const formatDateInput = (text) => {
    let digits = text.replace(/\D/g, '');

    if (digits.length > 2) digits = digits.slice(0, 2) + '/' + digits.slice(2);
    if (digits.length > 4) digits = digits.slice(0, 5) + '/' + digits.slice(5, 9); // dd/mm/yyyy max 4 chữ số năm
    if (digits.length > 10) digits = digits.slice(0, 10); // hạn chế max 10 ký tự

    return digits;
  };

  // Render item
  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('OrderDetailScreen', { order: item })}
    >
      <View style={styles.row}>
        <Ionicons name="receipt-outline" size={22} color="#007AFF" />
        <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
      </View>

      <Text style={styles.email}>{item.user.name}</Text>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Tổng tiền:</Text>
        <Text style={styles.total}>{parseInt(item.total).toLocaleString('vi-VN')} ₫</Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Trạng thái:</Text>
        <Text
          style={[
            styles.status,
            item.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending,
          ]}
        >
          {item.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xử lý'}
        </Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Ngày đặt:</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleString('vi-VN')}</Text>
      </View>
    </TouchableOpacity>
  );

  // Loading
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải đơn hàng...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={{ color: 'white' }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );

  // UI hiển thị danh sách
  return (
    <View style={styles.container}>
      {/* Bộ lọc trạng thái */}
      <View style={styles.filterRow}>
        {['pending', 'confirmed'].map((st) => (
          <TouchableOpacity
            key={st}
            style={[styles.filterButton, statusFilter === st && styles.filterButtonActive]}
            onPress={() => handleStatusChange(st)}
          >
            <Text style={[styles.filterText, statusFilter === st && styles.filterTextActive]}>
              {st === 'pending' ? 'Chờ xử lý' : 'Đã xác nhận'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bộ lọc ngày */}
      <View style={styles.dateFilter}>
        <View style={styles.inputGroup}>
          <Text style={styles.labelSmall}>Từ ngày:</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={fromDate}
              onChangeText={(text) => setFromDate(formatDateInput(text))}
              placeholder="dd/mm/yyyy"
              keyboardType="number-pad"
              style={styles.input}
            />
            {fromDate ? (
              <TouchableOpacity onPress={() => setFromDate('')}>
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.labelSmall}>Đến ngày:</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={toDate}
              onChangeText={(text) => setToDate(formatDateInput(text))}
              placeholder="dd/mm/yyyy"
              keyboardType="number-pad"
              style={styles.input}
            />
            {toDate ? (
              <TouchableOpacity onPress={() => setToDate('')}>
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Reset */}
      <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
        <Ionicons name="refresh" size={18} color="#007AFF" />
        <Text style={{ marginLeft: 4, color: '#007AFF' }}>Làm mới</Text>
      </TouchableOpacity>

      {/* Danh sách */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    padding: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#333',
  },
  filterTextActive: {
    color: '#fff',
  },
  dateFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    height: 36,
  },
  labelSmall: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 14,
    marginHorizontal: 5,
  },
  resetButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    marginLeft: 6,
    fontWeight: '600',
    color: '#007AFF',
  },
  email: {
    color: '#444',
    fontSize: 13,
    marginBottom: 4,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#555',
  },
  total: {
    fontWeight: 'bold',
  },
  status: {
    fontWeight: '600',
  },
  statusPending: {
    color: '#ff9500',
  },
  statusConfirmed: {
    color: '#34C759',
  },
  date: {
    color: '#777',
  },
  detailBox: {
    marginTop: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});
