import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import HelpScreen from '../../screens/HelpScreen';
import HelpDetailScreen from '../../screens/HelpDetailScreen';

const HelpStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true, isCart: false }}>
    <CustomStackNavigator.Screen name="HelpScreen" component={HelpScreen} title="Help" />
    <CustomStackNavigator.Screen
      name="HelpDetailScreen"
      component={HelpDetailScreen}
      title="Help"
      options={{ showLogout: false, showMenu: false, showBack: true }}
    />
  </CustomStackNavigator>
);

export default HelpStack;
