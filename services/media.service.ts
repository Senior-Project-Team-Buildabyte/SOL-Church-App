import { supabase } from "@/lib/supabase";
import { MediaLink } from "@/types/database.types";
import { Database as GeneratedTypes } from "../types/database.types";


export const mediaService = {
  async getMediaButtons(): Promise<MediaLink[]> {
    const { data, error } = await supabase
      .from("media_links")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase media_links error:", error);
      throw new Error(error.message);
    }

    return data || [];
  },
};
