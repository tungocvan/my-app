import React, { Suspense } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import tabMenu from '../data/tabMenu';
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Suspense fallback={null}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        {tabMenu.map((tab) => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{
              title: tab.label,
              tabBarIconActive: tab.icon.active,
              tabBarIconInactive: tab.icon.inactive,
              tabBarButton: tab.hidden ? null : undefined,
            }}
          />
        ))}
      </Tab.Navigator>
    </Suspense>
  );
};

export default MainNavigator;
