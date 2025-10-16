import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import DealsScreen from '../../screens/DealsScreen';

const DealsStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen name="DealsScreen" component={DealsScreen} title="Deals" />
  </CustomStackNavigator>
);

export default DealsStack;

