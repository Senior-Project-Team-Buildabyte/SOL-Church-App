import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { fetchSliderImages, SliderImage } from "../../services/imageSlider";

const { width } = Dimensions.get("window");

const ImageSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [images, setImages] = useState<SliderImage[]>([]);
  const ScrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const sliderImages = await fetchSliderImages();
        setImages(sliderImages);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    loadImages();
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };

  const scrollToImage = (index: number): void => {
    if (ScrollViewRef.current && typeof ScrollViewRef.current.scrollTo === "function") {
      ScrollViewRef.current.scrollTo({ x: index * width, y: 0, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={ScrollViewRef}
        testID="slider-scrollview"
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {images.map((image, index) => (
          <Image
            key={`slider-${image.id}-${index}`}
            testID="slider-image"
            source={image.image}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={styles.toggleContainer}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={`dot-${index}`}
            testID="slider-dot"
            style={[
              styles.toggleItem,
              index === activeIndex && styles.activeToggleItem,
            ]}
            onPress={() => scrollToImage(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  scrollView: {
    width: "100%",
    height: 200,
  },
  image: {
    width,
    height: 200,
  },
  toggleContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  toggleItem: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 5,
  },
  activeToggleItem: {
    backgroundColor: "#3498db",
  },
});

export default ImageSlider;
