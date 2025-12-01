import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { registerUser } from '../redux/slices/userSlice';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await dispatch(
        registerUser({ name, email, password, password_confirmation: confirmPassword }),
      );

      if (registerUser.fulfilled.match(result)) {
        Alert.alert('Thành công', 'Đăng ký thành công! Vui lòng đăng nhập.');
        navigation.replace('LoginScreen');
      } else {
        const msg = result.payload || result.error?.message || 'Đăng ký thất bại.';
        Alert.alert('Thất bại', msg);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi hệ thống', 'Không thể kết nối đến máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={['#E8F5E9', '#A5D6A7', '#66BB6A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ height: SCREEN_HEIGHT, paddingHorizontal: 24 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 justify-start">
            {/* Logo + Header */}
            <View className="items-center mb-10">
              <Image
                source={require('../assets/logo.png')}
                className="w-64 h-64"
                resizeMode="contain"
              />
              <Text className="text-lg font-bold text-green-900 text-center">
                Tạo tài khoản mới
              </Text>
              <Text className="text-sm text-green-900 mt-1 text-center">
                Cùng INAFO Việt Nam kết nối và phát triển
              </Text>
            </View>

            {/* Form */}
            <View className="bg-white/90 p-5 rounded-2xl shadow-md">
              {/* Name */}
              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 mb-4 h-12">
                <Ionicons name="person-outline" size={20} color="#6B7280" className="mr-2" />
                <TextInput
                  className="flex-1 text-gray-900"
                  placeholder="Họ và tên"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Email */}
              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 mb-4 h-12">
                <Ionicons name="mail-outline" size={20} color="#6B7280" className="mr-2" />
                <TextInput
                  className="flex-1 text-gray-900"
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password */}
              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 mb-2 h-12">
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" className="mr-2" />
                <TextInput
                  className="flex-1 text-gray-900"
                  placeholder="Mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 mb-4 h-12">
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" className="mr-2" />
                <TextInput
                  className="flex-1 text-gray-900"
                  placeholder="Xác nhận mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                className={`bg-green-600 rounded-xl py-3 items-center mt-2 ${
                  isSubmitting ? 'opacity-50' : ''
                }`}
                onPress={handleRegister}
                disabled={isSubmitting}
              >
                <Text className="text-white font-semibold text-base">
                  {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                </Text>
              </TouchableOpacity>

              {/* Login Link */}
              <TouchableOpacity className="mt-4" onPress={() => navigation.navigate('LoginScreen')}>
                <Text className="text-blue-600 text-center text-base">
                  Đã có tài khoản? Đăng nhập
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default RegisterScreen;
