import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import AlertScreen from '../../screens/AlertScreen';

const AlertStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen name="AlertScreen" component={AlertScreen} title="Alert" />
  </CustomStackNavigator>
);

export default AlertStack;

