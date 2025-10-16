import React, { Suspense } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tabMenu, { tabBarConfig } from '../data/tabMenu';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Suspense fallback={null}>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const tab = tabMenu.find((t) => t.name === route.name);
          return {
            ...tabBarConfig,
            tabBarIcon: ({ color, focused }) => {
              if (!tab) return null;
              const iconName = focused ? tab.icon.active : tab.icon.inactive;
              return <Ionicons name={iconName} size={tabBarConfig.iconSize} color={color} />;
            },
          };
        }}
      >
        {tabMenu.map((tab) => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{
              title: tab.label,
              // ✅ Nếu tab hidden thì chỉ ẩn UI, không xóa khỏi navigator
              tabBarButton: tab.hidden ? () => null : undefined,
            }}
          />
        ))}
      </Tab.Navigator>
    </Suspense>
  );
};

export default MainNavigator;
