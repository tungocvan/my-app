import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosClient from '../api/axiosClient';
import { USER_OPTIONS } from '../data/url';

const DEFAULT_AVATAR = 'https://adminlt.tungocvan.com/images/user.jpg';

const EditProfileScreen = () => {
  const user = useSelector((state) => state.user.user);

  const [userId, setUserId] = useState(user.id);

  // Thông tin cá nhân
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Tabs
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [loadingExtra, setLoadingExtra] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Extra info
  const [extraInfo, setExtraInfo] = useState({
    address: '',
    phone: '',
    email: '',
    company: '',
    website: '',
    tax_code: '',
    picture: DEFAULT_AVATAR,
  });

  /** Load user_id **/
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const id = await AsyncStorage.getItem('user_id');
  //       setUserId(Number(id) || 1);
  //     } catch (error) {
  //       console.log('Error get user_id:', error);
  //     }
  //   })();
  // }, []);

  /** Fetch user info **/
  useEffect(() => {
    //console.log('edit id:', userId);
    if (userId) fetchUserInfo();
  }, [userId]);

  const fetchUserInfo = async () => {
    setLoadingExtra(true);
    try {
      const { data } = await axiosClient.get(`${USER_OPTIONS}/${userId}`);
      if (data.success && data.data) {
        const info = data.data;
        //console.log('info:', info);

        // Set thông tin cơ bản
        setName(user?.name || '');
        setEmail(info.email || '');
        setPhone(info.phone || '');
        setAddress(info.address || '');

        // Set thông tin bổ sung
        setExtraInfo((prev) => ({
          ...prev,
          address: info.address || '',
          phone: info.phone || '',
          email: info.email || '',
          company: info.company || '',
          website: info.website || '',
          tax_code: info.tax_code || '',
          picture: info.picture || DEFAULT_AVATAR,
        }));
      }
    } catch (error) {
      console.log('Lỗi khi load user-info:', error.response?.data || error.message);
    } finally {
      setLoadingExtra(false);
    }
  };

  /** Lưu thông tin **/
  const handleSave = async () => {
    setLoading(true);

    const payload = {
      user_id: userId,
      user_info: {
        name,
        email,
        phone,
        address,
        ...extraInfo,
      },
    };

    try {
      //console.log('payload gửi lên:', payload);
      const { data } = await axiosClient.post(`${USER_OPTIONS}/update`, payload);
      if (data.success) {
        Alert.alert('✅ Thành công', 'Thông tin đã được lưu!');
      } else {
        Alert.alert('⚠️ Thất bại', data.message || 'Cập nhật không thành công.');
      }
    } catch (error) {
      console.log('Update error:', error.response?.data || error.message);
      Alert.alert('❌ Lỗi', 'Không thể lưu thông tin.');
    } finally {
      setLoading(false);
    }
  };

  /** Đổi ảnh đại diện **/
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Quyền truy cập bị từ chối', 'Vui lòng cấp quyền truy cập thư viện ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      await uploadImage(selected.uri);
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });

      const { data } = await axiosClient.post(`${USER_OPTIONS}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success && data.url) {
        setExtraInfo((prev) => ({ ...prev, picture: data.url }));
        Alert.alert('🎉 Thành công', 'Ảnh đại diện đã được cập nhật!');
      } else {
        Alert.alert('⚠️ Lỗi upload', data.message || 'Không thể tải ảnh lên.');
      }
    } catch (error) {
      console.log('Upload error:', error.response?.data || error.message);
      Alert.alert('❌ Lỗi', 'Không thể tải ảnh lên.');
    } finally {
      setUploading(false);
    }
  };

  /** TAB 1: Thông tin cá nhân **/
  const renderPersonalInfo = () => (
    <View style={styles.form}>
      <Text style={styles.label}>Họ và tên</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#E5E7EB', color: '#6B7280' }]}
        value={email}
        onChangeText={(val) => {
          setEmail(val);
          setExtraInfo((prev) => ({ ...prev, email: val }));
        }}
        editable={false}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={(val) => {
          setPhone(val);
          setExtraInfo((prev) => ({ ...prev, phone: val }));
        }}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={(val) => {
          setAddress(val);
          setExtraInfo((prev) => ({ ...prev, address: val }));
        }}
      />
    </View>
  );

  /** TAB 2: Bảo mật **/
  const renderSecurity = () => (
    <View style={styles.form}>
      <Text style={styles.label}>Mật khẩu hiện tại</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <Text style={styles.label}>Mật khẩu mới</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
    </View>
  );

  /** TAB 3: Thông tin bổ sung **/
  const renderExtraInfo = () => {
    if (loadingExtra) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={{ marginTop: 10, color: '#6B7280' }}>Đang tải thông tin...</Text>
        </View>
      );
    }

    return (
      <View style={styles.form}>
        <Text style={styles.label}>Công ty</Text>
        <TextInput
          style={styles.input}
          value={extraInfo.company}
          onChangeText={(val) => setExtraInfo((prev) => ({ ...prev, company: val }))}
        />

        <Text style={styles.label}>Mã số thuế</Text>
        <TextInput
          style={styles.input}
          value={extraInfo.tax_code}
          onChangeText={(val) => setExtraInfo((prev) => ({ ...prev, tax_code: val }))}
          placeholder="Nhập mã số thuế (nếu có)"
        />

        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={extraInfo.website}
          onChangeText={(val) => setExtraInfo((prev) => ({ ...prev, website: val }))}
          placeholder="https://..."
        />
      </View>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'security':
        return renderSecurity();
      case 'extra':
        return renderExtraInfo();
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: extraInfo.picture || DEFAULT_AVATAR }} style={styles.avatar} />
          <TouchableOpacity style={styles.changePhotoBtn} onPress={pickImage} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <>
                <Ionicons name="camera-outline" size={16} color="#2563EB" />
                <Text style={styles.changePhotoText}>Đổi ảnh</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {[
            { key: 'personal', icon: 'person-outline', text: 'Thông tin cá nhân' },
            { key: 'security', icon: 'lock-closed-outline', text: 'Bảo mật' },
            { key: 'extra', icon: 'information-circle-outline', text: 'Bổ sung' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.icon}
                size={16}
                color={activeTab === tab.key ? '#2563EB' : '#6B7280'}
              />
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeText]}>
                {tab.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          {renderActiveTab()}
        </ScrollView>

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>💾 Lưu thay đổi</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

/* ========== STYLES ========== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 20 },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#2563EB',
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  changePhotoText: {
    color: '#2563EB',
    marginLeft: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#2563EB' },
  tabText: { marginLeft: 5, fontSize: 14, color: '#6B7280', fontWeight: '500' },
  activeText: { color: '#2563EB', fontWeight: '700' },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  label: { fontSize: 15, color: '#6B7280', marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
