import React from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { removeFromCart, addToCart } from '../redux/slices/cartSlice';
import { BASE_URL_IMG } from '../data/url';

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
  // console.log('items:', items);
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: BASE_URL_IMG + '/' + item.image }} style={styles.image} />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.title}>{item.title || item.name}</Text>
        <Text style={styles.price}>{Number(item.price).toLocaleString('vi-VN')}đ</Text>
        <Text>{item.dvt || item.don_vi_tinh}</Text>
        <View style={styles.rowQty}>
          <Pressable
            style={styles.qtyButton}
            onPress={() =>
              dispatch(
                addToCart({
                  ...item,
                  quantity: item.quantity > 1 ? -1 : 0, // giảm 1 hoặc xoá nếu 0
                }),
              )
            }
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </Pressable>

          <Text style={styles.qtyText}>{item.quantity}</Text>

          <Pressable
            style={styles.qtyButton}
            onPress={
              () => dispatch(addToCart({ ...item, quantity: 1 })) // tăng 1
            }
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </Pressable>

          <Pressable style={styles.removeBtn} onPress={() => dispatch(removeFromCart(item.id))}>
            <Text style={styles.removeText}>Xóa</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Giỏ hàng</Text>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: '#666' }}>Giỏ hàng trống</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          <View style={styles.footer}>
            <Text style={styles.totalText}>Tổng cộng: {totalPrice.toLocaleString()}đ</Text>

            <Pressable
              style={styles.checkoutButton}
              onPress={() => navigation.navigate('CheckoutScreen')}
            >
              <Text style={styles.checkoutText}>Thanh toán</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    color: 'red',
    marginBottom: 6,
  },
  rowQty: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  qtyText: {
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  removeBtn: {
    marginLeft: 'auto',
    backgroundColor: '#ffebee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  removeText: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
