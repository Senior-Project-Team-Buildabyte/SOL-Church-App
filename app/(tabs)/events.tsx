import { useEffect, useState } from "react";
import { EventData, fetchEventData } from "@/services/eventsService";
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ImageSourcePropType } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const images = [
  require("../../assets/images/testbackground.jpg"),
  require("../../assets/images/testbackground.jpg"),
  require("../../assets/images/testbackground.jpg"),
];

const EventsPage = () => {
  const [data, setData] = useState<EventData[]>([]);

  useEffect(() => {
    const getEventData = async () => {
      try {
        const events = await fetchEventData("/data");
        setData(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    getEventData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>DEMO Upcoming Events Page</Text>

      {/* Sliding Image Carousel */}
      <Carousel
        loop
        width={width}
        height={160}
        data={images}
        scrollAnimationDuration={1000}
        renderItem={({ item }: { item: ImageSourcePropType }) => (
          <ImageBackground
            source={item} 
            style={styles.frontimage}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.overlay}>
              <Text style={styles.dateText}>MAR</Text>
              <Text style={styles.dateText}>20</Text>
            </View>
          </ImageBackground>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 0,
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  frontimage: {
    width,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  dateText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  eventWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  eventContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginBottom: 5,
  },
  image: {
    width: 140,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "60%",
  },
  descriptionTitle: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  descriptionText: {
    color: "black",
    fontSize: 16,
  },
  separator: {
    height: 2,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: "100%",
    marginVertical: 0,
  },
});

export default EventsPage;