import React from 'react';
import CustomStackNavigator from './CustomStackNavigator';
import ProfileScreen from '../../screens/ProfileScreen';
import EditProfileScreen from '../../screens/EditProfileScreen'; // ví dụ thêm

const ProfileStack = () => {
  return (
    <CustomStackNavigator defaultHeaderOptions={{ showMenu: true, showLogout: true }}>
      <CustomStackNavigator.Screen
        name="ProfileScreen"
        title="Tài khoản của bạn"
        component={ProfileScreen}
      />
      <CustomStackNavigator.Screen
        name="EditProfileScreen"
        title="Chỉnh sửa thông tin"
        component={EditProfileScreen}
        options={{ showLogout: false }} // override showLogout riêng cho DetailScreen
      />
    </CustomStackNavigator>
  );
};
export default ProfileStack;
