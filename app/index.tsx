import { View, StyleSheet, ScrollView } from "react-native";
import ContactsIcons from "../components/universal/contacts-icons";
import EventsPage from "./(tabs)/events";
import DynamicEventSection from "../components/home/dynamic-event";
import Resources from "../components/home/resources";
import HeaderBar from "../components/universal/header-bar";


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
    <ScrollView style = {styles.scrollContainer}>
      <HeaderBar />

      <View style={styles.container}>
        <View style={{ height: 200 }}></View>
        <DynamicEventSection></DynamicEventSection>
        <ContactsIcons></ContactsIcons> 
        {/* <EventsPage></EventsPage> */}
        <Resources></Resources>
      </View>
    </ScrollView>
  );
}