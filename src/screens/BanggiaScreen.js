import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BangBaoGia from '../components/BangBaoGia';

const BanggiaScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <BangBaoGia navigation={navigation} />
    </View>
  );
};

export default BanggiaScreen;
