import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AppNavigator from './AppNavigator'; // chứa Sidebar + MainNavigator
// import LoginScreen from '../screens/LoginScreen';
import SlashScreen from '../screens/SlashScreen';

const RootNavigator = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <>
      <NavigationContainer>
        {isAuthenticated ? <AppNavigator /> : <SlashScreen />}
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default RootNavigator;
