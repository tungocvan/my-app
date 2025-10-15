import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import SearchScreen from '../../screens/SearchScreen';

const SearchStack = () => (
  <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
    <CustomStackNavigator.Screen name="SearchScreen" component={SearchScreen} title="Search" />
  </CustomStackNavigator>
);

export default SearchStack;

