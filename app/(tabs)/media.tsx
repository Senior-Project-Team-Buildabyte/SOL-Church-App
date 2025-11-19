import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import DynamicButton from "@/components/universal/dynamic-button";
import { mediaService } from "@/services/media.service";
import { MediaLink } from "@/types/database.types";
import type { RelativePathString } from "expo-router";

const localImages: Record<string, any> = {
  evening_service: require("../../assets/images/bg-about-sol.jpg"),
  sol_tv: require("../../assets/images/bg-mission.jpg"),
  morning_service: require("../../assets/images/bg-sol-ru.jpg"),
};

const MediaPage = () => {
  const [buttons, setButtons] = useState<MediaLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await mediaService.getMediaButtons();
        setButtons(result);
      } catch (error) {
        console.error("Error loading media:", error);
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
      </View>
    );
  }

  return (
    <DynamicButton
      buttons={buttons.map((item) => ({
        type: item.type,
        shape: item.shape,
        buttonConfig: {
          text: item.title,
          link: item.link ?? undefined,
          internalLink: item.internal_link ? (item.internal_link as RelativePathString) : undefined,
          backgroundImage:
            localImages[item.background_key ?? ""] ??
            item.background_url ??
            null,
        },
      }))}
    />
  );
};

export default MediaPage;
