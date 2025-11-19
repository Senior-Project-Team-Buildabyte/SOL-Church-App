import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import DynamicButton from "@/components/universal/dynamic-button";
import { mediaService } from "@/services/media.service";
import type { MediaLink } from "@/types/database.types";
import type { RelativePathString } from "expo-router";

// Local images map
const localImages: Record<string, any> = {
  evening_service: require("../../assets/images/bg-about-sol.jpg"),
  sol_tv: require("../../assets/images/bg-mission.jpg"),
  morning_service: require("../../assets/images/bg-sol-ru.jpg"),
};

export default function MediaPage() {
  const [buttons, setButtons] = useState<MediaLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      console.log("DEBUG: Fetching media links...");

      try {
        const result = await mediaService.getMediaButtons();

        console.log(
          "DEBUG: Raw media_links from Supabase:",
          JSON.stringify(result, null, 2)
        );

        if (!result) {
          console.warn("DEBUG WARNING: Supabase returned null!");
          setButtons([]);
          return;
        }

        if (Array.isArray(result) && result.length === 0) {
          console.warn("DEBUG WARNING: media_links table is EMPTY.");
        }

        // Validate each row
        result.forEach((item, index) => {
          console.log(`DEBUG: Row ${index}`, item);

          if (!item.title)
            console.warn(`Row ${index} MISSING 'title' column`);
          if (item.type === undefined)
            console.warn(`Row ${index} MISSING 'type' column`);
          if (item.shape === undefined)
            console.warn(`Row ${index} MISSING 'shape' column`);
        });

        setButtons(result);
      } catch (err) {
        console.error("DEBUG ERROR loading media page:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading media...</Text>
      </View>
    );
  }

  // If no buttons received
  if (buttons.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, textAlign: "center", marginTop: 40 }}>
          ⚠ No media buttons found.
        </Text>
        <Text style={{ marginTop: 10, textAlign: "center" }}>
          Check if the media_links table has data.
        </Text>
      </View>
    );
  }

  // Map DB rows → DynamicButton config
  const mappedButtons = buttons.map((item, index) => {
    const bgImage =
      (item.background_key && localImages[item.background_key]) ||
      item.background_url ||
      null;

    console.log(`DEBUG: Final mapped button ${index}:`, {
      text: item.title,
      internalLink: item.internal_link,
      externalLink: item.link,
      backgroundImage: bgImage,
      type: item.type,
      shape: item.shape,
    });

    return {
      type: item.type,
      shape: item.shape,
      buttonConfig: {
        text: item.title,
        link: item.link || undefined,
        internalLink: item.internal_link
          ? (item.internal_link as RelativePathString)
          : undefined,
        backgroundImage: bgImage,
      },
    };
  });

  console.log("DEBUG: Final button payload given to DynamicButton:", mappedButtons);

  return <DynamicButton buttons={mappedButtons} />;
}
