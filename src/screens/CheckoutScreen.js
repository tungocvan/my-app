import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { createOrder } from '../api/orderApi';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const { totalPrice } = useSelector((state) => state.cart);
  const { user, token } = useSelector((state) => state.user);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống.');
      return;
    }

    // ✅ Tạo object đơn hàng
    const order = {
      email: user?.email || 'guest@example.com',
      orderDetail: cartItems.map((item) => ({
        product_id: item.id,
        title: item.title || item.name || item.product?.name || 'Không rõ tên', // ✅ thêm fallback
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      total: totalPrice,
    };

    // ✅ In ra console trước khi gọi API
    console.log('🧾 Order chuẩn bị gửi:', JSON.stringify(order, null, 2));

    try {
      const response = await createOrder(order);
      //console.log('✅ Đơn hàng đã được lưu:', response);

      Alert.alert('Thanh toán thành công 🎉', 'Đơn hàng của bạn đã được xác nhận!', [
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
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()}đ</Text>
            </View>
          ))
        )}

        {/* Tổng tiền */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>{totalAmount.toLocaleString()}đ</Text>
        </View>
      </ScrollView>

      {/* Thanh hành động */}
      <View style={styles.footer}>
        <Pressable style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Quay lại</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.confirmButton]} onPress={handleConfirmOrder}>
          <Text style={styles.buttonText}>Xác nhận thanh toán</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#111',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 13,
    color: '#777',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e11d48',
  },
  totalRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16a34a',
  },
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
  backButton: {
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
