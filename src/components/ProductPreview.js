import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axiosClient from '../api/axiosClient';
import { MEDICINES } from '../data/url';
import ProductItem from './ProductItem';

export default function ProductPreview({ slug = '', title = 'Sản phẩm nổi bật', limit = 4 }) {
  const navigation = useNavigation();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const payload = slug ? { slug } : {};
      const res = await axiosClient.post(MEDICINES, payload);

      if (res?.data?.success && Array.isArray(res.data.data)) {
        setMedicines(res.data.data.slice(0, limit));
      } else setMedicines([]);
    } catch (error) {
      console.log('API Error:', error);
      setMedicines([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMedicines();
  }, [slug]);

  return (
    <View className="bg-white rounded-xl shadow-sm mt-3 pb-4">
      {/* HEADER */}
      <View className="flex-row justify-between items-center px-4 pt-4 mb-2">
        <Text className="text-[17px] font-bold text-gray-900">{title}</Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductTab', {
              screen: 'ProductScreen',
              params: { slug, name: title },
            })
          }
        >
          <Text className="text-blue-600 font-medium">Xem tất cả ›</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#22c55e" className="my-4" />
      ) : (
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 12 }}
          renderItem={({ item }) => <ProductItem item={item} />}
          scrollEnabled={false}
        />
      )}

      <TouchableOpacity
        className="self-center bg-blue-600 px-6 py-2 rounded-lg mt-3"
        onPress={() =>
          navigation.navigate('ProductTab', {
            screen: 'ProductScreen',
            params: { slug, name: title },
          })
        }
      >
        <Text className="text-white font-semibold">Xem tất cả</Text>
      </TouchableOpacity>
    </View>
  );
}
