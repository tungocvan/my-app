import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import QuickOrderScreen from '../../screens/QuickOrderScreen';

const QuickOrderStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen name="QuickOrderScreen" component={QuickOrderScreen} title="QuickOrder" />
  </CustomStackNavigator>
);

export default QuickOrderStack;

