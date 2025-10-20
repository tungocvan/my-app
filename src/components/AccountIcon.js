// src/components/AccountIcon.js
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { LOGOUT } from '../constants';

const AccountIcon = ({ hanldePress, isColor }) => {
  return (
    <Pressable style={styles.container} onPress={hanldePress}>
      <Ionicons name="person" size={LOGOUT.ICON_SIZE} color={isColor || LOGOUT.ICON_COLOR} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default AccountIcon;
