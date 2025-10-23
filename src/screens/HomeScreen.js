import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImageSlider from '../components/ImageSlider';
import CategoryGroups from '../components/CategoryGroups';
import { MEDICINE_GROUPS } from '../data/url';
import ProductPreview from '../components/ProductPreview';

const HomeScreen = () => {
  const navigation = useNavigation();

  const images = [
    'https://picsum.photos/id/1018/1200/600',
    'https://picsum.photos/id/1023/1200/600',
    'https://picsum.photos/id/1037/1200/600',
  ];

  // Dữ liệu giả để FlatList có thể hoạt động
  const data = [{ key: 'content' }];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.key}
      renderItem={() => (
        <View style={styles.content}>
          {/* 🔹 Banner */}
          <ImageSlider
            images={images}
            autoplay={true}
            autoplayInterval={2500}
            imageHeight={220}
            showDots={true}
          />

          {/* 🔹 Nhóm thuốc */}
          <View style={styles.section}>
            <CategoryGroups
              apiUrl={MEDICINE_GROUPS}
              itemSize={86}
              onPressGroup={(group) => {
                navigation.navigate('MedicineList', {
                  categorySlug: group.slug,
                  categoryId: group.id,
                });
              }}
            />
          </View>

          {/* 🔹 Danh sách sản phẩm mới */}
          <View style={styles.section}>
            <ProductPreview slug="nhom-thuoc" title="Sản phẩm mới về" />
          </View>
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  section: {
    marginVertical: 10,
  },
});
