import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosClient from '../api/axiosClient';

/**
 * Component hiển thị danh sách nhóm thuốc (category groups)
 * Gọi API POST (axiosClient) → trả về danh sách con (children)
 *
 * Props:
 * - apiUrl (string): endpoint, ví dụ: '/categories/nhom-thuoc'
 * - onPressGroup (function): callback khi nhấn group
 * - itemSize (number): kích thước nút vuông (mặc định 84)
 * - horizontalPadding (number): khoảng cách lề ngang (mặc định 12)
 */
export default function CategoryGroups({
  apiUrl,
  onPressGroup = () => {},
  itemSize = 84,
  horizontalPadding = 12,
}) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🚀 POST request thay vì GET
        const res = await axiosClient.post(apiUrl);
        const json = res.data;

        let items = [];
        if (json && json.data) {
          if (Array.isArray(json.data)) {
            items = json.data;
          } else if (json.data.children && Array.isArray(json.data.children)) {
            items = json.data.children;
          } else {
            items = [json.data];
          }
        }

        if (mounted) setGroups(items);
      } catch (err) {
        console.log('❌ Axios Error:', err);
        if (mounted) {
          const msg =
            err.response?.data?.message || err.message || 'Không thể tải dữ liệu nhóm thuốc';
          setError(msg);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchGroups();
    return () => {
      mounted = false;
    };
  }, [apiUrl]);

  const renderItem = ({ item }) => {
    const iconName = item.icon || 'apps-outline';
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.itemContainer, { width: itemSize, height: itemSize + 28 }]}
        onPress={() => {
          try {
            onPressGroup(item);
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }}
      >
        <View style={[styles.square, { width: itemSize, height: itemSize }]}>
          <Ionicons name={iconName} size={itemSize * 0.45} color="#333" />
        </View>
        <Text numberOfLines={2} style={styles.itemText}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { padding: horizontalPadding }]}>
        <Text style={{ color: 'red', marginBottom: 8 }}>Lỗi: {error}</Text>
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            setError(null);
          }}
          style={styles.reloadBtn}
        >
          <Text style={{ color: '#fff' }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Không có nhóm nào.</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: horizontalPadding }}>
      <FlatList
        data={groups}
        horizontal
        keyExtractor={(item) => String(item.id ?? item.slug ?? item.name)}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 6 }}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  itemContainer: {
    alignItems: 'center',
  },
  square: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    backgroundColor: '#fff',
  },
  itemText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
    width: '100%',
  },
  reloadBtn: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
});
