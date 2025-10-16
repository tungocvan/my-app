import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import OrderScreen from '../../screens/OrderScreen';

const OrderStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen name="OrderScreen" component={OrderScreen} title="Order" />
  </CustomStackNavigator>
);

export default OrderStack;

