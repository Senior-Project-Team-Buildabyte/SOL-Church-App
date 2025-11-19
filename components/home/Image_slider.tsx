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
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchSliderImages, SliderImage } from "../../services/imageSlider";

const { width } = Dimensions.get("window");

const ImageSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState<SliderImage[]>([]);
  const scrollRef = useRef<ScrollView | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const sliderImages = await fetchSliderImages();
      setImages(sliderImages);
    };
    load();
  }, []);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    setActiveIndex(Math.round(x / width));
  };

  const scrollToIndex = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handlePress = (img: SliderImage) => {
    if (img.internalRoute) {
      router.push(img.internalRoute as any); // safe push
      return;
    }
    if (img.externalUrl) {
      Linking.openURL(img.externalUrl);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((img, index) => (
          <TouchableOpacity key={index} onPress={() => handlePress(img)}>
            <Image
              source={img.image}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.dotRow}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.dotActive,
            ]}
            onPress={() => scrollToIndex(index)}
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
  image: {
    width,
    height: 200,
  },
  dotRow: {
    position: "absolute",
    bottom: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#3498db",
  },
});

export default ImageSlider;
