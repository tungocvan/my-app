import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const AppLoading = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F9FAFB',
    }}
  >
    <ActivityIndicator size="large" color="#2563EB" />
  </View>
);

export default AppLoading;
