export interface SliderImage {
    id:number;
    url:string;
    title?:string;
    description?:string;
}
const sliderImage: SliderImage[] = [
    {
        id: 1,
        url: "../../assets/images/test1.jpg",
        title: "Image 1",
        description: "This is the first image"
    },
    {
        id: 2,
        url: "../../assets/images/test1.jpg",
        title: "Image 2",
        description: "This is the second image"
    },
    {
        id: 3,
        url: "../../assets/images/test1.jpg",
        title: "Image 3",
        description: "This is the third image"
    },
    {
        id: 4,
        url: "../../assets/images/test1.jpg",
        title: "Image 4",
        description: "This is the fourth"
    }
];
export const fetchSliderImages = async (): Promise<SliderImage[]> => {
    return sliderImage;
};