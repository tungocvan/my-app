import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import AboutScreen from '../../screens/AboutScreen';

const AboutStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen name="AboutScreen" component={AboutScreen} title="Giới Thiệu" />
  </CustomStackNavigator>
);

export default AboutStack;
