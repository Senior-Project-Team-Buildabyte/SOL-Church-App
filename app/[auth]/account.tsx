import {
  Text,
  View,
  StyleSheet,
  Pressable,
  SectionList,
  ImageBackground,
  Share,
  Modal,
  SafeAreaView,
  TextInput,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";

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
const handleLoginPress = () => {};
const handleSignUpPress = () => {};
const handleForgotPWPress = () => {};
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

// Generic modal wrapper
const AuthModal = ({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >

    <View style={styles.centeredView}>
      <View style={styles.modalBox}>{children}</View>
    </View>
  </Modal>
);

export default function SettingsScreen() {
  const [loginVisible, setLoginVisible] = useState(false);
  const [signUpVisible, setSignUpVisible] = useState(false);
  const [forgotPWVisible, setForgotPWVisible] = useState(false);

  const [textEmail, onChangeTextEmail] = useState("");
  const [textPassword, onChangeTextPW] = useState("");
  const [textPWConfirm, onChangeTextPWConfirm] = useState("");

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.wrapper}>
        {/* Login Modal */}

        <AuthModal
          visible={loginVisible}
          onClose={() => {
            onChangeTextEmail("");
            onChangeTextPW("");
            setLoginVisible(false);
          }}
        >
          <Text style={styles.modalTitle}>Log in or sign up to continue</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeTextEmail}
            value={textEmail}
            placeholder="Email"
            placeholderTextColor={'#888'}
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangeTextPW}
            value={textPassword}
            placeholder="Password"
            placeholderTextColor={'#888'}
          />

          <View style={styles.inlineButtons}>
            <Pressable
              onPress={() => {
                onChangeTextEmail("");
                onChangeTextPW("");
                setLoginVisible(false);
                setSignUpVisible(true);
              }}
            >
              {({ pressed }) => (
                <Text
                  style={[styles.linkText, pressed && styles.linkTextPressed]}
                >
                  Create Account
                </Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => {
                onChangeTextEmail("");
                onChangeTextPW("");
                setLoginVisible(false);
                setForgotPWVisible(true);
              }}
            >
              {({ pressed }) => (
                <Text
                  style={[styles.linkText, pressed && styles.linkTextPressed]}
                >
                  Forgot Password
                </Text>
              )}
            </Pressable>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.loginButtonPressed,
              ]}
              onPress={() => {
                onChangeTextEmail("");
                onChangeTextPW("");
                setLoginVisible(false);
              }}
            >
              <Text style={styles.actionBtnTxt}>Cancel</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.loginButtonPressed,
              ]}
              onPress={handleLoginPress}
            >
              <Text style={styles.actionBtnTxt}>Login</Text>
            </Pressable>
          </View>
        </AuthModal>

        {/* Sign Up Modal */}
        <AuthModal
          visible={signUpVisible}
          onClose={() => {
            setSignUpVisible(false);
            setLoginVisible(true);
            onChangeTextEmail("");
            onChangeTextPW("");
            onChangeTextPWConfirm("");
          }}
        >
          <Text style={styles.modalTitle}>Create New Account</Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeTextEmail}
            value={textEmail}
            placeholder="Email"
            placeholderTextColor={'#888'}
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangeTextPW}
            value={textPassword}
            placeholder="Password"
            placeholderTextColor={'#888'}
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangeTextPWConfirm}
            value={textPWConfirm}
            placeholder="Confirm Password"
            placeholderTextColor={'#888'}
          />

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.loginButtonPressed,
              ]}
              onPress={() => {
                setSignUpVisible(false);
                setLoginVisible(true);
                onChangeTextEmail("");
                onChangeTextPW("");
                onChangeTextPWConfirm("");
              }}
            >
              <Text style={styles.actionBtnTxt}>Back</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.loginButtonPressed,
              ]}
              onPress={handleSignUpPress}
            >
              <Text style={styles.actionBtnTxt}>Sign Up</Text>
            </Pressable>
          </View>
        </AuthModal>

        {/* Forgot Password Modal */}
        <AuthModal
          visible={forgotPWVisible}
          onClose={() => {
            setForgotPWVisible(false);
            setLoginVisible(true);
            onChangeTextEmail("");
          }}
        >
          <Text style={[styles.modalTitle, { fontSize: 15 }]}>
            Enter your email to get a password reset link
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={onChangeTextEmail}
            value={textEmail}
            placeholder="Email"
            placeholderTextColor={'#888'}
          />
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.loginButtonPressed,
              ]}
              onPress={() => {
                setForgotPWVisible(false);
                setLoginVisible(true);
                onChangeTextEmail("");
              }}
            >
              <Text style={styles.actionBtnTxt}>Back</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.loginButtonPressed,
              ]}
              onPress={handleForgotPWPress}
            >
              <Text style={styles.actionBtnTxt}>Send Email</Text>
            </Pressable>
          </View>
        </AuthModal>

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
                style={styles.headerImage}
              />
              <Text style={styles.headingText}>SOL Church</Text>
              <Pressable
                onPress={() => setLoginVisible(true)}
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
  overlay: {
    // flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // <- semi-transparent dark overlay
    justifyContent: "center",
    alignItems: "center",
  },
  // Header
  loginSection: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  headerImage: { height: 75, width: 75, aspectRatio: 1 },
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
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  // Inputs & Buttons
  input: { height: 40, margin: 12, borderWidth: 1, padding: 10, width: "100%" },
  inlineButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  linkText: { fontSize: 15, color: "rgba(183, 113, 240, 1)" },
  linkTextPressed: {
    color: "rgba(183, 113, 240, 0.5)",
    textDecorationLine: "underline",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    padding: 5,
  },
  actionBtn: {
    height: 40,
    backgroundColor: "#bbb",
    borderRadius: 7,
    width: "40%",
    maxWidth: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnTxt: { fontSize: 20, color: "#111" },

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
