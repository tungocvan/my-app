import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
// import LogoutButton from '../../components/LogoutButton';
import CartIcon from '../../components/CartIcon';
import BackButton from '../../components/BackButton';
import { useSidebar } from '../../context/SidebarContext';
import { HEADER } from '../../constants';
import HeaderSearchButton from '../../components/HeaderSearchButton'; // 👉 import component bạn vừa tạo

const StackHeader = ({
  title,
  showMenu,
  // showLogout,
  isText = false,
  isSearch = false,
  isCart = false,
  showBack = false,
  navigation,
}) => {
  const { setSidebarOpen } = useSidebar();

  // Tùy chọn justifyContent
  let justify = 'space-between';
  // if (showMenu && !showLogout) justify = 'flex-start';
  // if (!showMenu && showLogout) justify = 'flex-end';
  // if (!showMenu && !showLogout) justify = 'center';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, { justifyContent: justify }]}>
        {/* Menu Left */}
        {showBack && <BackButton />}
        {showMenu ? (
          <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.leftButton}>
            <Ionicons name="menu-outline" size={HEADER.ICON_SIZE} color={HEADER.ICON_COLOR} />
          </TouchableOpacity>
        ) : (
          <View style={styles.leftButton} />
        )}
        {/* Title hoặc Search Input */}
        {isSearch ? (
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <HeaderSearchButton
              placeholder="Tìm kiếm..."
              onPress={() => navigation.navigate('SearchTab')}
            />
          </View>
        ) : (
          title && <Text style={styles.title}>{title}</Text>
        )}
        {isCart && <CartIcon hanldePress={() => navigation.navigate('CartTab')} />}
        {/* Logout Right */}
        {/* {showLogout ? <LogoutButton isText={isText} /> : <View style={{ width: 40 }} />} */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    backgroundColor: HEADER.BG_COLOR,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
