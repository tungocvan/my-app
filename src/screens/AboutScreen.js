import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SanPhamAboutScreenScreen() {
  return (
    <View className="flex-1 bg-[#e8f0ed]">
      {/* Header */}
      <View className="px-4 pt-12 pb-4 bg-[#e8f0ed]">
        <Text className="text-3xl font-bold text-gray-900">Sản phẩm</Text>

        {/* Search */}
        <View className="flex-row items-center bg-white rounded-full px-4 py-2 mt-4 shadow-sm">
          <Icon name="search" size={20} color="#4b5563" />
          <TextInput
            placeholder="Tìm kiếm sản phẩm"
            className="flex-1 ml-2 text-base text-gray-700"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 flex-row">
          {['Chuyển tiền', 'Dịch vụ thẻ', 'Tiết kiệm', 'Tiện ích cuộc sống'].map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`px-4 py-2 rounded-full mr-3 border 
                                ${index === 0 ? 'bg-white border-[#2f8f7f]' : 'bg-[#e8f0ed] border-gray-300'}`}
            >
              <Text
                className={`text-sm ${
                  index === 0 ? 'text-[#2f8f7f] font-semibold' : 'text-gray-600'
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="px-4">
        {/* -------- Chuyển tiền -------- */}
        <View className="bg-white rounded-2xl p-5 mt-2 mb-3">
          <Text className="text-xl font-bold text-gray-900 mb-4">Chuyển tiền</Text>

          <View className="flex-row justify-between">
            {[
              { title: 'Chuyển tiền', icon: 'swap-horizontal' },
              { title: 'Chuyển tiền định kỳ', icon: 'calendar' },
              { title: 'Chuyển tiền quốc tế', icon: 'globe-outline' },
            ].map((item, idx) => (
              <TouchableOpacity key={idx} className="items-center w-1/3">
                <View className="bg-[#eaf4ef] rounded-full p-4 mb-2">
                  <Icon name={item.icon} size={26} color="#22695c" />
                </View>
                <Text className="text-center text-gray-800 text-sm">{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* -------- Dịch vụ thẻ -------- */}
        <View className="bg-white rounded-2xl p-5 mt-2 mb-3">
          <Text className="text-xl font-bold text-gray-900 mb-4">Dịch vụ thẻ</Text>

          <View className="flex-row justify-between">
            {[
              { title: 'Danh sách thẻ', icon: 'card-outline' },
              { title: 'Apple Pay', icon: 'logo-apple' },
              { title: 'Phát hành thẻ', icon: 'card' },
            ].map((item, idx) => (
              <TouchableOpacity key={idx} className="items-center w-1/3">
                <View className="bg-[#eaf4ef] rounded-full p-4 mb-2">
                  <Icon name={item.icon} size={26} color="#22695c" />
                </View>
                <Text className="text-center text-gray-800 text-sm">{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* -------- Tiết kiệm -------- */}
        <View className="bg-white rounded-2xl p-5 mt-2 mb-10">
          <Text className="text-xl font-bold text-gray-900 mb-4">Tiết kiệm</Text>

          <View className="flex-row justify-between">
            {[
              { title: 'Tiền gửi Online', icon: 'wallet-outline' },
              { title: 'Chuyển nhượng tiền gửi Online', icon: 'cash-outline' },
            ].map((item, idx) => (
              <TouchableOpacity key={idx} className="items-center w-1/2">
                <View className="bg-[#eaf4ef] rounded-full p-4 mb-2">
                  <Icon name={item.icon} size={26} color="#22695c" />
                </View>
                <Text className="text-center text-gray-800 text-sm">{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
