import { Text, View, StyleSheet, ScrollView, ImageBackground } from "react-native";
import ContactsIcons from "./sections/contact-section/contacts-icons";


export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello world text!</Text>

      <ContactsIcons></ContactsIcons> 
    </View>
  );
}