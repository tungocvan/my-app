import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import axiosClient from '../api/axiosClient';

export default function CategoryGroups({ apiUrl }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchGroups = async () => {
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
        console.log('Lỗi khi gọi API:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [apiUrl]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );

  // 🧩 Chia danh sách thành 2 hàng
  const row1 = groups.filter((_, i) => i % 2 === 0);
  const row2 = groups.filter((_, i) => i % 2 !== 0);

  const renderItem = (item) => (
    <TouchableOpacity
      key={item.id ?? item.slug}
      style={styles.item}
      onPress={() =>
        navigation.navigate('ProductTab', {
          screen: 'ProductScreen',
          params: { slug: item.slug, name: item.name },
        })
      }
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={['#d1f7ff', '#f8e1ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.square}
      >
        <Ionicons name={item.icon || 'apps-outline'} size={26} color="#333" />
        <Text style={styles.itemText} numberOfLines={2}>
          {item.name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      {/* Tiêu đề nhóm thuốc có hiệu ứng nổi bật */}
      {parent?.name && (
        <LinearGradient
          colors={['#a8edea', '#fed6e3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.titleBadge}
        >
          <Text style={styles.title}>{parent.name}</Text>
        </LinearGradient>
      )}

      {/* Thẻ nhóm có viền gradient */}
      <LinearGradient
        colors={['#fdfbfb', '#ebedee']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardContainer}
      >
        <View style={styles.card}>
          {/* Dòng 1 */}
          <FlatList
            data={row1}
            horizontal
            keyExtractor={(item) => String(item.id ?? item.slug ?? item.name)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => renderItem(item)}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />

          {/* Dòng 2 */}
          <FlatList
            data={row2}
            horizontal
            keyExtractor={(item) => String(item.id ?? item.slug ?? item.name)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => renderItem(item)}
            contentContainerStyle={{ paddingHorizontal: 10, marginTop: 10 }}
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 12,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  item: {
    width: 90,
    alignItems: 'center',
    marginRight: 12,
  },
  square: {
    width: 90,
    height: 90,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 11,
    color: '#222',
    textAlign: 'center',
    marginTop: 6,
  },
  cardContainer: {
    borderRadius: 18,
    padding: 2, // viền gradient mảnh
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    marginLeft: 2,
  },
  titleGradient: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  titleBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
