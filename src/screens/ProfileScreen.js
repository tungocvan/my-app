import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import LogoutButton from '../components/LogoutButton';

const ProfileScreen = () => {
  // Lấy user từ Redux store
  const user = useSelector((state) => state.user.user);
  // console.log(user);
  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chưa đăng nhập</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      <Text style={{ fontSize: 22 }}>👤 Hồ sơ cá nhân</Text>
      <Text style={{ fontSize: 18 }}>Tên: {user.name}</Text>
      <Text style={{ fontSize: 16 }}>Email: {user.email}</Text>
      <Text style={{ fontSize: 16 }}>Username: {user.username}</Text>

      <LogoutButton />
    </View>
  );
};

export default ProfileScreen;
