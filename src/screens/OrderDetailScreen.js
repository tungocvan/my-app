import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BackButton = ({ color = '#007AFF', size = 24 }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{ paddingHorizontal: 10, paddingVertical: 5 }}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;

  // Trạng thái cho phép sửa
  const isEditable = order.status === 'pending';

  // State quản lý chi tiết sản phẩm
  const [details, setDetails] = useState(order.order_detail);

  // Cập nhật số lượng
  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;
    const newDetails = [...details];
    const pricePerUnit = newDetails[index].total / newDetails[index].quantity;
    newDetails[index].quantity = newQty;
    newDetails[index].total = pricePerUnit * newQty;
    setDetails(newDetails);
  };

  // Xóa sản phẩm
  const removeItem = (index) => {
    Alert.alert('Xóa sản phẩm', 'Bạn có chắc chắn muốn xóa sản phẩm này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          const newDetails = [...details];
          newDetails.splice(index, 1);
          setDetails(newDetails);
        },
      },
    ]);
  };

  // Tính tổng tiền
  const totalAmount = details.reduce((sum, item) => sum + parseInt(item.total), 0);

  // Render sản phẩm
  const renderDetailItem = ({ item, index }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailTitle}>{item.title}</Text>
      <Text style={styles.detailQty}>x{item.quantity}</Text>
      <Text style={styles.detailPrice}>{parseInt(item.total).toLocaleString('vi-VN')} ₫</Text>

      {isEditable && (
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => updateQuantity(index, item.quantity + 1)}>
            <Ionicons name="add-circle-outline" size={22} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => updateQuantity(index, item.quantity - 1)}>
            <Ionicons name="remove-circle-outline" size={22} color="#FF9500" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeItem(index)}>
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // Header navigation custom
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      title: `Đơn hàng #${order.id}`,
    });
  }, [navigation]);

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.card}>
          <View style={styles.orderInfo}>
            <Text style={styles.label}>Họ và tên:</Text>
            <Text style={styles.status}>{order.user.name}</Text>
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.status}>{order.email}</Text>
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.label}>Trạng thái:</Text>
            <Text
              style={[
                styles.status,
                order.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending,
              ]}
            >
              {order.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xử lý'}
            </Text>
          </View>

          <View style={styles.orderInfo}>
            <Text style={styles.label}>Ngày đặt:</Text>
            <Text style={styles.date}>{new Date(order.created_at).toLocaleString('vi-VN')}</Text>
          </View>

          <Text style={[styles.detailHeader, { marginTop: 12 }]}>Chi tiết sản phẩm</Text>
        </View>
      }
      data={details}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderDetailItem}
      contentContainerStyle={{ padding: 12 }}
      ListFooterComponent={
        <View style={styles.totalRow}>
          <Text style={styles.label}>Tổng cộng:</Text>
          <Text style={styles.total}>{totalAmount.toLocaleString('vi-VN')} ₫</Text>
        </View>
      }
    />
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  email: {
    color: '#444',
    fontSize: 14,
    marginBottom: 6,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: { color: '#555', fontWeight: '500' },
  status: { fontWeight: '600' },
  statusPending: { color: '#ff9500' },
  statusConfirmed: { color: '#34C759' },
  date: { color: '#777' },
  detailHeader: { fontWeight: '600', fontSize: 16, marginBottom: 6 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  detailTitle: { flex: 3, color: '#444' },
  detailQty: { flex: 1, textAlign: 'center', color: '#444' },
  detailPrice: { flex: 2, textAlign: 'right', fontWeight: '600', color: '#444' },
  actionRow: {
    flexDirection: 'row',
    gap: 3,
    marginLeft: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  total: { fontWeight: '700', fontSize: 16 },
});
