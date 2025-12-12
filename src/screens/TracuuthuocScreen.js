import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function TracuuthuocScreen() {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!keyword.trim()) {
      setError('Vui lòng nhập từ khóa');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const bodyData = [
        {
          pageSize: 20,
          pageNumber: 0,
          query: [
            {
              index: 'es-smart-pricing',
              keyWord: keyword,
              keyWordNotMatch: '',
              matchType: 'exact',
              matchFields: ['ten_thuoc', 'ten_hoat_chat', 'ma_tbmt'],
              filters: [
                { fieldName: 'medicines', searchType: 'in', fieldValues: ['0'] },
                { fieldName: 'type', searchType: 'in', fieldValues: ['HANG_HOA'] },
                { fieldName: 'tab', searchType: 'in', fieldValues: ['THUOC_TAN_DUOC'] },
              ],
            },
          ],
        },
      ];

      const res = await axios.post(
        'https://muasamcong.mpi.gov.vn/o/egp-portal-personal-page/services/smart/search_prc',
        bodyData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );

      const content = res?.data?.page?.content || [];
      setData(content);
    } catch (e) {
      console.log('API ERROR:', e);
      setError('Không thể kết nối hệ thống!');
    }

    setLoading(false);
  };

  const clearInput = () => {
    setKeyword('');
    setData([]);
  };

  const copyMaTBMT = (ma) => {
    Clipboard.setString(ma);
    Alert.alert('Đã sao chép!', `Mã TBMT: ${ma}`);
  };

  const renderItem = ({ item }) => (
    <View className="bg-white p-4 mb-4 rounded-2xl shadow shadow-black/10 border border-gray-200">
      <Text className="text-xl font-semibold text-blue-700">{item.tenThuoc}</Text>
      <Text className="text-sm text-gray-600 mb-2">{item.tenHoatChat}</Text>

      <Text className="text-gray-800">
        <Text className="font-semibold">Đơn giá:</Text> {item.donGia?.toLocaleString()} đ
      </Text>
      <Text className="text-gray-800">
        <Text className="font-semibold">Hàm lượng:</Text> {item.nongDo}
      </Text>
      <Text className="text-gray-800">
        <Text className="font-semibold">Nhóm thuốc:</Text> {item.nhomThuoc}
      </Text>
      <Text className="text-gray-800">
        <Text className="font-semibold">Số lượng:</Text> {item.soLuong}
      </Text>
      <Text className="text-gray-800">
        <Text className="font-semibold">Số quyết định:</Text> {item.soQuyetDinh}
      </Text>
      <Text className="text-gray-800">
        <Text className="font-semibold">Ngày ban hành:</Text>{' '}
        {formatDate(item.ngayBanHanhQuyetDinh)}
      </Text>
      <Text className="text-gray-800">
        <Text className="font-semibold">Mã TBMT:</Text> {item.maTbmt}
      </Text>

      <View className="flex-row justify-between mt-3">
        <TouchableOpacity
          onPress={() => copyMaTBMT(item.maTbmt)}
          className="bg-blue-600 px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-semibold">Copy Mã TBMT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert('Xoá', 'Bạn có thể tự xử lý logic xoá nếu muốn.')}
          className="bg-red-500 px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-semibold">X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-5">
      <Text className="text-2xl font-bold mb-4 text-blue-800">Tra cứu thuốc</Text>

      {/* input + nút xoá */}
      <View className="flex-row items-center bg-white border border-gray-300 rounded-xl px-3">
        <TextInput
          className="flex-1 h-12"
          placeholder="Nhập từ khóa, tên thuốc, hoạt chất, Mã TBMT"
          value={keyword}
          onChangeText={setKeyword}
        />
        {keyword.length > 0 && (
          <TouchableOpacity onPress={clearInput} className="px-2">
            <Text className="text-xl text-gray-600">✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        className="h-12 bg-blue-600 rounded-xl justify-center items-center mt-3"
        onPress={search}
      >
        <Text className="text-white font-semibold text-lg">Tìm kiếm</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" className="mt-5" />}

      {error ? <Text className="text-red-600 mt-3">{error}</Text> : null}

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        className="mt-4"
        ListEmptyComponent={
          !loading && <Text className="text-center text-gray-600 mt-10">Không có kết quả</Text>
        }
      />
    </View>
  );
}
