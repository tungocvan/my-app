import React, { useEffect, useState } from 'react';
import { Button, Alert, View, Text } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { USER, VERIFY } from '../data/url';
WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginButton({ onLoginSuccess }) {
  const [userInfo, setUserInfo] = useState(null);

  const WEB_CLIENT_ID = '323384860483-tn2g6j1h9g55bl6gn6q7hrj1cf03ebog.apps.googleusercontent.com';

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: WEB_CLIENT_ID,
    redirectUri: 'https://auth.expo.dev/@tungocvan/my-app',
    scopes: ['profile', 'email'],
  });

  // ✅ Xử lý phản hồi từ Google
  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type !== 'success') return;

      try {
        const { id_token } = response.params;

        const res = await fetch(VERIFY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_token }),
        });

        const text = await res.text();
        //console.log('Raw response:', id_token);

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('❌ Lỗi parse JSON:', e);
          Alert.alert('Lỗi', 'Phản hồi không hợp lệ từ máy chủ');
          return;
        }

        if (!res.ok) {
          console.error('Lỗi backend:', data);
          Alert.alert('Lỗi', data.error || 'Đăng nhập thất bại');
          return;
        }

        // ✅ Lưu token & thông tin user
        await AsyncStorage.setItem('authToken', data.token);
        data.user.token = id_token;
        setUserInfo(data.user);
        //console.log('✅ Đăng nhập thành công:', data.token);

        Alert.alert('Thành công', `Xin chào ${data.user.name}`);

        // ✅ Điều hướng tới HomeScreen (đảm bảo screen tồn tại)
        onLoginSuccess?.(data.user);
      } catch (err) {
        console.error('🔥 Lỗi khi xử lý response:', err);
        Alert.alert('Lỗi', err.message || 'Không thể đăng nhập');
      }
    };

    handleGoogleResponse();
  }, [response]);

  // ✅ Lấy profile khi đã có token
  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return Alert.alert('Thông báo', 'Bạn chưa đăng nhập');

      const res = await fetch(USER, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Không lấy được thông tin user');

      const user = await res.json();
      Alert.alert('User info', JSON.stringify(user, null, 2));
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={request ? 'Đăng nhập với Google' : 'Đang tải...'}
        disabled={!request}
        onPress={() => promptAsync({ useProxy: true })}
      />

      {userInfo && (
        <View style={{ marginTop: 20 }}>
          <Text>Xin chào: {userInfo.name}</Text>

          <Button title="Xem profile" onPress={fetchUserProfile} />
        </View>
      )}
    </View>
  );
}
