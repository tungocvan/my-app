import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function AppButtons({ buttons = [], columns = 2 }) {
  const navigation = useNavigation();

  // Chia thành 2 hàng
  const row1 = buttons.filter((_, i) => i % 2 === 0);
  const row2 = buttons.filter((_, i) => i % 2 === 1);

  const renderItem = (item) => (
    <Pressable
      key={item.name}
      onPress={() => item.screen && navigation.navigate(item.screen)}
      className="w-32 h-28 bg-white rounded-2xl shadow mx-2 mb-4 items-center justify-center"
    >
      <Ionicons name={item.icon} size={28} color="#2563eb" />
      <Text className="mt-2 text-center text-[13px] font-medium text-gray-700">{item.name}</Text>
    </Pressable>
  );

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
        <View className="flex-col">
          {/* Hàng 1 */}
          <View className="flex-row mb-2">{row1.map(renderItem)}</View>

          {/* Hàng 2 */}
          <View className="flex-row">{row2.map(renderItem)}</View>
        </View>
      </ScrollView>
    </View>
  );
}
