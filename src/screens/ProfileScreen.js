import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axiosClient from '../api/axiosClient';
import { USER_OPTIONS } from '../data/url';

const ProfileScreen = () => {
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        fetchUserInfo(user.id);
      }
    }, [user]),
  );

  const fetchUserInfo = async (userId) => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`${USER_OPTIONS}/${userId}`);
      if (res.data?.success) {
        setUserInfo(res.data.data);
      } else {
        Alert.alert('⚠️ Lỗi', res.data?.message || 'Không lấy được thông tin người dùng');
      }
    } catch (error) {
      console.log('Fetch user info error:', error.response?.data || error.message);
      Alert.alert('❌ Lỗi', 'Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = () => {
    navigation.navigate('EditProfileScreen', { user });
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>Chưa đăng nhập</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10, color: '#555' }}>Đang tải thông tin...</Text>
      </View>
    );
  }

  const avatar =
    userInfo?.picture || user.avatar || 'https://adminlt.tungocvan.com/images/user.jpg';

  const infoList = [
    {
      icon: 'business-outline',
      label: 'Địa chỉ',
      value: userInfo?.address || 'Chưa cập nhật',
    },
    {
      icon: 'call-outline',
      label: 'Số điện thoại',
      value: userInfo?.phone || 'Chưa cập nhật',
    },
    {
      icon: 'mail-outline',
      label: 'Email',
      value: userInfo?.email || user.email,
    },
    {
      icon: 'globe-outline',
      label: 'Website',
      value: userInfo?.website || 'Chưa có',
    },
    {
      icon: 'briefcase-outline',
      label: 'Công ty',
      value: userInfo?.company || 'Chưa có',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Hồ sơ người dùng #{user.id}</Text>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.leftCol}>
            <Text style={styles.name}>{user.name || 'Người dùng'}</Text>

            {/* Info list */}
            <View style={styles.infoList}>
              {infoList.map((item, index) => (
                <View key={index} style={styles.infoItem}>
                  <Ionicons name={item.icon} size={16} color="#555" style={styles.icon} />
                  <Text style={styles.infoText}>
                    {item.label}: {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Avatar */}
          <View style={styles.rightCol}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleViewProfile}>
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.btnText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f6f9',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 14,
    color: '#888',
  },
  body: {
    flexDirection: 'row',
    padding: 16,
  },
  leftCol: {
    flex: 7,
    justifyContent: 'center',
  },
  rightCol: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  about: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
  },
  bold: {
    fontWeight: '600',
  },
  infoList: {
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  icon: {
    marginRight: 6,
  },
  infoText: {
    color: '#555',
    fontSize: 13,
    flexShrink: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnPrimary: {
    backgroundColor: '#007bff',
  },
  btnText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
});
