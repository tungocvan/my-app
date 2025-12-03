import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const HeaderSearchButton = ({ placeholder = 'Tìm kiếm...', onPress }) => {
  return (
    <TouchableOpacity style={styles.wrapper} activeOpacity={0.7} onPress={onPress}>
      <Feather name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
      <Text style={styles.placeholder}>{placeholder}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 6,
    flex: 1,
    marginTop: 6,
  },
  placeholder: {
    color: '#9ca3af',
    fontSize: 14,
  },
});

export default HeaderSearchButton;
