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
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { BASE_URL_IMG } from '../data/url';

const { width } = Dimensions.get('window');
const GAP = 16;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

const ProductItem = ({ item }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  // Hiệu ứng trái tim
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

  // ✅ Chỉ tính % giảm khi sale_price < regular_price
  const discountPercent =
    item.sale_price < item.regular_price
      ? Math.round(((item.regular_price - item.sale_price) / item.regular_price) * 100)
      : 0;

  const hasDiscount = discountPercent > 0;

  const handleAddToCart = () => {
    if (quantity > 0) {
      dispatch(
        addToCart({
          id: item.id,
          name: item.title,
          image: item.image,
          price: item.sale_price < item.regular_price ? item.sale_price : item.regular_price,
          quantity,
        }),
      );
      setQuantity(0);
    }
  };

  return (
    <View style={styles.itemContainer}>
      {/* Dòng 1: KM % + Yêu thích */}
      <View style={styles.rowTop}>
        {hasDiscount && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoText}>-{discountPercent}%</Text>
          </View>
        )}
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

      {/* Ảnh sản phẩm */}
      <Image
        source={{ uri: BASE_URL_IMG + '/' + item.image }}
        style={styles.productImage}
        resizeMode="cover"
      />

      {/* 💰 Giá sản phẩm */}
      {hasDiscount ? (
        <View style={styles.rowPrice}>
          <Text style={styles.salePrice}>{Number(item.sale_price).toLocaleString('vi-VN')}đ</Text>
          <Text style={styles.regularPrice}>
            {Number(item.regular_price).toLocaleString('vi-VN')}đ
          </Text>
        </View>
      ) : (
        <View style={styles.rowPrice}>
          <Text style={[styles.salePrice, { color: '#333' }]}>
            {Number(item.regular_price).toLocaleString('vi-VN')}đ
          </Text>
        </View>
      )}

      {/* Tên sản phẩm */}
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>

      {/* Bộ đếm số lượng */}
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

      {/* Nút Thêm vào giỏ */}
      {quantity > 0 && (
        <Pressable style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
        </Pressable>
      )}
    </View>
  );
};

export const ProductGrid = ({ productsData = [] }) => {
  return (
    <FlatList
      data={productsData}
      keyExtractor={(item) => item.id.toString()}
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
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  promoBadge: {
    backgroundColor: 'red',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  promoText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  heartButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
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
    fontSize: 15,
    marginRight: 6,
  },
  regularPrice: {
    color: '#999',
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#222',
  },
  rowQuantity: {
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  qtyButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  qtyMinus: {
    backgroundColor: '#ffebee',
  },
  qtyPlus: {
    backgroundColor: '#e8f5e9',
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
    color: '#000',
  },
  addButton: {
    marginTop: 8,
    backgroundColor: '#2563eb',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ProductGrid;
