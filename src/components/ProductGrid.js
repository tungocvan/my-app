// components/ProductGrid.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const GAP = 16;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

const productsData = [
  {
    id: '1',
    title: 'Áo Thun Nam Trắng',
    regular_price: 200000,
    sale_price: 150000,
    image: 'https://picsum.photos/id/1011/300/300',
  },
  {
    id: '2',
    title: 'Giày Thể Thao Nữ',
    regular_price: 500000,
    sale_price: 500000,
    image: 'https://picsum.photos/id/1025/300/300',
  },
  {
    id: '3',
    title: 'Balo Du Lịch',
    regular_price: 350000,
    sale_price: 300000,
    image: 'https://picsum.photos/id/1040/300/300',
  },
  {
    id: '4',
    title: 'Đồng Hồ Nam',
    regular_price: 800000,
    sale_price: 650000,
    image: 'https://picsum.photos/id/1050/300/300',
  },
];

const ProductItem = ({ item }) => {
  const [quantity, setQuantity] = useState(0);
  const [favorite, setFavorite] = useState(false);

  // animation scale khi nhấn
  const scaleAnim = useState(new Animated.Value(1))[0];

  const onPressHeart = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setFavorite(!favorite);
  };

  const discountPercent = Math.round(
    ((item.regular_price - item.sale_price) / item.regular_price) * 100,
  );

  return (
    <View style={styles.itemContainer}>
      {/* Dòng 1: KM % + Yêu thích */}
      <View style={styles.rowTop}>
        {/* Badge KM chỉ hiển thị nếu >0% */}
        {discountPercent > 0 && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoText}>{discountPercent}%</Text>
          </View>
        )}

        {/* Trái tim luôn ở góc phải */}
        <Pressable onPress={onPressHeart}>
          <Animated.View
            style={[
              styles.heartButton,
              {
                backgroundColor: favorite ? 'red' : 'transparent',
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <AntDesign name="heart" size={18} color={favorite ? 'white' : 'gray'} />
          </Animated.View>
        </Pressable>
      </View>

      {/* Hình ảnh vuông 1:1 */}
      <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />

      {/* Giá */}
      <View style={styles.rowPrice}>
        <Text style={styles.salePrice}>{item.sale_price.toLocaleString()}đ</Text>
        <Text style={styles.regularPrice}>{item.regular_price.toLocaleString()}đ</Text>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      {/* Số lượng full-width, nền trắng, border mỏng */}
      <View style={styles.rowQuantity}>
        <Pressable
          style={[styles.qtyButton, styles.qtyMinus]}
          onPress={() => setQuantity((prev) => Math.max(0, prev - 1))}
          android_ripple={{ color: '#ccc' }}
        >
          <Text style={styles.qtyButtonText}>-</Text>
        </Pressable>

        <View style={styles.qtyDisplay}>
          <Text style={styles.qtyText}>{quantity}</Text>
        </View>

        <Pressable
          style={[styles.qtyButton, styles.qtyPlus]}
          onPress={() => setQuantity((prev) => prev + 1)}
          android_ripple={{ color: '#ccc' }}
        >
          <Text style={styles.qtyButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const ProductGrid = () => {
  return (
    <FlatList
      data={productsData}
      keyExtractor={(item) => item.id}
      numColumns={NUM_COLUMNS}
      columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: GAP }}
      contentContainerStyle={{ padding: GAP }}
      renderItem={({ item }) => <ProductItem item={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: ITEM_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between', // luôn đẩy trái tim sang phải
    alignItems: 'center',
    marginBottom: 4,
  },

  promoBadge: {
    backgroundColor: 'red',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  promoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1, // vuông 1:1
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    marginBottom: 6,
  },
  rowPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  salePrice: {
    color: 'red',
    fontWeight: 'bold',
    marginRight: 8,
  },
  regularPrice: {
    color: '#999',
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  rowQuantity: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd', // border mỏng
    backgroundColor: '#fafafa', // nền trắng nhẹ
    overflow: 'hidden',
  },
  qtyButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  qtyMinus: {
    backgroundColor: '#ffebee', // màu nổi bật cho nút -
  },
  qtyPlus: {
    backgroundColor: '#e8f5e9', // màu nổi bật cho nút +
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  qtyDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
