import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoutButton from '../../components/LogoutButton';
import { useSidebar } from '../../context/SidebarContext';
import { HEADER } from '../../constants';

const StackHeader = ({ title, showMenu = true, showLogout = true, isText = false }) => {
  const { setSidebarOpen } = useSidebar();

  // Tùy chọn justifyContent
  let justify = 'space-between';
  if (showMenu && !showLogout) justify = 'flex-start';
  if (!showMenu && showLogout) justify = 'flex-end';
  if (!showMenu && !showLogout) justify = 'center';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, { justifyContent: justify }]}>
        {/* Menu Left */}
        {showMenu ? (
          <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.leftButton}>
            <Ionicons name="menu-outline" size={HEADER.ICON_SIZE} color={HEADER.ICON_COLOR} />
          </TouchableOpacity>
        ) : (
          <View style={styles.leftButton} />
        )}

        {/* Title */}
        {title ? <Text style={styles.title}>{title}</Text> : null}

        {/* Logout Right */}
        {showLogout ? <LogoutButton isText={isText} /> : <View style={{ width: 40 }} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    backgroundColor: HEADER.BG_COLOR, // trùng với header
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: HEADER.HEIGHT,
  },
  leftButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
    color: HEADER.TITLE_COLOR,
  },
});

export default StackHeader;
