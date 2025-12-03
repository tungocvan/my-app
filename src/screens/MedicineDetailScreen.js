import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { BASE_URL_IMG, MEDICINES } from '../data/url';
import axiosClient from '../api/axiosClient';

export default function MedicineDetailScreen({ route }) {
  const { medicine_id } = route.params;
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await axiosClient.post(MEDICINES, {
          id: medicine_id,
          fields: [
            'id',
            'ten_biet_duoc',
            'ten_hoat_chat',
            'nong_do_ham_luong',
            'dang_bao_che',
            'duong_dung',
            'co_so_san_xuat',
            'nuoc_san_xuat',
            'han_dung',
            'don_gia',
            'link_hinh_anh',
          ],
        });

        if (res.data?.success && res.data.data?.length > 0) {
          setMedicine(res.data.data[0]);
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết thuốc:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [medicine_id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-3 text-gray-600">Đang tải thông tin thuốc...</Text>
      </View>
    );
  }

  if (!medicine) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-600">Không tìm thấy thông tin thuốc.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="w-full h-64 rounded-3xl bg-gray-100 items-center justify-center shadow-lg mb-6">
        {medicine.link_hinh_anh ? (
          <Image
            source={{ uri: `${BASE_URL_IMG}/${medicine.link_hinh_anh}` }}
            className="w-[92%] h-[92%] rounded-2xl"
            resizeMode="contain"
          />
        ) : (
          <Text className="text-gray-500">Không có hình ảnh</Text>
        )}
      </View>

      {/* Tên thuốc */}
      <Text className="text-2xl font-bold text-gray-900">{medicine.ten_biet_duoc}</Text>

      {/* Giá */}
      <Text className="text-xl font-semibold text-blue-600 mt-1 mb-4">
        {medicine.don_gia ? `${medicine.don_gia.toLocaleString('vi-VN')} ₫` : 'Chưa có giá'}
      </Text>

      {/* Thông tin chi tiết */}
      <View className="bg-gray-50 p-4 rounded-2xl shadow-sm space-y-4">
        <InfoRow label="Hoạt chất" value={medicine.ten_hoat_chat} />
        <InfoRow label="Hàm lượng" value={medicine.nong_do_ham_luong} />
        <InfoRow label="Dạng bào chế" value={medicine.dang_bao_che} />
        <InfoRow label="Đường dùng" value={medicine.duong_dung} />
        <InfoRow label="Cơ sở sản xuất" value={medicine.co_so_san_xuat} />
        <InfoRow label="Nước sản xuất" value={medicine.nuoc_san_xuat} />
        <InfoRow label="Hạn dùng" value={medicine.han_dung} />
      </View>
    </ScrollView>
  );
}

/* Component con để gọn code */
function InfoRow({ label, value }) {
  return (
    <View>
      <Text className="text-gray-500 text-sm font-medium">{label}</Text>
      <Text className="text-gray-900 text-base mt-0.5">{value || '-'}</Text>
    </View>
  );
}
