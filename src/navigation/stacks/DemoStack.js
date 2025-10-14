import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import DemoScreen from '../../screens/DemoScreen';

const DemoStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen name="DemoScreen" component={DemoScreen} title="Demo" />
  </CustomStackNavigator>
);

export default DemoStack;
