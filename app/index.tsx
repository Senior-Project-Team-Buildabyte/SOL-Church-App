import { View, StyleSheet, ScrollView } from "react-native";
import ContactsIcons from "./sections/contact-section/contacts-icons";
import EventsPage from "./sections/EventsPage/events-page";
import DynamicEventSection from "./sections/dynamic-events-section/dynamic-event";
import HomeResources from "./sections/HomeResources/home-resources";
import HeaderBar from "./components/HeaderBar";
<<<<<<< HEAD
import ImageSlider from "./sections/ImageSlider/Image_Slider";
import React from "react";


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
      <ImageSlider></ImageSlider>
||||||| a015722
=======
import React from "react";


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

>>>>>>> 948e686
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