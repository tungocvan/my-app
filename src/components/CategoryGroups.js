import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosClient from '../api/axiosClient';

export default function CategoryGroups({ apiUrl }) {
  const [groups, setGroups] = useState([]);
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigation = useNavigation();

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await axiosClient.post(apiUrl);
      const json = res.data;

      if (json?.data) {
        setParent(json.data);

        if (json.data.children) setGroups(json.data.children);
        else if (Array.isArray(json.data)) setGroups(json.data);
        else setGroups([json.data]);
      }
    } catch (err) {
      console.log('API Error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Loading
  if (loading)
    return (
      <View className="flex items-center justify-center py-8">
        <ActivityIndicator size="large" />
        <Text className="text-gray-500 mt-2">Đang tải dữ liệu...</Text>
      </View>
    );

  // Error
  if (error)
    return (
      <View className="flex items-center justify-center py-10">
        <Ionicons name="alert-circle" size={40} color="#ff4444" />
        <Text className="text-red-500 font-semibold mt-3">Không thể tải dữ liệu</Text>

        <TouchableOpacity
          className="flex-row items-center bg-blue-500 mt-4 px-4 py-2 rounded-lg"
          onPress={fetchGroups}
        >
          <Ionicons name="reload" size={18} color="#fff" />
          <Text className="text-white ml-2 font-semibold">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );

  // CHIA 2 HÀNG
  const row1 = groups.filter((_, i) => i % 2 === 0);
  const row2 = groups.filter((_, i) => i % 2 !== 0);

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id ?? item.slug}
      className="w-24 mr-3"
      onPress={() =>
        navigation.navigate('ProductTab', {
          screen: 'ProductScreen',
          params: { slug: item.slug, name: item.name },
        })
      }
      activeOpacity={0.85}
    >
      <View className="bg-gray-100 rounded-2xl w-24 h-24 flex items-center justify-center shadow-sm">
        <Ionicons name={item.icon || 'apps-outline'} size={28} color="#333" />
        <Text className="text-[11px] text-gray-800 mt-1 text-center" numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mx-3 mt-3">
      {/* Title */}
      {parent?.name && (
        <Text className="text-[17px] font-bold text-gray-800 mb-2 p-2">{parent.name}</Text>
      )}

      <View className="bg-white rounded-2xl p-3 shadow-sm">
        {/* Row 1 */}
        <FlatList
          data={row1}
          horizontal
          keyExtractor={(item) => String(item.id ?? item.slug ?? item.name)}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderItem(item)}
          contentContainerStyle={{ paddingRight: 10, paddingBottom: 5 }}
        />

        {/* Row 2 */}
        <FlatList
          data={row2}
          horizontal
          keyExtractor={(item) => String(item.id ?? item.slug ?? item.name)}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderItem(item)}
          contentContainerStyle={{
            paddingRight: 10,
            paddingBottom: 5,
            marginTop: 12,
          }}
        />
      </View>
    </View>
  );
}
