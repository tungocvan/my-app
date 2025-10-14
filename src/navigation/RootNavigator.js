import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator'; // chứa Sidebar + MainNavigator
import LoginScreen from '../screens/LoginScreen';

const RootNavigator = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
};

export default RootNavigator;
