import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HelpDetailScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>HelpDetailScreen</Text>
      <Button title="Quay lại" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default HelpDetailScreen;
