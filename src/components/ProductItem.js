import React, { useState } from 'react';
import { View, Text, Image, Pressable, TouchableOpacity, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { addToCart } from '../redux/slices/cartSlice';
import { BASE_URL_IMG } from '../data/url';

export default function ProductItem({ item }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(0);
  const [favorite, setFavorite] = useState(false);

  const scaleAnim = useState(new Animated.Value(1))[0];

  const onPressHeart = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    setFavorite((prev) => !prev);
  };

  // Tính giảm giá
  const discountPercent =
    item.gia_ke_khai && item.don_gia && item.don_gia < item.gia_ke_khai
      ? Math.round(((item.gia_ke_khai - item.don_gia) / item.gia_ke_khai) * 100)
      : 0;

  const hasDiscount = discountPercent > 0;

  const handleAddToCart = () => {
    if (quantity > 0) {
      dispatch(
        addToCart({
          id: item.id,
          name: item.ten_biet_duoc,
          dvt: item.don_vi_tinh,
          quycach: item.quy_cach_dong_goi,
          image: item.link_hinh_anh,
          price: item.don_gia > 0 ? item.don_gia : item.gia_ke_khai,
          quantity,
        }),
      );
      setQuantity(0);
    }
  };

  return (
    <View className="bg-white rounded-xl p-3 w-[48%] shadow-sm mb-4">
      {/* TOP ROW */}
      <View className="flex-row justify-between items-center mb-1">
        {hasDiscount && (
          <View className="bg-red-500 rounded px-1.5 py-0.5">
            <Text className="text-white text-[10px] font-bold">-{discountPercent}%</Text>
          </View>
        )}

        <Pressable onPress={onPressHeart}>
          <Animated.View
            style={{ transform: [{ scale: scaleAnim }] }}
            className={`w-7 h-7 rounded-full items-center justify-center ${
              favorite ? 'bg-red-500' : 'bg-gray-200'
            }`}
          >
            <AntDesign name="heart" size={16} color={favorite ? 'white' : 'gray'} />
          </Animated.View>
        </Pressable>
      </View>

      {/* IMAGE */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ProductDetail', { medicine: item })}
      >
        <Image
          source={{ uri: `${BASE_URL_IMG}/${item.link_hinh_anh || 'images/no-image.png'}` }}
          className="w-full aspect-square rounded-lg bg-gray-100"
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* PRICE */}
      <View className="flex-row items-center mt-2">
        <Text className="text-red-500 font-bold text-[15px] mr-2">
          {Number(item.don_gia || item.gia_ke_khai).toLocaleString('vi-VN')}đ
        </Text>

        {hasDiscount && (
          <Text className="text-gray-400 line-through text-[11px]">
            {Number(item.gia_ke_khai).toLocaleString('vi-VN')}đ
          </Text>
        )}
      </View>

      {/* TITLE */}
      <Text className="text-[13px] font-medium text-gray-800 mt-1 mb-2" numberOfLines={2}>
        {item.ten_biet_duoc}
      </Text>

      {/* QUANTITY CONTROL */}
      <View className="flex-row border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        <Pressable
          className="flex-1 items-center justify-center py-2 bg-red-50"
          onPress={() => setQuantity((q) => Math.max(0, q - 1))}
        >
          <Text className="text-gray-800 font-bold">-</Text>
        </Pressable>

        <View className="flex-1 items-center justify-center">
          <Text className="font-bold">{quantity}</Text>
        </View>

        <Pressable
          className="flex-1 items-center justify-center py-2 bg-green-50"
          onPress={() => setQuantity((q) => q + 1)}
        >
          <Text className="text-gray-800 font-bold">+</Text>
        </Pressable>
      </View>

      {/* ADD TO CART */}
      {quantity > 0 && (
        <Pressable
          className="bg-blue-600 rounded-lg py-2 mt-3 items-center"
          onPress={handleAddToCart}
        >
          <Text className="text-white font-semibold text-[13px]">Thêm vào giỏ</Text>
        </Pressable>
      )}
    </View>
  );
}
