// ⚙️ Import sẵn (bắt buộc Metro cần đường dẫn tĩnh)
import { Platform } from 'react-native';
import { Fonts } from './fonts';
import HomeStack from '../navigation/stacks/HomeStack';
import AboutStack from '../navigation/stacks/AboutStack';
import ProfileStack from '../navigation/stacks/ProfileStack';
import SettingStack from '../navigation/stacks/SettingStack';

const tabMenu = [
  {
    name: 'HomeTab',
    label: 'Trang chủ',
    icon: { active: 'home', inactive: 'home-outline' },
    component: HomeStack,
  },
  {
    name: 'AboutTab',
    label: 'Giới thiệu',
    icon: { active: 'information-circle', inactive: 'information-circle-outline' },
    component: AboutStack,
  },
  {
    name: 'ProfileTab',
    label: 'Tài khoản',
    icon: { active: 'person', inactive: 'person-outline' },
    component: ProfileStack,
    // hidden: true, // 🔹 Ví dụ: ẩn tab này
  },
  {
    name: 'SettingTab',
    label: 'Cài đặt',
    icon: { active: 'settings', inactive: 'settings-outline' },
    component: SettingStack,
  },
];

export default tabMenu;

// ⚙️ Cấu hình chung cho Tab.Navigator
export const tabBarConfig = {
  headerShown: false,
  tabBarShowLabel: true,

  // ⚙️ Cấu hình style tổng thể cho thanh tab
  tabBarStyle: {
    height: Platform.OS === 'ios' ? 80 : 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },

  // 🔤 Kiểu chữ
  tabBarLabelStyle: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Fonts.bold,
  },

  // 🎨 Màu sắc
  tabBarActiveTintColor: '#2563EB',
  tabBarInactiveTintColor: '#9CA3AF',

  // 💫 Lazy load cho hiệu năng
  lazy: true,

  // 🧭 Tùy chọn mở rộng trong tương lai (nếu cần thêm iconSize, darkMode, animation)
  iconSize: 24,
};
