import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HelpScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Help</Text>
      <Button title="Quay lại" onPress={() => navigation.goBack()} />
      <Button title="Chi tiết" onPress={() => navigation.navigate('HelpDetailScreen')} />
    </View>
  );
};

export default HelpScreen;
