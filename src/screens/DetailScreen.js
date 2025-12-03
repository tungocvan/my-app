import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const DetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params || {};

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="p-5">
        <Text className="text-3xl font-bold text-gray-900 text-center mb-2">Chi tiết sản phẩm</Text>
        <Text className="text-center text-gray-500 mb-6">Thông tin đầy đủ & trình bày rõ ràng</Text>

        {item ? (
          <View className="bg-white rounded-2xl shadow-sm p-5 space-y-6">
            {/* Tên sản phẩm */}
            <View className="border-b border-gray-200 pb-4">
              <Text className="text-gray-500 uppercase tracking-wide text-xs mb-1">
                Tên sản phẩm
              </Text>
              <Text className="text-xl font-semibold text-gray-900">{item.name}</Text>
            </View>

            {/* Mô tả */}
            <View className="border-b border-gray-200 pb-4">
              <Text className="text-gray-500 uppercase tracking-wide text-xs mb-1">
                Mô tả sản phẩm
              </Text>
              <Text className="text-gray-800 leading-relaxed text-base">
                {item.description || 'Không có mô tả.'}
              </Text>
            </View>

            {/* Giá */}
            <View>
              <Text className="text-gray-500 uppercase tracking-wide text-xs mb-1">Giá bán</Text>
              <View className="flex-row items-end">
                <Text className="text-green-600 text-3xl font-bold">
                  {item.price ? `${item.price} đ` : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text className="text-gray-400 text-center text-lg mt-10">
            Không có dữ liệu sản phẩm.
          </Text>
        )}
      </ScrollView>

      {/* Footer button */}
      <View className="p-4 bg-white shadow-inner">
        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl items-center"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-semibold text-lg">⬅ Quay lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailScreen;
