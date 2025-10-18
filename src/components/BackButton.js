import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BackButton = ({ color = '#fff', size = 24 }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{ paddingHorizontal: 10, paddingVertical: 5 }}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default BackButton;
