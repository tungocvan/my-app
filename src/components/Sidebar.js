import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSidebar } from '../context/SidebarContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import LogoutButton from './LogoutButton';
import { sidebarMenuTitle, sidebarMenu } from '../data/sidebarMenu';

const { width } = Dimensions.get('window');

const Sidebar = () => {
  const { isOpen, setSidebarOpen } = useSidebar();
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  // Lấy route hiện tại
  const currentRouteName = useNavigationState((state) => {
    const route = state?.routes?.[state.index];
    return route?.name || '';
  });

  const routes = useNavigationState((state) => state?.routes?.map((r) => r.name) || []);

  // Animation mở / đóng
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -width * 0.75,
      duration: 260,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  if (!isOpen && slideAnim._value === -width * 0.75) return null;

  const handleNavigate = (route) => {
    setSidebarOpen(false);
    navigation.navigate(route);
  };

  return (
    <View className="absolute inset-0">
      {isOpen && (
        <TouchableWithoutFeedback onPress={() => setSidebarOpen(false)}>
          <View className="absolute inset-0 bg-black/40" />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={{ transform: [{ translateX: slideAnim }] }}
        className="absolute left-0 top-0 bottom-0 w-[75%] bg-white px-5 pt-16 shadow-xl"
      >
        {/* Title */}
        <Text className="text-xl font-semibold text-gray-900 mb-6 tracking-wide">
          {sidebarMenuTitle}
        </Text>

        {/* Menu */}
        {sidebarMenu
          .filter((item) => routes.includes(item.route))
          .map((item) => {
            const isActive = item.route === currentRouteName;

            return (
              <TouchableOpacity
                key={item.route}
                onPress={() => handleNavigate(item.route)}
                className={`flex-row items-center py-3 mb-1 rounded-xl
                  ${isActive ? 'bg-blue-50' : ''}
                `}
              >
                <Ionicons name={item.icon} size={22} color={isActive ? '#2563EB' : '#374151'} />

                <Text
                  className={`ml-4 text-base 
                    ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-800'}
                  `}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

        {/* Footer */}
        <View className="mt-10">
          <LogoutButton isColor={'#000'} />
        </View>
      </Animated.View>
    </View>
  );
};

export default Sidebar;
