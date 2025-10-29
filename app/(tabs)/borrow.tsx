import DynamicButton from "@/components/universal/dynamic-button";
import { useAuth } from "@/components/universal/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { supabase } from "@/lib/supabase";

type RoleRow = {
  role_id: number;
  role: { role_name: string } | null;
};

const BorrowPage = () => {
  const { session } = useAuth();

  const [checkingRole, setCheckingRole] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setCheckingRole(true);

        const uid = session?.user?.id ?? null;
        if (!uid) {
          setIsAdmin(false);
          return;
        }

        // Query roles for this user. No RLS in your local setup, so anon key works.
        const { data, error } = await supabase
          .from("user_role")
          .select("role_id, role:role_id ( role_name )")
          .eq("user_id", uid)
          .returns<RoleRow[]>();

        if (error) throw error;

        const hasAdminRole =
          (data ?? []).some((r) => (r.role?.role_name ?? "").toLowerCase() === "admin") ||
          (data ?? []).some((r) => r.role_id === 1); // fallback if role_id=1 is Admin

        // Keep your temporary hard-coded test IDs as a fallback too
        const isWhitelistedTestId =
          uid === "7e34e997-8e76-46e4-8078-f0c362cccd15" ||
          uid === "876d5722-72f2-4dfd-ac0a-35115cb36989";

        setIsAdmin(hasAdminRole || isWhitelistedTestId);
      } catch (e: any) {
        console.error("Role check failed:", e);
        Alert.alert("Warning", "Could not verify your role. Admin features may be hidden.");
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };

    checkAdmin();
  }, [session?.user?.id]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/bg-mission.jpg")}
        style={styles.frontimage}
        resizeMode="cover"
      >
        <View style={styles.headingWrapper}>
          <LinearGradient
            style={[styles.pageHeading]}
            colors={["rgba(149, 185, 247, 1)", "rgba(60,129,246,1)"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <ImageBackground
              source={require("@/assets/images/favicon-drop.png")}
              style={[{ height: "100%" }, { aspectRatio: 1 }]}
              resizeMode="cover"
            />
            <Text style={styles.headingText}>SOL Inventory</Text>
          </LinearGradient>
        </View>
      </ImageBackground>

      <View style={styles.buttons}>
        {/* Borrow an Item */}
        <DynamicButton
          buttons={[
            {
              type: 1, // internal
              shape: 0, // full
              buttonConfig: {
                text: "Borrow an Item",
                icon: "shopping-basket",
                internalLink: `../borrow/borrowItems`,
                backgroundGradient: ["0", "rgba(60,129,246,1)", "rgba(149, 185, 247, 1)"],
              },
            },
          ]}
        />

        {/* Return Items */}
        <DynamicButton
          buttons={[
            {
              type: 1, // internal
              shape: 0, // full
              buttonConfig: {
                text: "Return Items",
                icon: "undo",
                internalLink: `../borrow/returnItems`,
                backgroundGradient: ["0", "rgba(149, 185, 247, 1)", "rgba(60,129,246,1)"],
              },
            },
          ]}
        />

        {/* Admin controls */}
        {checkingRole ? (
          <ActivityIndicator style={{ marginTop: 12 }} />
        ) : isAdmin ? (
          <>
            {/* Manage Items (Admin) */}
            <DynamicButton
              buttons={[
                {
                  type: 1, // internal
                  shape: 0, // full
                  buttonConfig: {
                    text: "Manage Items (Admin)",
                    icon: "cog",
                    internalLink: `../borrow/admin-borrow`,
                    backgroundGradient: ["0", "rgba(43,85,195,1)", "rgba(30,58,138,1)"],
                  },
                },
              ]}
            />

            {/* Inventory Requests */}
            <DynamicButton
              buttons={[
                {
                  type: 1, // internal
                  shape: 0, // full
                  buttonConfig: {
                    text: "Inventory Requests",
                    icon: "bell",
                    internalLink: `../admin/inventory_requests`,
                    backgroundGradient: ["0", "rgba(149, 185, 247, 1)", "rgba(60,129,246,1)"],
                  },
                },
              ]}
            />
          </>
        ) : null}
      </View>
    </View>
  );
};

// styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
  },
  frontimage: {
    width: "100%",
    height: 250,
  },
  headingWrapper: {
    maxWidth: 650,
    width: "100%",
    height: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  pageHeading: {
    height: 60,
    backgroundColor: "rgba(58, 120, 227, 1)",
    width: "70%",
    maxWidth: 350,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headingText: {
    color: "#fff",
    fontSize: 30,
    textAlign: "center",
    flexGrow: 1,
    fontWeight: "bold",
    textShadowColor: "#333",
    textShadowRadius: 10,
    textShadowOffset: { width: 1, height: 2 },
  },
  buttons: {
    flex: 1,
    justifyContent: "space-evenly",
    maxHeight: 500,
    width: "90%",
    alignSelf: "center",
  },
});

export default BorrowPage;
