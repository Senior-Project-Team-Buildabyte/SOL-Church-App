import { EventData, fetchEventData } from '@/services/eventsService';
import { useRouter } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { Icon } from 'react-native-elements';


const EventsPage = () => {
  const [data, setData] = useState<EventData[]>([]);

  const router = useRouter();
  const handlePress = async (link: string, eventId: number) => {
    if (link != undefined)
      try {
        console.log("click")
          router.push(`/event/${eventId}`);
      
      } catch (error) {
        console.warn("This error is harmless and can be ignored:", error);
      }
  };


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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.servicesCard}>
          <Image source={{ uri: 'https://example.com/background.jpg' }} style={styles.servicesImage} />
          <View style={styles.servicesOverlay}>
            <Text style={styles.servicesTitle}>SERVICES</Text>
            <Text style={styles.serviceTimes}>Saturday: 6:30pm</Text>
            <Text style={styles.serviceTimes}>Sunday: 8:15am 10:30am 12:45pm</Text>
            <Text style={styles.serviceTimes}>SOLru: 3:16pm • English: 6pm</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.eventList}>
        {data.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard} onPress={() => handlePress(event.link, event.id)}>
            <View style={styles.imageWrapper}>
              <Image source={event.image} style={styles.eventImage} />
              <View style={styles.dateOverlay}>
                <Text style={styles.dateMonth}>{event.month}</Text>
                <Text style={styles.dateDay}>{event.day}</Text>
              </View>
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              {event.group ? <Text style={styles.eventGroup}>{event.group}</Text> : null}
              {event.guestSpeaker ? <Text style={styles.eventGroup}>{event.guestSpeaker}</Text> : null}
              <Text style={styles.eventDate}>{moment(event.date).format('ll') + (event.time ? ' \u00B7 ' + event.time : '')}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2c2c2e',
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 16,
  },
  servicesCard: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  servicesImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  servicesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  servicesTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  serviceTimes: {
    color: 'white',
    fontSize: 14,
  },
  serviceLangs: {
    color: 'white',
    fontSize: 14,
    marginTop: 6,
  },
  eventList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  eventCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
  },
  eventImage: {
    width: 105,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  dateOverlay: {
    position: 'absolute',
    bottom: 1,
    right: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  dateMonth: {
    color: 'white',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  dateDay: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventGroup: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  eventDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});

export default EventsPage;