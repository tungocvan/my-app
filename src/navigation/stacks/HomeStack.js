import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import HomeScreen from '../../screens/HomeScreen';
import DetailScreen from '../../screens/DetailScreen';

const HomeStack = () => {
  return (
    <CustomStackNavigator
      defaultHeaderOptions={{ showMenu: true, showLogout: true, isSearch: true }}
    >
      <CustomStackNavigator.Screen name="HomeScreen" component={HomeScreen} />
      <CustomStackNavigator.Screen
        name="DetailScreen"
        title="Chi tiết sản phẩm"
        component={DetailScreen}
        options={{ showLogout: false }} // override showLogout riêng cho DetailScreen
      />
    </CustomStackNavigator>
  );
};

export default HomeStack;
