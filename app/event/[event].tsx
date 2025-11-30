import React from 'react'
import { EventData, fetchSingleEventData, getGeo } from "@/services/eventsService";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import * as Calendar from 'expo-calendar';
import moment from 'moment';
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
// TO DO: Uncomment Before Publishing 
//import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { AppleMaps, GoogleMaps } from 'expo-maps';


type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const SingleEventPage = () => {
  const { event } = useGlobalSearchParams();
  const [data, setData] = useState<EventData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setselectedEvent] = useState<EventData | null>(null);
  const [region, setRegion] = useState<{ latitude:number; longitude:number } | null>(null);
  var markers:any[] = [];

  useEffect(() => {
    const getEventData = async () => {
      try {
        const foundEvent = await fetchSingleEventData(Number(event));
        setselectedEvent(foundEvent || null);
        if (foundEvent.location) {
          let alive = true;
          (async () => {
            const res = await getGeo(foundEvent.location!);
            const match = res?.result?.addressMatches?.[0];
            const coords = match?.coordinates;
            if (!alive || !coords) return;

            // NOTE: Census geocoder style => x=lng, y=lat
            const next: Region = {
              latitude: coords.y,
              longitude: coords.x,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            };
            setRegion(next);

          })();
          return () => { alive = false; };
        }
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


  const handleAddToCalendar = async () => {
    if (selectedEvent) {  
      const dateString = `${selectedEvent.date} ${selectedEvent.time ?? '00:00:00'}`;
      const format = 'DD/MM/YYYY HH:mm:ss';
      const eventConfig: AddCalendarEvent.CreateOptions= {
        title: selectedEvent.title,
        startDate: moment(selectedEvent.date)
	  .add(7, "hours")
	  .local()
	  .toISOString(),

        endDate: moment(dateString, format)
	  .add(8, "hours")
	  .local()
	  .toISOString(),

        location: selectedEvent.location ?? undefined,
        notes: selectedEvent.description ?? undefined,
      };
      

      try {
        if (Platform.OS === 'android') {
          const { status } = await Calendar.requestCalendarPermissionsAsync();
          if (status !== 'granted') {
            alert("Calendar permission is required to add events.");
            return;
          }
        }
        const eventInfo = await AddCalendarEvent.presentEventCreatingDialog(eventConfig);
        if (eventInfo.action === 'SAVED') {
          console.log('Event saved with ID:', eventInfo.eventIdentifier);
        } else if (eventInfo.action === 'CANCELED') {
          console.log('Event creation canceled.');
        }
      } catch (error) {
        console.error('Error adding event:', error);
      }
    }
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
          <TouchableOpacity style={styles.actionButton} onPress={handleAddToCalendar}>
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
      
              <View style={{ flex: 1, backgroundColor: 'rgba(255,255,0,0.2)' }}>

                  {/* // TO DO: Uncomment Before Publishing  */}
                  {Platform.OS === "android" ? 
                  <GoogleMaps.View style={styles.map} cameraPosition={{
                    coordinates:
                    {
                      latitude: region?.latitude ?? 38.674048048803,
                      longitude: region?.longitude ?? -121.220940919702,
                    },
                    zoom: 15
                  }}
                  markers={[
                      {
                        coordinates: {
                          latitude: region?.latitude ?? 38.674048048803,
                          longitude: region?.longitude ?? -121.220940919702,
                        },
                      },
                    ]}/>
                  :
                  <AppleMaps.View style={styles.map} 
                  cameraPosition={{
                    coordinates:
                    {
                      latitude: region?.latitude ?? 38.674048048803,
                      longitude: region?.longitude ?? -121.220940919702,
                    },
                    zoom: 15
                  }}
                    markers={[
                      {
                        coordinates: {
                          latitude: region?.latitude ?? 38.674048048803,
                          longitude: region?.longitude ?? -121.220940919702,
                        },
                      },
                    ]} />
                }
                  {/* <MapView style={styles.map} 
                  provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
                  mapType="standard"
                  initialRegion={
                    {
                      latitude: region?.latitude ?? 38.674048048803,
                      longitude: region?.longitude ?? -121.220940919702,
                      latitudeDelta:0.05,
                      longitudeDelta: 0.05,
                    }}
                  >
                      <Marker coordinate={{ latitude: region?.latitude ?? 38.674048048803,
                      longitude: region?.longitude ?? -121.220940919702}}/>
                    </MapView> */}
                  
              
              </View>

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
  },
    map: { 
    width: "100%", height: 300
    },  
});

export default SingleEventPage;
