import { requireNativeComponent } from "react-native";

export interface SliderImage {
    id: number;
    image: any; 
    title?: string;
    description?: string;
}

const sliderImage: SliderImage[] = [
    {
        id: 1,
        image: require("../assets/images/stockphoto.jpg"), 
        title: "Image 1",
        description: "This is the first image"
    },
    {
        id: 2,
        image: require("../assets/images/testbackground.jpg"), 
        title: "Image 2",
        description: "This is the second image"
    },
    {
        id: 3,
        image: require("../assets/images/stockphoto.jpg"), 
        title: "Image 3",
        description: "This is the third image"
    },
    {
        id: 4,
        image: require("../assets/images/testbackground.jpg"), 
        title: "Image 4",
        description: "This is the fourth"
    }
];

export const fetchSliderImages = async (p0: string): Promise<SliderImage[]> => {
    return sliderImage;
};
