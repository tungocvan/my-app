import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import BanggiaScreen from '../../screens/BanggiaScreen';
import LapbanggiaScreen from '../../screens/LapbanggiaScreen';
import BanggiaListScreen from '../../screens/BanggiaListScreen';

const BanggiaStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen
      name="BanggiaListScreen"
      component={BanggiaListScreen}
      title="Danh sách bảng báo giá"
      options={{ showMenu: false, showBack: true, isCart: false }}
    />
    <CustomStackNavigator.Screen
      name="BanggiaScreen"
      component={BanggiaScreen}
      title="Danh mục sản phẩm"
      options={{ showMenu: false, showBack: true, isCart: false }}
    />
    <CustomStackNavigator.Screen
      name="LapbanggiaScreen"
      component={LapbanggiaScreen}
      title="Lập bảng giá"
      options={{ showMenu: false, showBack: true, isCart: false }}
    />
  </CustomStackNavigator>
);

export default BanggiaStack;
