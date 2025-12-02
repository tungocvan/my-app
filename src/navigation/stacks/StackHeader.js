import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import CartIcon from '../../components/CartIcon';
import AccountIcon from '../../components/AccountIcon';
import BackButton from '../../components/BackButton';
import AlertIcon from '../../components/AlertIcon';
import HeaderSearchButton from '../../components/HeaderSearchButton';
import { useSidebar } from '../../context/SidebarContext';
import { HEADER } from '../../constants';

const StackHeader = ({
  title,
  showMenu,
  isText = false,
  isSearch = false,
  isCart = false,
  showBack = false,
  showAlert = false,
  showAccount = false,
  navigation,
}) => {
  const { setSidebarOpen } = useSidebar();

  return (
    <SafeAreaView style={{ backgroundColor: HEADER.BG_COLOR }}>
      <View
        className={`
          flex-row items-end px-3
          h-[${HEADER.HEIGHT}px]
          justify-between
        `}
        style={{ height: HEADER.HEIGHT, backgroundColor: HEADER.BG_COLOR }}
      >
        {/* Left section */}
        <View className="w-10 items-center justify-center">
          {showBack ? (
            <BackButton />
          ) : showMenu ? (
            <TouchableOpacity
              onPress={() => setSidebarOpen(true)}
              className="items-center justify-center"
            >
              <Ionicons name="menu-outline" size={HEADER.ICON_SIZE} color={HEADER.ICON_COLOR} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Center content */}
        <View className="flex-1 mx-2">
          {isSearch ? (
            <HeaderSearchButton
              placeholder="Tìm sản phẩm..."
              onPress={() => navigation.navigate('MedicineTab')}
            />
          ) : (
            title && (
              <Text
                className="
                  text-center text-[18px] font-semibold
                  text-gray-900
                "
              >
                {title}
              </Text>
            )
          )}
        </View>

        {/* Right section */}
        <View className="flex-row items-center">
          {showAlert && <AlertIcon hanldePress={() => navigation.navigate('AlertTab')} />}

          {isCart && <CartIcon hanldePress={() => navigation.navigate('CartTab')} />}

          {showAccount && <AccountIcon hanldePress={() => navigation.navigate('ProfileTab')} />}

          {/* Nếu không có icon nào, giữ kích thước đảm bảo layout cân đối */}
          {!showAlert && !isCart && !showAccount && <View className="w-10" />}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StackHeader;
