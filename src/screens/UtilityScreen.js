import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppButtons from '../components/AppButtons';
const UtilityScreen = () => {
  const buttonList = [
    { name: 'Lập bảng giá', icon: 'pricetag-outline', screen: 'BanggiaScreen' },
    { name: 'Phiếu đề xuất', icon: 'document-text-outline', screen: 'PhieudexuatScreen' },
    { name: 'Giao việc', icon: 'briefcase-outline', screen: 'GiaoviecScreen' },
    { name: 'Tra cứu thuốc', icon: 'medkit-outline', screen: 'TracuuthuocScreen' },
    { name: 'Chấm công', icon: 'medkit-outline', screen: 'TracuuthuocScreen' },
    { name: 'Quản lý Khách hàng', icon: 'medkit-outline', screen: 'TracuuthuocScreen' },
    { name: 'Quản lý Nhân viên', icon: 'medkit-outline', screen: 'TracuuthuocScreen' },
  ];

  return (
    <View style={styles.container}>
      <AppButtons buttons={buttonList} columns={2} />
    </View>
  );
};

export default UtilityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
});
