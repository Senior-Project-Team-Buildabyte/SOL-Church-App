import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/universal/useAuth";

type ToggleMap = { [key: string]: boolean };

type NotificationPreferencesRow = {
  user_id: string;
  notifications_enabled: boolean;
  updated_at?: string | null;
  general?: boolean;
  youth?: boolean;
  womens_ministry?: boolean;
  teens?: boolean;
  solru?: boolean;
  mens?: boolean;
};

const OPTION_DEFS = [
  { key: "general", label: "General" },
  { key: "youth", label: "Youth" },
  { key: "womens_ministry", label: "Women's Ministry" },
  { key: "teens", label: "Teens" },
  { key: "solru", label: "SOLru" },
  { key: "mens", label: "Men's" },
];

const buildEmptyToggles = (): ToggleMap =>
  OPTION_DEFS.reduce<ToggleMap>((acc, opt) => {
    acc[opt.key] = false;
    return acc;
  }, {});

const NotificationSettings: React.FC = () => {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [toggles, setToggles] = useState<ToggleMap>(() => buildEmptyToggles());

  const canEdit = !!userId;

  const loadPreferences = async () => {
    if (!userId) {
      setNotificationsEnabled(false);
      setToggles(buildEmptyToggles());
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId)
        .limit(1)
        /* ✅ ADD GENERIC TYPE HERE */
        .single<NotificationPreferencesRow>();

      if (error) {
        console.error("Error loading notification preferences:", error);
        Alert.alert(
          "Error",
          "Could not load your notification preferences right now."
        );
        setNotificationsEnabled(false);
        setToggles(buildEmptyToggles());
        return;
      }

      const row = data;

      if (!row) {
        setNotificationsEnabled(false);
        setToggles(buildEmptyToggles());
        return;
      }

      /* ⛔ This was causing the TS error — now fixed */
      setNotificationsEnabled(!!row.notifications_enabled);

      const nextToggles: ToggleMap = { ...buildEmptyToggles() };
      OPTION_DEFS.forEach((opt) => {
        nextToggles[opt.key] = !!(row as any)[opt.key];
      });
      setToggles(nextToggles);
    } catch (err) {
      console.error("Unexpected error loading notification preferences:", err);
      Alert.alert(
        "Error",
        "An unexpected error occurred while loading preferences."
      );
      setNotificationsEnabled(false);
      setToggles(buildEmptyToggles());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, [userId]);

  const persistPreferences = async (
    enabled: boolean,
    newToggles: ToggleMap
  ) => {
    if (!userId) return;

    setSaving(true);
    try {
      const payload: any = {
        user_id: userId,
        notifications_enabled: enabled,
        updated_at: new Date().toISOString(),
      };

      OPTION_DEFS.forEach((opt) => {
        payload[opt.key] = !!newToggles[opt.key];
      });

      const { error } = await supabase
        .from("notification_preferences")
        .upsert(payload, { onConflict: "user_id" });

      if (error) {
        console.error("Error saving notification preferences:", error);
        Alert.alert(
          "Error",
          "Could not save your notification preferences. Please try again."
        );
      } else {
        console.log("Notification preferences saved:", payload);
      }
    } catch (err) {
      console.error("Unexpected error saving notification preferences:", err);
      Alert.alert(
        "Error",
        "An unexpected error occurred while saving preferences."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleMasterToggle = async () => {
    if (!canEdit) return;

    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);

    let newToggles = toggles;

    if (!newState) {
      newToggles = buildEmptyToggles();
      setToggles(newToggles);
    }

    console.log(`Notification setting changed: notificationsEnabled → ${newState}`);
    await persistPreferences(newState, newToggles);
  };

  const handleToggle = async (key: string) => {
    if (!notificationsEnabled || !canEdit) return;

    const newState = !toggles[key];
    const newToggles = { ...toggles, [key]: newState };
    setToggles(newToggles);

    console.log(`Notification setting changed: ${key} → ${newState}`);
    await persistPreferences(notificationsEnabled, newToggles);
  };

  if (!canEdit) {
    return (
      <View style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.infoText}>
            Please sign in to manage your notification preferences.
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.background}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading notification settings…</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>
            {notificationsEnabled ? "Notifications: On" : "Notifications: Off"}
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleMasterToggle}
            thumbColor={notificationsEnabled ? "#007AFF" : "#f4f3f4"}
            trackColor={{ false: "#ccc", true: "#81b0ff" }}
          />
        </View>
        <View style={styles.separator} />

        <FlatList
          data={OPTION_DEFS}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text
                style={[
                  styles.label,
                  (!notificationsEnabled || saving) && styles.disabledLabel,
                ]}
              >
                {item.label}
              </Text>
              <Switch
                value={toggles[item.key]}
                onValueChange={() => handleToggle(item.key)}
                disabled={!notificationsEnabled || saving}
                thumbColor={
                  toggles[item.key] && notificationsEnabled
                    ? "#007AFF"
                    : notificationsEnabled
                    ? "#f4f3f4"
                    : "#eee"
                }
                trackColor={{
                  false: notificationsEnabled ? "#ccc" : "#f1f1f1",
                  true: notificationsEnabled ? "#81b0ff" : "#ddd",
                }}
              />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        {saving && (
          <View style={styles.savingBar}>
            <ActivityIndicator size="small" />
            <Text style={styles.savingText}>Saving preferences…</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
  },
  container: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
    backgroundColor: "#fff",
    paddingTop: 16,
  },
  row: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  disabledLabel: {
    color: "#ccc",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 16,
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#555",
  },
  infoText: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    paddingHorizontal: 24,
  },
  savingBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  savingText: {
    fontSize: 14,
    color: "#555",
  },
});

export default NotificationSettings;
