import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import CartScreen from '../../screens/CartScreen';
import CheckoutScreen from '../../screens/CheckoutScreen';

const CartStack = () => {
  return (
    <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
      <CustomStackNavigator.Screen name="CartScreen" component={CartScreen} title="Cart" />
      <CustomStackNavigator.Screen
        name="CheckoutScreen"
        component={CheckoutScreen}
        title="Xác nhận đơn hàng"
        options={{
          showMenu: false,
          isCart: false,
        }}
      />
    </CustomStackNavigator>
  );
};

export default CartStack;
