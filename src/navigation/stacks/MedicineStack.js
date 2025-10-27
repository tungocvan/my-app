import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import MedicineScreen from '../../screens/MedicineScreen';
import MedicineDetailScreen from '../../screens/MedicineDetailScreen';

const MedicineStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen
      name="Medicine"
      component={MedicineScreen}
      title="Danh mục thuốc"
      options={{ showLogout: false, showMenu: false, showBack: true }}
    />
    <CustomStackNavigator.Screen
      name="MedicineDetail"
      component={MedicineDetailScreen}
      title="Chi tiết sản phẩm"
      options={{ showLogout: false, showMenu: false, showBack: true }}
    />
  </CustomStackNavigator>
);

export default MedicineStack;
