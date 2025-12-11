import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axiosClient from '../api/axiosClient';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { ORDERS } from '../data/url';

const STATUS_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xử lý' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'cancelled', label: 'Đã hủy' },
];

const OrderScreen = () => {
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState(null);

  const showPicker = (type) => {
    setPickerType(type);
    setPickerVisible(true);
  };

  const handleConfirm = (date) => {
    const formatted = date.toLocaleDateString('vi-VN');
    pickerType === 'from' ? setFromDate(formatted) : setToDate(formatted);
    setPickerVisible(false);
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}T00:00:00`);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      //const filterUser = user && user.is_admin == 0 ? { is_admin: user.is_admin, email: user.email } : {};
      const filterUser = user ? { email: user.email } : {};

      const response = await axiosClient.post(ORDERS, filterUser);
      const data = response.data.data || [];
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Gọi hàm async trong IIFE để tránh return Promise
      (async () => {
        await fetchOrders();
      })();
    }, []),
  );

  const applyFilters = useCallback(() => {
    let result = [...orders];

    if (statusFilter && statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (fromDate || toDate) {
      const start = fromDate ? parseDate(fromDate) : null;
      const end = toDate ? parseDate(toDate) : null;
      const adjustedEnd = end ? new Date(end.setHours(23, 59, 59, 999)) : null;

      result = result.filter((o) => {
        const d = new Date(o.created_at);
        return (!start || d >= start) && (!adjustedEnd || d <= adjustedEnd);
      });
    }

    setFilteredOrders(result);
  }, [orders, statusFilter, fromDate, toDate]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setStatusFilter('');
    setFromDate('');
    setToDate('');
    setFilteredOrders(orders);
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('OrderDetailScreen', { order: item })}
    >
      <View style={styles.row}>
        <Ionicons name="receipt-outline" size={22} color="#007AFF" />
        <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
      </View>

      <Text style={styles.email}>{item.user?.name}</Text>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Tổng tiền:</Text>
        <Text style={styles.total}>{parseInt(item.total).toLocaleString('vi-VN')} ₫</Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Trạng thái:</Text>
        <Text
          style={[
            styles.status,
            item.status === 'confirmed'
              ? styles.statusConfirmed
              : item.status === 'cancelled'
                ? styles.statusCancelled
                : styles.statusPending,
          ]}
        >
          {item.status === 'confirmed'
            ? 'Đã xác nhận'
            : item.status === 'cancelled'
              ? 'Đã hủy'
              : 'Chờ xử lý'}
        </Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Ngày đặt:</Text>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleString('vi-VN')}</Text>
      </View>
    </TouchableOpacity>
  );

  if (error)
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color="red" />
        <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>

        <TouchableOpacity
          style={[styles.retryButton, loading && { opacity: 0.7 }]}
          onPress={fetchOrders}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: 'white' }}>Thử lại</Text>
          )}
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      {loading && orders.length > 0 && (
        <View style={{ alignItems: 'center', marginVertical: 8 }}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={{ fontSize: 12, color: '#555' }}>Đang làm mới...</Text>
        </View>
      )}

      {/* Bộ lọc trạng thái */}
      <View style={styles.filterRow}>
        {STATUS_OPTIONS.map((btn) => (
          <TouchableOpacity
            key={btn.key}
            style={[styles.filterButton, statusFilter === btn.key && styles.filterButtonActive]}
            onPress={() => setStatusFilter((prev) => (prev === btn.key ? '' : btn.key))}
          >
            <Text style={[styles.filterText, statusFilter === btn.key && styles.filterTextActive]}>
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bộ lọc ngày */}
      <View style={styles.dateFilter}>
        {['from', 'to'].map((type) => (
          <View style={styles.inputGroup} key={type}>
            <Text style={styles.labelSmall}>{type === 'from' ? 'Từ ngày:' : 'Đến ngày:'}</Text>
            <TouchableOpacity style={styles.datePicker} onPress={() => showPicker(type)}>
              <Ionicons name="calendar-outline" size={18} color="#007AFF" />
              <Text style={styles.dateText}>
                {(type === 'from' ? fromDate : toDate) || 'Chọn ngày'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.searchButton} onPress={applyFilters}>
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        display="spinner"
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
        locale="vi-VN"
        style={{ justifyContent: 'center', alignItems: 'center' }} // 👈 canh giữa modal
        pickerContainerStyleIOS={{ alignItems: 'center' }} // cho iOS
      />

      <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
        <Ionicons name="refresh" size={18} color="#007AFF" />
        <Text style={{ marginLeft: 4, color: '#007AFF' }}>Làm mới</Text>
      </TouchableOpacity>

      {orders.length === 0 && !loading ? (
        <View style={styles.center}>
          <Text>Không có đơn hàng nào.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
          refreshing={loading}
          onRefresh={fetchOrders}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB', padding: 12 },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    margin: 4,
  },
  filterButtonActive: { backgroundColor: '#007AFF' },
  filterText: { color: '#333', fontSize: 13 },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  dateFilter: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  inputGroup: { flex: 1, marginHorizontal: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: { flex: 1, height: 36 },
  labelSmall: { fontSize: 12, color: '#555', marginBottom: 4 },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    marginTop: 14,
    marginHorizontal: 5,
  },
  resetButton: { flexDirection: 'row', alignSelf: 'center', marginVertical: 6 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  orderId: { marginLeft: 6, fontWeight: '600', color: '#007AFF' },
  email: { color: '#444', fontSize: 13, marginBottom: 4 },
  orderInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#555' },
  total: { fontWeight: 'bold' },
  status: { fontWeight: '600' },
  statusPending: { color: '#ff9500' },
  statusConfirmed: { color: '#34C759' },
  statusCancelled: { color: '#FF3B30', fontWeight: '700' },
  date: { color: '#777' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  retryButton: {
    marginTop: 14,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
  },
  dateText: {
    marginLeft: 8,
    color: '#333',
    fontSize: 13,
  },
});
