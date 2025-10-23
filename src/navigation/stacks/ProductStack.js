import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import ProductScreen from '../../screens/ProductScreen';
import MedicineDetailScreen from '../../screens/MedicineDetailScreen';

const ProductStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen
      name="ProductScreen"
      component={ProductScreen}
      title="Danh mục sản phẩm"
      options={{ showLogout: false, showMenu: false, showBack: true }}
    />
    <CustomStackNavigator.Screen
      name="ProductDetail"
      component={MedicineDetailScreen}
      title="Thông tin sản phẩm"
      options={{ showLogout: false, showMenu: false, showBack: true }}
    />
  </CustomStackNavigator>
);

export default ProductStack;
