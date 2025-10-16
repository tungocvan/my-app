import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { loginUser, setUser } from '../redux/slices/userSlice';
import GoogleLoginButton from '../components/GoogleLoginButton';

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

    setIsSubmitting(true); // ✅ disable nút ngay khi bắt đầu

    try {
      const result = await dispatch(loginUser({ email, password }));
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(setUser(result.payload));
        // Bạn có thể navigate tới màn hình Home
        // navigation.replace('HomeTab');
      } else {
        Alert.alert('Thất bại', result.payload || 'Đăng nhập không thành công');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false); // ✅ bật lại nút sau khi xong
    }
  };

  return (
    <LinearGradient
      // colors={['#16A085', '#1ABC9C']}
      // colors={['#6D28D9', '#9333EA', '#EC4899']}
      colors={['#E8F5E9', '#A5D6A7', '#66BB6A']}
      // colors={['#D9F99D', '#86EFAC', '#4ADE80']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Logo + chào mừng */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')} // logo của bạn
          style={styles.logo}
        />
        <Text style={styles.welcome}>Chào mừng đến với INAFO VIỆT NAM</Text>
        <Text style={styles.subtitle}>Đăng nhập để nhận nhiều ưu đãi</Text>
      </View>

      {/* Ô nhập */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#9CA3AF"
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
          style={{ alignSelf: 'flex-end', marginBottom: 10 }}
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          <Text style={styles.forgot}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isSubmitting && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={isSubmitting} // ✅ disable khi đang gửi
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
        </TouchableOpacity>

        <GoogleLoginButton onLoginSuccess={() => {}} />

        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>Chưa có tài khoản? Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 128, height: 128, marginBottom: 16 },
  welcome: { fontSize: 18, fontWeight: '700', color: '#1A2E05' },
  subtitle: { fontSize: 15, color: '#1A2E05', marginTop: 4 },
  form: { backgroundColor: 'rgba(255,255,255,0.9)', padding: 20, borderRadius: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 44, color: '#111827' },
  forgot: { color: '#2563EB', fontSize: 14 },
  button: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { marginTop: 20, color: '#2563EB', textAlign: 'center', fontSize: 15 },
});

export default LoginScreen;
