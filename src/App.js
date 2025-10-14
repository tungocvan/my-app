import React, { useEffect, useCallback, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import Toast from 'react-native-toast-message';
import { Provider, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import store from './redux/store';
import { useAuthLoader } from './hooks/useAuthLoader';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';

import { SidebarProvider } from './context/SidebarContext';
import Sidebar from './components/Sidebar';
import AppLoading from './components/AppLoading';

// 🆕 Import font map
import { fontMap } from './data/fonts';

SplashScreen.preventAutoHideAsync();

const RootNavigator = () => {
  const loading = useAuthLoader();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (loading) return <AppLoading />;

  return (
    <>
      {isAuthenticated ? (
        <>
          <AppNavigator />
          <Sidebar />
        </>
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // ⏳ Load font
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(fontMap);
      } catch (err) {
        console.warn('Lỗi load font:', err);
      } finally {
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  // 🔹 Ẩn splash screen khi font đã sẵn sàng
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SidebarProvider>
        <NavigationContainer onReady={onLayoutRootView}>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
      </SidebarProvider>
    </Provider>
  );
};

export default App;
