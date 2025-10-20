import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchInput({ placeholder = 'Tìm kiếm...', onSearch }) {
  const [query, setQuery] = useState('');
  const [inputAnim] = useState(new Animated.Value(0));

  // Hiệu ứng khi nhập
  useEffect(() => {
    Animated.timing(inputAnim, {
      toValue: query.length > 0 ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [query]);

  // Tự động gọi tìm kiếm khi đủ 3 ký tự
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 3) {
        onSearch(query.trim());
      } else if (query.length === 0) {
        onSearch(''); // reset
      }
    }, 400); // debounce nhẹ tránh spam API
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <View style={styles.container}>
      {/* Icon tìm kiếm */}
      <Ionicons name="search" size={20} color="#777" style={styles.iconLeft} />

      {/* Ô nhập */}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={query}
        onChangeText={setQuery}
      />

      {/* Nút X để xóa */}
      {query.length > 0 && (
        <Animated.View style={[styles.clearWrapper, { opacity: inputAnim }]}>
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    elevation: 2,
    marginHorizontal: 10,
    marginVertical: 8,
    height: 44,
  },
  iconLeft: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 6,
  },
  clearWrapper: {
    marginLeft: 4,
  },
});
