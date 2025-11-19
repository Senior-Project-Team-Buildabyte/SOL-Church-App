import { supabase } from "@/lib/supabase";

export interface SliderImage {
  id: number;
  image: any;
  internalRoute?: string | null;
  externalUrl?: string | null;
  title?: string | null;
  description?: string | null;
}

export const fetchSliderImages = async (): Promise<SliderImage[]> => {
  try {
    const { data, error } = await supabase
      .from("slider_image")
      .select(`
        slider_image_id,
        image_id,
        internal_route,
        external_url,
        title,
        description,
        images:image_id (
          image_link
        )
      `)
      .order("slider_image_id");

    if (error) {
      console.error("Slider fetch error:", error);
      return [];
    }

    return data.map((row: any) => ({
      id: row.slider_image_id,
      image: row.images?.image_link
        ? { uri: row.images.image_link }
        : require("../assets/images/stockphoto.jpg"),
      internalRoute: row.internal_route,
      externalUrl: row.external_url,
      title: row.title,
      description: row.description,
    }));
  } catch (err) {
    console.error("Failed to fetch slider images:", err);
    return [];
  }
};
