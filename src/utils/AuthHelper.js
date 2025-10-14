import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../redux/store';
import { logoutUser } from '../redux/slices/userSlice';

export const handleLogout = async (navigation) => {
  try {
    store.dispatch(logoutUser());
    await AsyncStorage.multiRemove(['token', 'user']);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
  }
};
