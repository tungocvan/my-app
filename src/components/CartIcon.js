// src/components/CartIcon.js
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { LOGOUT } from '../constants';

const CartIcon = ({ hanldePress, isColor }) => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  return (
    <Pressable style={styles.container} onPress={hanldePress}>
      <Ionicons name="cart-outline" size={LOGOUT.ICON_SIZE} color={isColor || LOGOUT.ICON_COLOR} />
      {totalQuantity > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalQuantity}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default CartIcon;
