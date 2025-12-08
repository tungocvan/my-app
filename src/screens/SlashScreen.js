import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SlashScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Flash Screen</Text>
      <Button title="Start" onPress={() => navigation.navigate('LoginScreen')} />
    </View>
  );
};

export default SlashScreen;
