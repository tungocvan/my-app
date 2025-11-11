import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOptions } from '../redux/slices/userSlice'; // đường dẫn tới userSlice

const CustomerInfoBox = ({ customer_id }) => {
  const dispatch = useDispatch();
  const { userOptions, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (customer_id) {
      dispatch(fetchUserOptions({ customer_id }))
        .unwrap()
        .catch((err) => Alert.alert('Lỗi', err));
    }
  }, [customer_id, dispatch]);

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  if (!userOptions) return null;

  // Lấy từng option nếu có
  const shipping = userOptions.shipping_info || {};
  const profile = userOptions.profile || {};

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Họ và tên:</Text>
        <Text style={styles.status}>{profile.full_name || shipping.name || '-'}</Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.status}>{shipping.email || '-'}</Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Số điện thoại:</Text>
        <Text style={styles.status}>{shipping.phone || '-'}</Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.label}>Địa chỉ:</Text>
        <Text style={[styles.status, { flex: 1, textAlign: 'right' }]}>
          {shipping.address || '-'}
        </Text>
      </View>

      {/* Hiển thị thêm một số field khác nếu muốn */}
      {shipping.company && (
        <View style={styles.orderInfo}>
          <Text style={styles.label}>Công ty:</Text>
          <Text style={styles.status}>{shipping.company}</Text>
        </View>
      )}
      {shipping.website && (
        <View style={styles.orderInfo}>
          <Text style={styles.label}>Website:</Text>
          <Text style={styles.status}>{shipping.website}</Text>
        </View>
      )}
      {profile.bio && (
        <View style={styles.orderInfo}>
          <Text style={styles.label}>Bio:</Text>
          <Text style={styles.status}>{profile.bio}</Text>
        </View>
      )}
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
    alignItems: 'flex-start',
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
    width: '100%',
    marginVertical: 2,
  },
  label: { color: '#555', fontWeight: '500' },
  status: { fontWeight: '600', color: '#333' },
});
