import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import OrderScreen from '../../screens/OrderScreen';
import OrderDetailScreen from '../../screens/OrderDetailScreen';

const OrderStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen
      name="OrderScreen"
      component={OrderScreen}
      title="Danh sách đơn hàng"
    />
    <CustomStackNavigator.Screen
      name="OrderDetailScreen"
      component={OrderDetailScreen}
      title="Chi tiết đơn hàng"
      options={{ showMenu: false, showBack: true }}
    />
  </CustomStackNavigator>
);

export default OrderStack;
