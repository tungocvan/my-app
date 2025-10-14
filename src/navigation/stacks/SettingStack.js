import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import SettingScreen from '../../screens/SettingScreen';

const SettingStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen name="SettingScreen" component={SettingScreen} title="Setting" />
  </CustomStackNavigator>
);

export default SettingStack;

