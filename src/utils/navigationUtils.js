// src/utils/navigationUtils.js
import React from 'react';
import { useLayoutEffect } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

/**
 * Helper wrap một stack để tự động ẩn tab bar cho các màn hình con
 * @param {React.Component} StackComponent - Stack bạn muốn wrap (CustomStackNavigator)
 * @param {string[]} hiddenScreens - danh sách tên màn hình con cần ẩn tab bar
 * @returns React component đã wrap
 */
export const wrapStackWithAutoHideTabBar = (StackComponent, hiddenScreens = []) => {
  return (props) => {
    const { navigation, route } = props;

    useLayoutEffect(() => {
      const routeName = getFocusedRouteNameFromRoute(route) ?? '';
      const tabNav = navigation.getParent();

      if (tabNav) {
        tabNav.setOptions({
          tabBarStyle: hiddenScreens.includes(routeName)
            ? { display: 'none' }
            : { display: 'flex' },
        });
      }
    }, [navigation, route]);

    return <StackComponent {...props} />;
  };
};
