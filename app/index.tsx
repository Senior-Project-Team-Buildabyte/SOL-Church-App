import { Text, View, StyleSheet, ScrollView, ImageBackground } from "react-native";
import ContactsIcons from "./sections/contact-section/contacts-icons";
import EventsPage from "./sections/EventsPage/events-page";
import ImageSlider from "./sections/ImageSlider/Image_Slider";

export default function Index() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    }
  });
  return (
    <View style={styles.container}>
      <ImageSlider></ImageSlider>
      <ContactsIcons></ContactsIcons> 
      <EventsPage></EventsPage>
    </View>
  );
}