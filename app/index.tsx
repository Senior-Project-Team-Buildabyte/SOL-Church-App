import { Text, View, StyleSheet, ScrollView, ImageBackground } from "react-native";
import ContactsIcons from "./sections/contact-section/contacts-icons";
import EventsPage from "./sections/EventsPage/events-page";
import HomeResources from "./sections/HomeResources/home-resources";


export default function Index() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  return (
    <View style={styles.container}>
      <ScrollView>
        
        <ContactsIcons></ContactsIcons> 
        <EventsPage></EventsPage>
        <HomeResources></HomeResources>
      </ScrollView>
    </View>
  );
}