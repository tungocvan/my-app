import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';

// Nếu dùng Expo:
import { Feather } from '@expo/vector-icons';
// Nếu không dùng Expo uncomment dòng dưới và comment dòng trên:
// import Feather from 'react-native-vector-icons/Feather';

const SearchInput = ({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm...',
  onClear,
  containerStyle,
  inputStyle,
  iconSize = 18,
  iconColor = '#6b7280',
  rounded = 8,
  showClear = true,
  ...props
}) => {
  return (
    <View style={[styles.wrapper, { borderRadius: rounded }, containerStyle]}>
      <Feather name="search" size={iconSize} color={iconColor} style={styles.leftIcon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={[styles.input, inputStyle]}
        returnKeyType="search"
        underlineColorAndroid="transparent"
        {...props}
      />
      {showClear && value ? (
        <TouchableOpacity
          onPress={() => {
            onChangeText?.('');
            onClear?.();
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.clearBtn}
        >
          <Feather name="x" size={iconSize} color={iconColor} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0, // padding handled by wrapper
    color: '#111827',
  },
  clearBtn: {
    marginLeft: 8,
    padding: 4,
  },
});

export default SearchInput;
