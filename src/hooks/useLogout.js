import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../redux/slices/userSlice';

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      dispatch(logoutUser());
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return logout;
};
