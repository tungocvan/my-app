import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loadUserFromStorage } from '../redux/slices/userSlice';

export const useAuthLoader = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userJSON = await AsyncStorage.getItem('user');
        const user = userJSON ? JSON.parse(userJSON) : null;

        if (token && user) {
          dispatch(loadUserFromStorage({ token, user }));
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin user:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, [dispatch]);

  return loading;
};
