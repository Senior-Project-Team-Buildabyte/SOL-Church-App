import { Text, View, StyleSheet, ScrollView, ImageBackground } from "react-native";
import ContactsIcons from "./sections/contact-section/contacts-icons";
import EventsPage from "./sections/EventsPage/events-page";
import DynamicEventSection from "./sections/dynamic-events-section/dynamic-event";
import HomeResources from "./sections/HomeResources/home-resources";


export default function Index() {
  const styles = StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: '#fff',
    },
    container: {
      alignItems: 'center'
    },
  });
  return (
    <ScrollView>
    <View style={styles.container}>
    <View style={{ height: 200 }}></View>
    <DynamicEventSection></DynamicEventSection>
      <ContactsIcons></ContactsIcons> 
      {/* <EventsPage></EventsPage> */}
      <HomeResources></HomeResources>
    </View>
    </ScrollView>
  );
}