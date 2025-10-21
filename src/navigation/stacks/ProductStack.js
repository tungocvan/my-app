import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import ProductScreen from '../../screens/ProductScreen';

const ProductStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen
      name="ProductScreen"
      component={ProductScreen}
      title="Product"
      options={{ showLogout: false, showMenu: false, showBack: true }}
    />
  </CustomStackNavigator>
);

export default ProductStack;
