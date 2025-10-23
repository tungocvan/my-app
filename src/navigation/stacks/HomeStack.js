import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import HomeScreen from '../../screens/HomeScreen';
import MedicineDetailScreen from '../../screens/MedicineDetailScreen';

const HomeStack = () => {
  return (
    <CustomStackNavigator
      defaultHeaderOptions={{ showMenu: true, showLogout: true, isSearch: true }}
    >
      <CustomStackNavigator.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ showAlert: true, showAccount: true }}
      />

      <CustomStackNavigator.Screen
        name="ProductDetail"
        component={MedicineDetailScreen}
        title="Thông tin sản phẩm"
        options={{ showLogout: false, showMenu: false, showBack: true }}
      />
    </CustomStackNavigator>
  );
};

export default HomeStack;
