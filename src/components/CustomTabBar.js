import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  if (!state || !descriptors || !navigation) {
    return null;
  }

  return (
    <View className="bg-[#0d1117] px-4 pb-6 pt-2">
      <View className="flex-row bg-[#1a1a2e] rounded-3xl h-[70px] items-center justify-around px-2 shadow-lg shadow-black/50">
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
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          if (options.tabBarButton === null) {
            return <View key={route.key} className="w-0 h-0" />;
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              activeOpacity={0.7}
              className="flex-1 items-center justify-center py-2 relative"
            >
              {isFocused && <View className="absolute inset-1 bg-emerald-500/20 rounded-2xl" />}

              <Ionicons
                name={iconName}
                size={isFocused ? 26 : 24}
                color={isFocused ? '#10b981' : '#6b7280'}
              />

              <Text
                className={`text-[10px] font-semibold mt-1 ${
                  isFocused ? 'text-emerald-500' : 'text-gray-500'
                }`}
              >
                {label}
              </Text>

              {isFocused && (
                <View className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;
