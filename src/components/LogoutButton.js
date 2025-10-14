import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLogout } from '../hooks/useLogout';
import { LOGOUT } from '../constants';

const LogoutButton = ({ isText = true, isColor }) => {
  const logout = useLogout();

  return (
    <TouchableOpacity style={styles.button} onPress={logout}>
      <Ionicons
        name="log-out-outline"
        size={LOGOUT.ICON_SIZE}
        color={isColor || LOGOUT.ICON_COLOR}
      />
      {isText && (
        <Text
          style={{
            fontSize: 15,
            fontWeight: '500',
            marginLeft: 8,
            color: isColor || LOGOUT.ICON_COLOR,
          }}
        >
          Đăng xuất
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center' },
  text: { fontSize: 15, fontWeight: '500', marginLeft: 8 },
});

export default LogoutButton;
