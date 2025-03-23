import { EventData, fetchEventData } from "@/app/services/eventsService";
import { Component, useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, ImageBackground } from "react-native";


const EventsPage = () => {
  const [data, setData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getEventData = async () => {
      try {
        const events = await fetchEventData('/data');
        setData(events); // Set the fetched data
      } catch (error) {
        console.error('Error fetching events:', error);
      } 
    };
    getEventData(); 
    }, []); 
    const styles = StyleSheet.create({
        scrollContainer: {
          flexGrow: 1,
          alignItems: "center",
          backgroundColor: "white",
          padding: 20,
        },
        eventWrapper: {
          width: "100%",
          alignItems: "center",
        },
        eventContainer: {
          flexDirection: "row",
          alignItems: "center",
          width: "90%",
          marginBottom: 10,
        },
        image: {
          width: 160,
          height: 80,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 15,
        },
        frontimage: {
          width: 400,
          height: 150,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 15,
          marginBottom: 30,
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
          width: "90%",
          marginVertical: 10,
        },
      });
      
      return (
<ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text>DEMO Upcoming Events Page</Text>
      <ImageBackground
        source={require("../../../assets/images/stockphoto.jpg")}
        style={styles.frontimage}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.dateText}>MAR</Text>
          <Text style={styles.dateText}>20</Text>
        </View>
      </ImageBackground>
      {/* Generate list with Image Widgets */}
      {data.map((_, index) => (
        <View key={index} style={styles.eventWrapper}>
          <View style={styles.eventContainer}>
            <ImageBackground
              source={require('../../../assets/images/testbackground.jpg')} //needs to be replaced with actual images from Blob
              style={styles.image}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.overlay}>
                <Text style={styles.dateText}>MAR</Text>
                <Text style={styles.dateText}>20</Text>
              </View>
            </ImageBackground>
            
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>{_.title}</Text>
              <Text style={styles.descriptionText}>{_.guestSpeaker}</Text>
              <Text style={styles.descriptionText}>Time: {_.time}</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      ))}
    </ScrollView>
  );
};

export default EventsPage;