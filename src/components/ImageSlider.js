import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ImageSlider({
  images = [], // mảng 3 link ảnh: ['https://...', ...]
  autoplay = true,
  autoplayInterval = 3000, // ms
  imageHeight = 200,
  showDots = true,
}) {
  const flatListRef = useRef(null);
  const timerRef = useRef(null);
  const currentIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTouched, setIsTouched] = useState(false);

  // bảo đảm có ít nhất 1 ảnh
  const data = images && images.length ? images : [];

  // start autoplay
  useEffect(() => {
    if (!autoplay || data.length <= 1) return;
    startAutoPlay();
    return () => stopAutoPlay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, data.length, autoplayInterval]);

  const startAutoPlay = () => {
    stopAutoPlay();
    timerRef.current = setInterval(() => {
      if (isTouched) return; // nếu đang tương tác thì tạm dừng
      const nextIndex = (currentIndexRef.current + 1) % data.length;
      scrollToIndex(nextIndex);
    }, autoplayInterval);
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const scrollToIndex = (index) => {
    if (!flatListRef.current || data.length === 0) return;
    currentIndexRef.current = index;
    setActiveIndex(index);
    flatListRef.current.scrollToIndex({ index, animated: true });
  };

  // cập nhật active index khi cuộn kết thúc
  const onMomentumScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    currentIndexRef.current = index;
    setActiveIndex(index);
  };

  // handlers touch để pause/resume autoplay
  const handleTouchStart = () => {
    setIsTouched(true);
    stopAutoPlay();
  };
  const handleTouchEnd = () => {
    setIsTouched(false);
    if (autoplay && data.length > 1) {
      // restart autoplay after tương tác
      startAutoPlay();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableWithoutFeedback>
      <Image
        source={{ uri: item }}
        style={[styles.image, { height: imageHeight, width: SCREEN_WIDTH }]}
        resizeMode="cover"
      />
    </TouchableWithoutFeedback>
  );

  // bảo toàn index khi FlatList render lần đầu (khỏi lỗi)
  const getItemLayout = (_, index) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(_, idx) => String(idx)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollToIndexFailed={() => {}}
        getItemLayout={getItemLayout}
        initialNumToRender={data.length}
        removeClippedSubviews={true}
        // touch handlers để pause autoplay
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onResponderTerminate={handleTouchEnd}
        // Android: đôi khi cần onScrollBeginDrag/onScrollEndDrag
        onScrollBeginDrag={handleTouchStart}
        onScrollEndDrag={handleTouchEnd}
      />

      {showDots && data.length > 1 && (
        <View style={styles.dotsContainer}>
          {data.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, activeIndex === i ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: SCREEN_WIDTH,
    backgroundColor: '#eee',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: Platform.select({ ios: 12, android: 8 }),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: '#fff',
    opacity: 0.95,
  },
  dotInactive: {
    backgroundColor: '#fff',
    opacity: 0.45,
  },
});
