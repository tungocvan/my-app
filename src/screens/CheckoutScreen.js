import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import CustomerInfoBox from '../components/CustomerInfoBox';
import { createOrder } from '../redux/slices/cartSlice';
import { fetchUsers } from '../redux/slices/userSlice'; // nếu bạn có slice userList

// 🧮 Hàm tách số và nhân quy cách ("Hộp 10 ống x 10ml" -> 100)
const extractQuyCachFactor = (quycach) => {
  if (!quycach) return 1;
  const numbers = quycach.match(/\d+/g);
  if (!numbers?.length) return 1;
  return numbers.slice(0, 2).reduce((a, b) => a * b, 1);
};

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.user);
  const customers = useSelector((state) => state.user.customers || []);

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [orderNote, setOrderNote] = useState('');
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //console.log('customers:', customers);
  // Fetch danh sách customer khi vào screen
  useEffect(() => {
    if (!customers.length) {
      dispatch(fetchUsers()); // giả sử bạn có slice userList
    }
  }, [dispatch]);

  // ✅ Tính tổng tiền
  const totalAmount = cartItems.reduce((sum, item) => {
    const factor = item.soluong_quycach
      ? Number(item.soluong_quycach)
      : extractQuyCachFactor(item.quycach);
    return sum + item.price * item.quantity * factor;
  }, 0);

  // ✅ Tạo đơn hàng
  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống.');
      return;
    }

    if (!selectedCustomerId) {
      setSelectedCustomerId(user.id);
      Alert.alert('Thông báo', 'Bạn đã tự lên đơn cho chính mình.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      user_id: user?.id || null,
      customer_id: selectedCustomerId,
      email: user?.email || 'guest@example.com',
      order_detail: cartItems.map((item) => {
        const factor = item.soluong_quycach
          ? Number(item.soluong_quycach)
          : extractQuyCachFactor(item.quycach);
        return {
          product_id: item.id,
          quantity: Number(item.quantity) * factor,
        };
      }),
      order_note: orderNote,
    };

    // console.log('🔵 Payload:', payload);

    try {
      const res = await dispatch(createOrder(payload));

      if (createOrder.fulfilled.match(res)) {
        Alert.alert('🎉 Thành công', 'Đơn hàng đã được xác nhận!', [
          { text: 'OK', onPress: () => navigation.navigate('HomeTab') },
        ]);
      } else {
        Alert.alert('❌ Lỗi', 'Không thể tạo đơn hàng. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('❌ Lỗi khi tạo đơn:', err);
      Alert.alert('❌ Lỗi', 'Đã xảy ra lỗi khi tạo đơn hàng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Thông tin khách hàng */}
        <CustomerInfoBox user={user?.extra_user} />

        {/* Combobox chọn customer */}
        <View style={{ marginVertical: 12 }}>
          <Text style={{ marginBottom: 6, fontWeight: '600' }}>Chọn khách hàng:</Text>
          <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}>
            <Picker
              selectedValue={selectedCustomerId}
              onValueChange={(itemValue) => setSelectedCustomerId(itemValue)}
            >
              <Picker.Item label="-- Chọn khách hàng --" value={null} />
              {Array.isArray(customers) &&
                customers.map((c) => <Picker.Item key={c.id} label={c.username} value={c.id} />)}
            </Picker>
          </View>
        </View>

        {/* Danh sách sản phẩm */}
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Giỏ hàng đang trống</Text>
        ) : (
          cartItems.map((item) => {
            const factor = item.soluong_quycach
              ? Number(item.soluong_quycach)
              : extractQuyCachFactor(item.quycach);
            const itemTotal = item.price * item.quantity * factor;

            return (
              <View key={item.id} style={styles.cartItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>
                    {item.ten_biet_duoc || item.title || 'Không rõ tên'}
                  </Text>
                  <Text style={styles.itemSubInfo}>
                    {item.quantity} × {item.quycach || '—'}
                  </Text>
                  <Text style={styles.itemSubInfo}>
                    Tổng {item.quantity * factor} {item.dvt || ''} × {item.price.toLocaleString()}đ
                  </Text>
                </View>
                <Text style={styles.itemPrice}>{itemTotal.toLocaleString()}đ</Text>
              </View>
            );
          })
        )}

        {/* Ghi chú */}
        <Pressable style={styles.noteButton} onPress={() => setNoteModalVisible(true)}>
          <Text style={styles.noteButtonLabel}>📝 Ghi chú đơn hàng</Text>
          <Text style={styles.noteButtonValue}>
            {orderNote ? `"${orderNote}"` : 'Nhấn để thêm ghi chú...'}
          </Text>
        </Pressable>

        {/* Tổng cộng */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>{totalAmount.toLocaleString()}đ</Text>
        </View>
      </ScrollView>

      {/* Modal ghi chú */}
      <Modal visible={noteModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nhập ghi chú đơn hàng</Text>
            <TextInput
              style={styles.noteInput}
              value={orderNote}
              onChangeText={setOrderNote}
              placeholder="Ví dụ: giao giờ hành chính..."
              multiline
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#aaa' }]}
                onPress={() => setNoteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#007AFF' }]}
                onPress={() => setNoteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Lưu</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Quay lại</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.confirmButton, isSubmitting && { opacity: 0.6 }]}
          onPress={handleConfirmOrder}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  content: { padding: 16 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#666' },
  cartItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemSubInfo: { fontSize: 13, color: '#777' },
  itemPrice: { fontSize: 16, fontWeight: '700', color: '#dc2626' },
  noteButton: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noteButtonLabel: { fontWeight: '600', color: '#007AFF' },
  noteButtonValue: { color: '#333', marginTop: 4 },
  totalRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 12,
  },
  totalLabel: { fontSize: 16, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#16a34a' },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  backButton: { backgroundColor: '#ef4444', marginRight: 10 },
  confirmButton: { backgroundColor: '#2563eb' },
  buttonText: { color: '#fff', fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#007AFF' },
  noteInput: {
    marginTop: 10,
    minHeight: 100,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 10,
  },
  modalButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  modalButtonText: { color: '#fff', fontWeight: '700' },
});
