import { EventData, fetchSingleEventData } from "@/services/eventsService";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Platform,
  Linking,
} from "react-native";
import { Icon } from "react-native-elements";

const SingleEventPage = () => {
  const { event } = useGlobalSearchParams();
  const [data, setData] = useState<EventData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setselectedEvent] = useState<EventData | null>(null);

  useEffect(() => {
    const getEventData = async () => {
      try {
        const foundEvent = await fetchSingleEventData(Number(event));
        setselectedEvent(foundEvent || null);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    getEventData();
  }, [event]);

  const handleShare = async () => {
    if (selectedEvent) {
      try {
        await Share.share({
          message: `${selectedEvent?.title} - ${selectedEvent?.date}\n${selectedEvent?.description || ""}`,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  const openInMaps = () => {
    if (!selectedEvent?.location) return;

    const url = Platform.select({
      ios: `maps:0,0?q=${selectedEvent.location}`,
      android: `geo:0,0?q=${selectedEvent.location}`,
    });

    if (url) Linking.openURL(url);
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image source={selectedEvent?.image} style={styles.headerImage} />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{selectedEvent?.title}</Text>
        {selectedEvent?.group && <Text style={styles.subtitle}>{selectedEvent?.group}</Text>}
        <Text style={styles.date}>{selectedEvent?.date}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Icon name="share" type="feather" size={24} color="#000" />
            <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="calendar-plus-o" type="font-awesome" size={24} color="#000" />
            <Text style={styles.actionLabel}>Add to calendar</Text>
          </TouchableOpacity>
        </View>

        {selectedEvent?.description && (
          <Text style={styles.description}>{selectedEvent?.description}</Text>
        )}

        {selectedEvent?.location && (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.sectionLabel}>Location</Text>
            <Text style={styles.locationText}>{selectedEvent.location}</Text>
            <TouchableOpacity onPress={openInMaps}>
              {/* <Image
                source={{
                  uri: `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
                    selectedEvent.location
                  )}&zoom=15&size=600x300&key=primal-index-457201-r3`,
                }}
                style={styles.mapImage}
              /> */} 
              {/* TODO: Update Map Showcase */}
              <Image
  source={{ uri: 'https://images.macrumors.com/t/sSDgMK1wW3ezBrut4FHr1Yo5vI4=/1600x1200/smart/article-new/2019/12/newmapsappsoutheast.jpg' }}
  style={styles.mapImage}
/>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
    backgroundColor: "white",
  },
  headerImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  actionButton: {
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 14,
    marginTop: 6,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  mapImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  }
});

export default SingleEventPage;
