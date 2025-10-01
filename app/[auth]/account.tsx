import {
  Text,
  View,
  StyleSheet,
  Pressable,
  SectionList,
  ImageBackground,
  Share,
  SafeAreaView,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

type SettingItem = {
  id: string;
  label: string;
  desc: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
};

type SettingSection = {
  title: string;
  data: SettingItem[];
};

// Handlers
const handleShare = () => {
  try {
    Share.share({ message: `Spring of Life app\nhttps://get.theapp.co/p2h3` });
  } catch (err) {
    console.error("Error sharing:", err);
  }
};

// Data
const sections: SettingSection[] = [
  {
    title: "This device",
    data: [
      {
        id: "1",
        label: "Inbox",
        desc: "Access your notifications",
        icon: "notifications",
        onPress: () => router.push("../settings/notification-inbox"),
      },
      {
        id: "2",
        label: "Notes",
        desc: "Access your notes",
        icon: "notes",
        onPress: () => router.push("../[auth]/take-notes"),
      },
      {
        id: "3",
        label: "Downloads",
        desc: "Access your downloads",
        icon: "download",
        onPress: () => router.push("../settings/downloads"),
      },
    ],
  },
  {
    title: "App settings",
    data: [
      {
        id: "4",
        label: "Notifications",
        desc: "Manage notification preferences",
        icon: "edit-notifications",
        onPress: () => router.push("../settings/notification-settings"),
      },
      {
        id: "5",
        label: "Terms of use",
        desc: "Read our terms of use",
        icon: "library-books",
        onPress: () => router.push("../settings/terms-of-use"),
      },
      {
        id: "6",
        label: "Privacy policy",
        desc: "Read our privacy policy",
        icon: "lock",
        onPress: () => router.push("../settings/privacy-policy"),
      },
      {
        id: "7",
        label: "Copyright",
        desc: "Copyright information",
        icon: "copyright",
        onPress: () => router.push("../settings/copyright"),
      },
      {
        id: "8",
        label: "About",
        desc: "App version",
        icon: "info-outline",
        onPress: () => {},
      },
    ],
  },
  {
    title: "More",
    data: [
      {
        id: "9",
        label: "Share SOL Church app",
        desc: "Get a link to share the app",
        icon: "share",
        onPress: handleShare,
      },
      {
        id: "10",
        label: "Feedback",
        desc: "Provide feedback on the app",
        icon: "comment",
        onPress: () => {},
      },
      {
        id: "11",
        label: "Help",
        desc: "Get technical support",
        icon: "help",
        onPress: () => {},
      },
    ],
  },
];

// Row component
const SettingRow = ({ label, desc, icon, onPress }: SettingItem) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
  >
    <MaterialIcons name={icon} size={24} color="#444" style={styles.icon} />
    <View style={styles.rowGap}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{desc}</Text>
      </View>
      <FontAwesome
        name="caret-right"
        size={20}
        color="#888"
        style={styles.caret}
      />
    </View>
  </Pressable>
);


export default function SettingsScreen() {

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.wrapper}>

        {/* Settings List */}
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SettingRow {...item} />}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          contentContainerStyle={styles.container}
          ListHeaderComponent={
            <View style={styles.loginSection}>
              <ImageBackground
                source={require("@/assets/images/favicon-drop.png")}
                style={[styles.headerImage, ]}
              />
              <Text style={styles.headingText}>SOL Church</Text>
              <Pressable
                // onPress={() => setLoginVisible(true)}
                onPress={() => router.push("../auth/login")}
                style={({ pressed }) => [
                  styles.loginButton,
                  pressed && styles.loginButtonPressed,
                ]}
              >
                <Text style={styles.loginBtnTxt}>Log in or sign up</Text>
              </Pressable>
            </View>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}



const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#fff" },
  container: { maxWidth: 650, width: "100%", alignSelf: "center" },
  // Header
  loginSection: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  headerImage: { height: 77, width: 77, resizeMode: "contain" },
  headingText: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555",
    marginTop: 36,
    marginLeft: 14,
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 74,
    marginHorizontal: 15,
    borderBottomColor: "#ddd",
    borderBottomWidth: 2,
    backgroundColor: "#fff",
    gap: 20,
  },
  rowPressed: { backgroundColor: "rgba(0,0,0,0.04)" },
  rowGap: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: { paddingLeft: 10 },
  caret: { paddingRight: 10 },
  label: { fontSize: 18, color: "#555" },
  description: { fontSize: 14, color: "#aaa" },

  // Login button
  loginButton: {
    height: 45,
    width: "100%",
    maxWidth: 180,
    borderRadius: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "rgba(30,30,30,1)",
  },
  loginButtonPressed: { backgroundColor: "rgba(30,30,30,0.6)" },
  loginBtnTxt: { fontSize: 18, color: "#fff" },
});
