import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import UtilityScreen from '../../screens/UtilityScreen';
import TracuuthuocScreen from '../../screens/TracuuthuocScreen';
import PhieudexuatScreen from '../../screens/PhieudexuatScreen';
import GiaoviecScreen from '../../screens/GiaoviecScreen';
import BanggiaScreen from '../../screens/BanggiaScreen';

const UtilityStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen name="UtilityScreen" component={UtilityScreen} title="Tiện ích" />
    <CustomStackNavigator.Screen
      name="BanggiaScreen"
      component={BanggiaScreen}
      title="Lập bảng giá"
      options={{ showMenu: false, showBack: true, isCart: false }}
    />
    <CustomStackNavigator.Screen
      name="TracuuthuocScreen"
      component={TracuuthuocScreen}
      title="Tra cứu thuốc"
      options={{ showMenu: false, showBack: true, isCart: false }}
    />
    <CustomStackNavigator.Screen
      name="PhieudexuatScreen"
      component={PhieudexuatScreen}
      title="Phiếu đề xuất"
      options={{ showMenu: false, showBack: true, isCart: false }}
    />
    <CustomStackNavigator.Screen
      name="GiaoviecScreen"
      component={GiaoviecScreen}
      title="Giao việc"
      options={{ showMenu: false, showBack: true, isCart: false }}
    />
  </CustomStackNavigator>
);

export default UtilityStack;
