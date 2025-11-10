import {
  Text,
  View,
  StyleSheet,
  Pressable,
  SectionList,
  ImageBackground,
  Share,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";
import { useAuth } from "@/components/universal/useAuth";
import { authService } from "@/services/auth.service";
import { useAuthContext } from "@/context/authContext";
import { updateUserIDForToken } from "@/services/notifications";

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
  const { session, userstate, loading } = useAuthContext();
  const [confirmSignOutVisible, setConfirmSignOutVisible] = useState(false);
  const [signOutVisible, setSignOutVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      Alert.alert('Success', 'Signed out successfully.');
      updateUserIDForToken(null);

    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message)
        Alert.alert('Error', err.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred during sign up.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.wrapper}>


        {/* TODO: remove these when done; Navigation Links for testing*/} 
        <View style={styles.navLinks}>
            
          <Pressable onPress={() => router.push('../[auth]/login')}>
            <Text style={styles.linkText}>Log in</Text>
          </Pressable>
          <Pressable onPress={() => router.push('../[auth]/sign-up')}>
            <Text style={styles.linkText}>Sign up</Text>
          </Pressable>
          <Pressable onPress={() => router.push('../[auth]/forgot-password')}>
            <Text style={styles.linkText}>Forgot password</Text>
          </Pressable>
          <Pressable onPress={() => router.push('../[auth]/update-password')}>
            <Text style={styles.linkText}>Update password</Text>
          </Pressable>

        </View>


        <Modal
          animationType="fade"
          transparent={true}
          visible={confirmSignOutVisible}
          onRequestClose={() => {
            setConfirmSignOutVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Are you sure you want to sign out?</Text>

              <View style={styles.buttonRow}>


                <Pressable
                  style={({ pressed }) => [
                    styles.button,,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => setConfirmSignOutVisible(false)}
                >
                  <Text style={styles.actionBtnTxt}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    {backgroundColor: '#111',},
                    pressed && ([styles.buttonPressed, {backgroundColor: '#888'}]),
                  ]}
                  onPress={handleSignOut}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={[styles.actionBtnTxt,  {color: '#eee'}]}>Sign Out</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>


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

              {loading ? (
                <View style={styles.loginButton}>
                  <ActivityIndicator color="#fff" />
                </View>
              ) : session && session.user ? (
                <Pressable
                  onPress={() => setConfirmSignOutVisible(true)}
                  // onPress={() => router.push("../auth/login")}
                  style={({ pressed }) => [
                    styles.loginButton,
                    pressed && styles.loginButtonPressed,
                  ]}
                  >
                  <Text style={styles.loginBtnTxt}>Sign Out</Text>
                </Pressable>
              ) : (
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
              )}
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    padding: 5,
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

  // Modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalBox: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: "90%",
    maxWidth: 500,
    maxHeight: 500,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },

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
  // Cancel button
  button: {
    height: 40,
    backgroundColor: "#bbb",
    borderRadius: 7,
    width: "40%",
    maxWidth: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: { backgroundColor: "#999" },
  actionBtnTxt: { color: "#333", fontSize: 18 },
  // Testing nav links
  linkText: { fontSize: 15, color: "rgba(183, 113, 240, 1)", },
  navLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 10,
    marginRight: 10,
  },
});
