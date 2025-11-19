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
      try {
        const result = await mediaService.getMediaButtons();
        setButtons(result || []);
      } catch (err) {
        console.error("Error loading media page:", err);
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

  const mappedButtons = buttons.map((item) => {
    const bgImage =
      (item.background_key && localImages[item.background_key]) ||
      item.background_url ||
      null;

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

  return <DynamicButton buttons={mappedButtons} />;
}
