// ⚙️ Import sẵn (bắt buộc Metro cần đường dẫn tĩnh)
import { Platform } from 'react-native';
import { Fonts } from './fonts';
import HomeStack from '../navigation/stacks/HomeStack';
import AboutStack from '../navigation/stacks/AboutStack';
import ProfileStack from '../navigation/stacks/ProfileStack';
import SettingStack from '../navigation/stacks/SettingStack';
import SearchStack from '../navigation/stacks/SearchStack';
import CartStack from '../navigation/stacks/CartStack';
import DealsStack from '../navigation/stacks/DealsStack';
import OrderStack from '../navigation/stacks/OrderStack';
import MedicineStack from '../navigation/stacks/MedicineStack';
import QuickOrderStack from '../navigation/stacks/QuickOrderStack';
import AlertStack from '../navigation/stacks/AlertStack';
import ProductStack from '../navigation/stacks/ProductStack';
import UtilityStack from '../navigation/stacks/UtilityStack';

const tabMenu = [
  {
    name: 'HomeTab',
    label: 'Trang chủ',
    icon: { active: 'home', inactive: 'home-outline' },
    component: HomeStack,
  },
  {
    name: 'OrderTab',
    label: 'Đơn hàng',
    icon: { active: 'bus-outline', inactive: 'car-outline' },
    component: OrderStack,
  },
  {
    name: 'MedicineTab',
    label: 'Đặt nhanh',
    icon: { active: 'flash', inactive: 'flash-outline' },
    component: MedicineStack,
    hidden: false,
  },
  {
    name: 'UtilityTab',
    label: 'Tiện ích',
    icon: { active: 'gift-outline', inactive: 'gift-outline' },
    component: UtilityStack,
  },
  {
    name: 'DealsTab',
    label: 'Khuyến Mãi',
    icon: { active: 'gift-outline', inactive: 'gift-outline' },
    component: DealsStack,
    hidden: true,
  },
  {
    name: 'AboutTab',
    label: 'Giới thiệu',
    icon: { active: 'information-circle', inactive: 'information-circle-outline' },
    component: AboutStack,
    hidden: true,
  },
  {
    name: 'ProfileTab',
    label: 'Tài khoản',
    icon: { active: 'person', inactive: 'person-outline' },
    component: ProfileStack,
    hidden: true, // 🔹 Ví dụ: ẩn tab này
  },
  {
    name: 'SettingTab',
    label: 'Cài đặt',
    icon: { active: 'settings', inactive: 'settings-outline' },
    component: SettingStack,
    hidden: true,
  },
  {
    name: 'SearchTab',
    label: 'Tìm kiếm',
    icon: { active: 'search', inactive: 'search-outline' },
    component: SearchStack,
    hidden: true,
  },
  {
    name: 'CartTab',
    label: 'Giỏ hàng',
    icon: { active: 'cart', inactive: 'cart-outline' },
    component: CartStack,
    hidden: true,
  },
  {
    name: 'QuickOrderTab',
    label: 'Đặt nhanh',
    icon: { active: 'flash-outline', inactive: 'flash-outline' },
    component: QuickOrderStack,
    hidden: true,
  },
  {
    name: 'AlertTab',
    label: 'Thông báo',
    icon: { active: 'notifications', inactive: 'notifications-outline' },
    component: AlertStack,
    hidden: true,
  },
  {
    name: 'ProductTab',
    label: 'Sản phẩm',
    icon: { active: 'notifications', inactive: 'notifications-outline' },
    component: ProductStack,
    hidden: true,
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
    paddingBottom: Platform.OS === 'ios' ? 20 : 18,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },

  // 🔤 Kiểu chữ
  tabBarLabelStyle: {
    fontSize: 10,
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
