import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View className="flex-row bg-[#0a7f6f] border-t border-gray-200 h-20 items-center justify-around">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;
        const iconName = isFocused ? options.tabBarIconActive : options.tabBarIconInactive;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (options.tabBarButton === null) {
          return <View key={route.key} className="w-0 h-0" />;
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center justify-center"
          >
            <Ionicons name={iconName} size={24} color={isFocused ? '#ecf1f0' : '#7f8c8d'} />
            <Text className={`text-xs mt-1 ${isFocused ? 'text-[#ecf1f0]' : 'text-white-500'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
