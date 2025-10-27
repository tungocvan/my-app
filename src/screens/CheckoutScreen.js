import React, { useState } from 'react';
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
import { clearCart } from '../redux/slices/cartSlice';
import { createOrder } from '../api/orderApi';
import CustomerInfoBox from '../components/CustomerInfoBox';

// 🧮 Hàm tách số và nhân quy cách (ví dụ: "Hộp 10 ống x 10ml" -> 10 * 10 = 100)
const extractQuyCachFactor = (quycach) => {
  if (!quycach) return 1;
  const numbers = quycach.match(/\d+/g);
  if (!numbers || numbers.length === 0) return 1;
  if (numbers.length === 1) return parseInt(numbers[0], 10);
  return numbers.slice(0, 2).reduce((a, b) => a * b, 1);
};

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [noteModalVisible, setNoteModalVisible] = useState(false);

  // ✅ Tính tổng tiền (tự động nhân theo quy cách)
  const totalAmount = cartItems.reduce((sum, item) => {
    const quyCachFactor = item.soluong_quycach
      ? Number(item.soluong_quycach)
      : extractQuyCachFactor(item.quycach);
    return sum + item.price * item.quantity * quyCachFactor;
  }, 0);

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống.');
      return;
    }

    setIsSubmitting(true);

    const order = {
      user_id: user?.id || null,
      email: user?.email || 'guest@example.com',
      orderDetail: cartItems.map((item) => {
        const quyCachFactor = item.soluong_quycach
          ? Number(item.soluong_quycach)
          : extractQuyCachFactor(item.quycach);
        return {
          product_id: item.id,
          title: item.ten_biet_duoc || item.title || 'Không rõ tên',
          price: item.price,
          dvt: item.dvt || '',
          quantity: Number(item.quantity) * quyCachFactor,
          quy_cach: item.quycach || '',
          total: item.price * item.quantity * quyCachFactor,
        };
      }),
      total: totalAmount,
      status: 'pending',
      order_note: orderNote,
    };

    try {
      await createOrder(order);
      console.log('order:', order);
      Alert.alert('🎉 Thành công', 'Đơn hàng của bạn đã được xác nhận!', [
        {
          text: 'OK',
          onPress: () => {
            dispatch(clearCart());
            navigation.navigate('HomeTab');
          },
        },
      ]);
    } catch (error) {
      console.error('❌ Lỗi khi tạo đơn hàng:', error.response?.data || error.message);
      Alert.alert('Lỗi', 'Không thể tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <CustomerInfoBox user={user?.extra_user} />

        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
        ) : (
          cartItems.map((item) => {
            const quyCachFactor = item.soluong_quycach
              ? Number(item.soluong_quycach)
              : extractQuyCachFactor(item.quycach);
            const itemTotal = item.price * item.quantity * quyCachFactor;

            return (
              <View key={item.id} style={styles.cartItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>
                    {item.ten_biet_duoc || item.title || 'Không rõ tên'}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    {item.quantity} x {item.quycach ? `(${item.quycach})` : ''}
                  </Text>
                  <Text style={styles.itemSubInfo}>
                    Tổng {item.quantity * quyCachFactor} {item.dvt || ''}
                    {' x '}
                    {item.price.toLocaleString()}đ
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
            {orderNote
              ? `"${orderNote}"`
              : 'Nhấn để thêm ghi chú... (thay đổi thông tin nhận hàng, hẹn giờ giao...)'}
          </Text>
        </Pressable>

        {/* Tổng cộng */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>{totalAmount.toLocaleString()}đ</Text>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={noteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nhập ghi chú đơn hàng</Text>
            <TextInput
              style={styles.noteInput}
              value={orderNote}
              onChangeText={setOrderNote}
              placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
              multiline
              numberOfLines={5}
              textAlignVertical="top"
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
          disabled={isSubmitting || cartItems.length === 0}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// ================== STYLES ==================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  content: { padding: 16 },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 40 },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemQuantity: { fontSize: 13, color: '#777' },
  itemSubInfo: { fontSize: 12, color: '#666', fontStyle: 'italic' },
  itemPrice: { fontSize: 15, fontWeight: '600', color: '#e11d48' },
  noteButton: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noteButtonLabel: { fontWeight: '600', color: '#007AFF', marginBottom: 4 },
  noteButtonValue: { color: '#333', fontStyle: 'italic' },
  totalRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#222' },
  totalValue: { fontSize: 18, fontWeight: '700', color: '#16a34a' },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    padding: 12,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButton: { backgroundColor: 'red', marginRight: 8 },
  confirmButton: { backgroundColor: '#2563eb' },
  buttonText: { color: '#fff', fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#007AFF', marginBottom: 10 },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    color: '#333',
    marginBottom: 12,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalButtonText: { color: '#fff', fontWeight: '600' },
});
