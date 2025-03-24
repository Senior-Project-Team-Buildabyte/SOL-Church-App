import React, {useState,useRef, useEffect} from "react";
import {View, Text,Image, StyleSheet, ScrollView,TouchableOpacity,Dimensions,NativeSyntheticEvent,NativeScrollEvent} from "react-native";
import{fetchSliderImages, SliderImage} from '../../services/imageSlider';

const {width} = Dimensions.get("window");

const ImageSlider: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [images, setImages] = useState<SliderImage[]>([]);
    const ScrollViewRef = useRef<ScrollView | null>(null);

    useEffect(() => {
        const loadImages = async () => {
            const sliderImages = await fetchSliderImages();
            setImages(sliderImages);
        };
        loadImages();
},[]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>):void => {
     const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setActiveIndex(index);
    };

    const scrollToImage = (index: number): void => {
        if(ScrollViewRef.current){
            ScrollViewRef.current.scrollTo({x: index * width, y: 0, animated: true});
        }
    };
    return (
        <View style={styles.container}>
            <ScrollView
            ref={ScrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.scrollView}
            >
                {images.map((image) => (
                    <Image
                    key={image.id}
                    source={{uri: image.url}}
                    style={styles.image}
                    resizeMode="cover"
                    />
                ))}
            </ScrollView>
            <View style={styles.toggleContainer}>
                {images.map((_, index) => (
                    <TouchableOpacity
                    key={index}
                    style={[
                        styles.toggleItem,
                        index === activeIndex && styles.activeToggleItem
                    ]}
                    onPress={() => scrollToImage(index)}
                    >
                    <Text style = {styles.toggleText}>{index + 1}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            marginBottom: 20
        },
        scrollView: {
            width:'100%',
            height: 200
        },
        image: {
            width,
            height: 200
        },
        toggleContainer: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10
        },
        toggleItem: {
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#e0e0e0",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 5
        },
        activeToggleItem: {
            backgroundColor: "#3498db"
        },
        toggleText: {
            color: "#fff",
            fontWeight: "bold"
        }
});

export default ImageSlider;