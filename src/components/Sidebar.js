import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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

  // ✅ Lấy tên route hiện tại an toàn
  const currentRouteName = useNavigationState((state) => {
    if (!state?.routes?.length) return '';
    const route = state.routes[state.index];
    return route?.name;
  });

  const routes = useNavigationState((state) => {
    if (!state || !state.routes) return []; // 👈 tránh lỗi undefined
    return state.routes.map((r) => r.name);
  });

  // Hiệu ứng mở/đóng
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -width * 0.75,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  if (!isOpen && slideAnim._value === -width * 0.75) return null;

  const handleNavigate = (route) => {
    setSidebarOpen(false);
    navigation.navigate(route);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      {isOpen && (
        <TouchableWithoutFeedback onPress={() => setSidebarOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.title}>{sidebarMenuTitle}</Text>

        {sidebarMenu
          .filter((item) => routes.includes(item.route))
          .map((item) => {
            const isActive = item.route === currentRouteName;
            return (
              <TouchableOpacity
                key={item.route}
                style={[styles.menuItem, isActive && styles.activeItem]}
                onPress={() => handleNavigate(item.route)}
              >
                <Ionicons name={item.icon} size={22} color={isActive ? '#2563EB' : '#111'} />
                <Text style={[styles.menuText, isActive && styles.activeText]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}

        <View style={styles.footer}>
          <LogoutButton isColor={'#000'} />
        </View>
      </Animated.View>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 30,
    color: '#111827',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuText: {
    marginLeft: 14,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  activeItem: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  activeText: {
    color: '#2563EB',
    fontWeight: '700',
  },
  footer: {
    marginTop: 40,
  },
});
