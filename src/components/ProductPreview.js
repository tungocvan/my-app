// src/components/ProductPreview.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { addToCart } from '../redux/slices/cartSlice';
import axiosClient from '../api/axiosClient';
import { MEDICINES, BASE_URL_IMG } from '../data/url';

const { width } = Dimensions.get('window');
const GAP = 16;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS + 20;

const ProductItem = ({ item }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(0);
  const [favorite, setFavorite] = useState(false);
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
    setFavorite((prev) => !prev);
  };

  // tính discount (nếu có)
  const discountPercent =
    item.gia_ke_khai && item.don_gia && item.don_gia < item.gia_ke_khai
      ? Math.round(((item.gia_ke_khai - item.don_gia) / item.gia_ke_khai) * 100)
      : 0;

  const hasDiscount = discountPercent > 0;

  const handleAddToCart = () => {
    if (quantity > 0) {
      const itemAdd = {
        id: item.id,
        name: item.ten_biet_duoc,
        dvt: item.don_vi_tinh,
        quycach: item.quy_cach_dong_goi,
        image: item.link_hinh_anh,
        // chọn giá: don_gia nếu có, ngược lại lấy gia_ke_khai
        price:
          typeof item.don_gia === 'number' && item.don_gia > 0
            ? item.don_gia
            : item.gia_ke_khai || 0,
        quantity,
      };
      dispatch(addToCart(itemAdd));
      setQuantity(0);
    }
  };

  return (
    <View style={styles.itemContainer}>
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

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ProductDetail', { medicine: item })}
      >
        <Image
          source={{ uri: `${BASE_URL_IMG}/${item.link_hinh_anh || 'images/no-image.png'}` }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.rowPrice}>
        <Text style={hasDiscount ? styles.salePrice : [styles.salePrice, { color: '#333' }]}>
          {Number(item.don_gia || item.gia_ke_khai || 0).toLocaleString('vi-VN')}đ
        </Text>
        {hasDiscount && (
          <Text style={styles.regularPrice}>
            {Number(item.gia_ke_khai).toLocaleString('vi-VN')}đ
          </Text>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {item.ten_biet_duoc}
      </Text>

      <View style={styles.rowQuantity}>
        <Pressable
          style={[styles.qtyButton, styles.qtyMinus]}
          onPress={() => setQuantity((prev) => Math.max(0, prev - 1))}
        >
          <Text style={styles.qtyButtonText}>-</Text>
        </Pressable>

        <View style={styles.qtyDisplay}>
          <Text style={styles.qtyText}>{quantity}</Text>
        </View>

        <Pressable
          style={[styles.qtyButton, styles.qtyPlus]}
          onPress={() => setQuantity((prev) => prev + 1)}
        >
          <Text style={styles.qtyButtonText}>+</Text>
        </Pressable>
      </View>

      {quantity > 0 && (
        <Pressable style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
        </Pressable>
      )}
    </View>
  );
};

const ProductPreview = ({ slug = '', title = 'Sản phẩm nổi bật', limit = 4 }) => {
  const navigation = useNavigation();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedicines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      // nếu MEDICINES là path như '/medicines', axiosClient sẽ ghép baseURL
      const payload = slug ? { slug } : {};
      const res = await axiosClient.post(MEDICINES, payload);
      if (res?.data?.success && Array.isArray(res.data.data)) {
        setMedicines(res.data.data.slice(0, limit));
      } else {
        setMedicines([]);
      }
    } catch (error) {
      console.error('Lỗi gọi API:', error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={previewStyles.container}>
      <View style={previewStyles.headerRow}>
        <Text style={previewStyles.headerText}>{title}</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductTab', {
              screen: 'ProductScreen',
              params: { slug: 'nhom-thuoc', name: 'Sản phẩm mới về' },
            })
          }
        >
          <Text style={previewStyles.viewAll}>Xem tất cả ›</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#16A34A" style={{ marginVertical: 16 }} />
      ) : (
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id.toString()}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: GAP }}
          contentContainerStyle={{ paddingHorizontal: GAP / 2 }}
          renderItem={({ item }) => <ProductItem item={item} />}
          scrollEnabled={false} // vì đặt trong ScrollView cha
        />
      )}

      <TouchableOpacity
        style={previewStyles.viewAllButton}
        onPress={() =>
          navigation.navigate('ProductTab', {
            screen: 'ProductScreen',
            params: { slug: 'nhom-thuoc', name: 'Sản phẩm mới về' },
          })
        }
      >
        <Text style={previewStyles.viewAllText}>Xem tất cả</Text>
      </TouchableOpacity>
    </View>
  );
};

const previewStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginVertical: 8,
    paddingTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  viewAll: {
    color: '#16A34A',
    fontWeight: '600',
  },
  viewAllButton: {
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  viewAllText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

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

export default ProductPreview;
