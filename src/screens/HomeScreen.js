// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../data/fonts';
import ImageSlider from '../components/ImageSlider';
import CategoryGroups from '../components/CategoryGroups';
import { MEDICINE_GROUPS } from '../data/url';

const HomeScreen = () => {
  const images = [
    'https://picsum.photos/id/1018/1200/600',
    'https://picsum.photos/id/1023/1200/600',
    'https://picsum.photos/id/1037/1200/600',
  ];

  return (
    <View style={styles.container}>
      <View>
        <ImageSlider
          images={images}
          autoplay={true}
          autoplayInterval={2500}
          imageHeight={220}
          showDots={true}
        />
      </View>
      <CategoryGroups
        apiUrl={MEDICINE_GROUPS} // POST: https://adminlt.tungocvan.com/api/categories/nhom-thuoc
        itemSize={86}
        onPressGroup={(group) => {
          navigation.navigate('MedicineList', {
            categorySlug: group.slug,
            categoryId: group.id,
          });
        }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: Fonts.regular,
  },
});
