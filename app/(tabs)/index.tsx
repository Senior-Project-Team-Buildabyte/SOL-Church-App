import { View, StyleSheet, ScrollView } from "react-native";
import ContactsIcons from "../../components/universal/contacts-icons";
import DynamicEventSection from "../../components/home/dynamic-event";
import Resources from "../../components/home/resources";
import HeaderBar from "../../components/universal/header-bar";
import ImageSlider from "../../components/home/Image_slider";
import DynamicButton from "@/components/universal/dynamic-button";


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
      <ImageSlider></ImageSlider>
      <View style={styles.container}>
        <DynamicEventSection></DynamicEventSection>
        <ContactsIcons></ContactsIcons> 
        <Resources></Resources>
      </View>
    </ScrollView>
  );
}
