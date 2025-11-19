import { supabase } from "@/lib/supabase";

export interface SliderImage {
  id: number;
  image: { uri: string } | any;
  title?: string;
  description?: string;

  // NEW FIELDS for click-through
  internalRoute?: string;  // e.g. "/events/123"
  externalUrl?: string;    // e.g. "https://solchurch.com"
}

// Dummy fallback when Supabase fails
const dummySliderImages: SliderImage[] = [
  {
    id: 1,
    image: require("../assets/images/stockphoto.jpg"),
    title: "Image 1",
    description: "Fallback image 1",
    internalRoute: "/events/1",
  },
  {
    id: 2,
    image: require("../assets/images/testbackground.jpg"),
    title: "Image 2",
    description: "Fallback image 2",
    externalUrl: "https://solchurch.com",
  },
];

export const fetchSliderImages = async (): Promise<SliderImage[]> => {
  try {
    const { data, error } = await supabase
      .from("slider_image")
      .select(`
        *,
        images:image_id (image_link)
      `);

    if (error) throw error;

    if (!data || data.length === 0) return dummySliderImages;

    const sliderImages: SliderImage[] = data.map((row: any) => ({
      id: row.id,
      image: row.images?.image_link
        ? { uri: row.images.image_link }
        : require("../assets/images/stockphoto.jpg"),

      title: row.title,
      description: row.description,

      // NEW — map Supabase columns:
      internalRoute: row.internal_route ?? null,
      externalUrl: row.external_url ?? null,
    }));

    return sliderImages;
  } catch (error) {
    console.error("Failed to fetch slider images:", error);
    return dummySliderImages;
  }
};
