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
import { loginUser, setUser } from '../redux/slices/userSlice';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu!');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await dispatch(loginUser({ email, password }));
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(setUser(result.payload));
      } else {
        Alert.alert('Thất bại', result.payload || 'Đăng nhập không thành công');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại.');
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
          <View className="flex-1 justify-start py-10">
            {/* Logo + Welcome */}
            <View className="items-center mb-10">
              <Image
                source={require('../assets/logo.png')}
                className="w-64 h-64"
                resizeMode="contain"
              />
              <Text className="text-lg font-bold text-green-900 text-center">
                Chào mừng đến với INAFO VIỆT NAM
              </Text>
              <Text className="text-sm text-green-900 mt-1 text-center">
                Đăng nhập để nhận nhiều ưu đãi
              </Text>
            </View>

            {/* Form */}
            <View className="bg-white/90 p-5 rounded-2xl shadow-md">
              {/* Email */}
              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 mb-4 h-12">
                <Ionicons name="person-outline" size={20} color="#6B7280" className="mr-2" />
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

              <TouchableOpacity
                className="self-end mb-4"
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
              >
                <Text className="text-blue-600 text-sm">Quên mật khẩu?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                className={`bg-green-600 rounded-xl py-3 items-center mt-2 ${
                  isSubmitting ? 'opacity-50' : ''
                }`}
                onPress={handleLogin}
                disabled={isSubmitting}
              >
                <Text className="text-white font-semibold text-base">
                  {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Text>
              </TouchableOpacity>

              {/* Register Link */}
              <TouchableOpacity
                className="mt-4"
                onPress={() => navigation.navigate('RegisterScreen')}
              >
                <Text className="text-blue-600 text-center text-base">
                  Chưa có tài khoản? Đăng ký ngay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;
