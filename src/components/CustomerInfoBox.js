import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const CustomerInfoBox = ({ user }) => {
  // Nếu không truyền user thì lấy từ Redux
  const reduxUser = useSelector((state) => state.user.user);
  const userInfo = user || reduxUser.extra_user;

  if (!userInfo) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Họ và tên:</Text>
        <Text style={styles.status}>{userInfo.name || '-'}</Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.status}>{userInfo.email || '-'}</Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Số điện thoại:</Text>
        <Text style={styles.status}>{userInfo.phone || '-'}</Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Địa chỉ:</Text>
        <Text style={[styles.status, { flex: 1, textAlign: 'right' }]}>
          {userInfo.address || '-'}
        </Text>
      </View>
    </View>
  );
};

export default CustomerInfoBox;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#007AFF',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: { color: '#555', fontWeight: '500' },
  status: { fontWeight: '600', color: '#333' },
});
