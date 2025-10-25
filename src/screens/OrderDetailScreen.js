import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axiosClient from '../api/axiosClient';
import CustomerInfoBox from '../components/CustomerInfoBox';
import * as Clipboard from 'expo-clipboard';
import OrderPDFActions from '../components/OrderPDFActions';

import { USER_OPTIONS, ORDERS } from '../data/url';

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
  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.is_admin === 1;
  const { order } = route.params;
  const [orderData, setOrderData] = useState(order);
  const [details, setDetails] = useState(orderData.order_detail);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const isEditable = orderData.status === 'pending';

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axiosClient.post(USER_OPTIONS, { email: orderData.email });
        if (res.data.success) {
          setUserInfo(res.data.data);
        }
      } catch (error) {
        console.error('❌ Lỗi lấy thông tin user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [orderData.email]);

  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;
    const newDetails = [...details];
    const pricePerUnit = newDetails[index].total / newDetails[index].quantity;
    newDetails[index].quantity = newQty;
    newDetails[index].total = pricePerUnit * newQty;
    setDetails(newDetails);
  };

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

  const totalAmount = details.reduce((sum, item) => sum + parseInt(item.total), 0);

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
      title: `Đơn hàng #${orderData.id}`,
    });
  }, [navigation]);

  // 🟣 Modal ghi chú admin
  const renderAdminNoteModal = () => (
    <Modal
      visible={showModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>
            {isAdmin ? 'Ghi chú của Admin' : 'Ghi chú đơn hàng'}
          </Text>

          <TextInput
            style={styles.inputNote}
            placeholder={
              isAdmin ? 'Nhập ghi chú xác nhận đơn hàng...' : 'Nhập ghi chú cho đơn hàng của bạn...'
            }
            value={adminNote}
            onChangeText={setAdminNote}
            multiline
          />

          <View style={styles.modalActions}>
            {/* 🔹 Nút Hủy đơn */}
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: '#FF3B30' }]}
              disabled={loadingUpdate}
              onPress={async () => {
                setLoadingUpdate(true);

                const noteField = isAdmin ? 'admin_note' : 'order_note';
                const payload = {
                  order_id: orderData.id,
                  email: orderData.email,
                  status: 'cancelled', // 🔹 trạng thái hủy
                  order_detail: details,
                  total: details.reduce((sum, item) => sum + parseFloat(item.total), 0),
                  [noteField]: adminNote, // giữ ghi chú hiện tại
                };

                try {
                  const res = await axiosClient.post(`${ORDERS}/update-item`, payload);
                  if (res.data.success) {
                    Alert.alert('✅ Thành công', 'Đơn hàng đã được hủy.');

                    setOrderData((prev) => ({
                      ...prev,
                      status: 'cancelled',
                      [noteField]: adminNote,
                    }));

                    setShowModal(false);
                  } else {
                    Alert.alert('❌ Lỗi', res.data.message || 'Không thể cập nhật trạng thái.');
                  }
                } catch (error) {
                  console.log('🔴 Lỗi khi hủy đơn:', error.response?.data || error);
                  Alert.alert('❌ Lỗi', 'Không thể hủy đơn.');
                } finally {
                  setLoadingUpdate(false);
                }
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Hủy đơn</Text>
            </TouchableOpacity>
            {/* Nút đóng modal */}
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
              onPress={() => setShowModal(false)}
            >
              <Text>Hủy</Text>
            </TouchableOpacity>

            {/* Nút xác nhận ghi chú */}
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: '#34C759' }]}
              disabled={loadingUpdate}
              onPress={async () => {
                setLoadingUpdate(true);

                const noteField = isAdmin ? 'admin_note' : 'order_note';
                const statusField = isAdmin ? 'confirmed' : 'pending';

                const payload = {
                  order_id: orderData.id,
                  email: orderData.email,
                  status: statusField,
                  order_detail: details,
                  total: details.reduce((sum, item) => sum + parseFloat(item.total), 0),
                  [noteField]: adminNote,
                };

                try {
                  const res = await axiosClient.post(`${ORDERS}/update-item`, payload);
                  if (res.data.success) {
                    Alert.alert('✅ Thành công', res.data.message || 'Đơn hàng đã được xác nhận.');

                    setOrderData((prev) => ({
                      ...prev,
                      status: statusField,
                      [noteField]: adminNote,
                    }));

                    setShowModal(false);
                  } else {
                    Alert.alert('❌ Lỗi', res.data.message || 'Không thể cập nhật trạng thái.');
                  }
                } catch (error) {
                  console.log('🔴 Lỗi khi cập nhật:', error.response?.data || error);
                  Alert.alert('❌ Lỗi', 'Không thể cập nhật đơn hàng.');
                } finally {
                  setLoadingUpdate(false);
                }
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>
                {loadingUpdate ? 'Đang xử lý...' : 'Xác nhận'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      {renderAdminNoteModal()}

      <FlatList
        ListHeaderComponent={
          <View style={styles.card}>
            {userInfo && <CustomerInfoBox user={userInfo} />}

            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
              Thông tin đơn hàng #{orderData.id}
            </Text>

            {/* 🔹 Link tải về (nếu đơn hàng đã xác nhận) */}
            {orderData.status === 'confirmed' && orderData.link_download && (
              <View style={styles.orderInfo}>
                <OrderPDFActions
                  pdfUrl={orderData.link_download}
                  showOpen={false}
                  showDownload={false}
                  showShare={true}
                  showPrint={true} // Ẩn nút in
                  showCopy={true}
                />
              </View>
            )}

            <View style={styles.orderInfo}>
              <Text style={styles.label}>Trạng thái:</Text>

              {orderData.status === 'pending' ? (
                <TouchableOpacity style={styles.statusButton} onPress={() => setShowModal(true)}>
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Chờ xử lý</Text>
                </TouchableOpacity>
              ) : (
                <Text
                  style={[
                    styles.status,
                    orderData.status === 'confirmed'
                      ? styles.statusConfirmed
                      : orderData.status === 'cancelled'
                        ? styles.statusCancelled
                        : styles.statusPending,
                  ]}
                >
                  {orderData.status === 'confirmed'
                    ? 'Đã xác nhận'
                    : orderData.status === 'cancelled'
                      ? 'Đã hủy'
                      : 'Chờ xử lý'}
                </Text>
              )}
            </View>

            {/* 🟢 Ghi chú của khách hàng */}
            <View style={styles.orderInfo}>
              <Text style={styles.label}>Ghi chú khách:</Text>
              <Text style={styles.noteText}>
                {orderData.order_note ? orderData.order_note : '— Không có ghi chú —'}
              </Text>
            </View>

            {/* 🔸 Ghi chú của admin */}
            {orderData.admin_note && (
              <View style={styles.adminNoteBox}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.adminNoteText}>{orderData.admin_note}</Text>
              </View>
            )}

            <View style={styles.orderInfo}>
              <Text style={styles.label}>Ngày đặt:</Text>
              <Text style={styles.date}>
                {new Date(orderData.created_at).toLocaleString('vi-VN')}
              </Text>
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
    </>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#007AFF',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: { color: '#555', fontWeight: '500' },
  status: { fontWeight: '600', color: '#333' },
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
  statusButton: {
    backgroundColor: '#ff9500',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  noteText: {
    flex: 1,
    textAlign: 'right',
    color: '#555',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#007AFF',
  },
  inputNote: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  adminNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  adminNoteText: {
    flex: 1,
    color: '#fff',
    fontWeight: '600',
    fontStyle: 'italic',
    fontSize: 14,
  },
  statusCancelled: {
    color: '#FF3B30', // đỏ
    fontWeight: '700', // đậm
  },
});
