import React, { useState } from "react";
import { View, Text, Switch, StyleSheet, FlatList } from "react-native";

const options = [
  "General",
  "Youth",
  "Women's Ministry",
  "Teens",
  "SOLru",
  "Men's",
];

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [toggles, setToggles] = useState(
    Object.fromEntries(options.map((opt) => [opt, false]))
  );

  const handleNotificationChange = (key: string, value: boolean) => {
    console.log(`Notification setting changed: ${key} → ${value}`);
  };

  const handleMasterToggle = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);

    // If turning off notifications, reset all others
    if (!newState) {
      setToggles(Object.fromEntries(options.map((opt) => [opt, false])));
    }

    handleNotificationChange("notificationsEnabled", newState);
  };

  const handleToggle = (key: string) => {
    if (!notificationsEnabled) return; // ignore if disabled
    const newState = !toggles[key];
    setToggles((prev) => ({ ...prev, [key]: newState }));
    handleNotificationChange(key, newState);
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        {/* Master Switch */}
        <View style={styles.row}>
          <Text style={styles.label}>
            {notificationsEnabled ? "On" : "Off"}
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleMasterToggle}
            thumbColor={notificationsEnabled ? "#007AFF" : "#f4f3f4"}
            trackColor={{ false: "#ccc", true: "#81b0ff" }}
          />
        </View>
        <View style={styles.separator} />

        {/* Sub-options */}
        <FlatList
          data={options}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text
                style={[
                  styles.label,
                  !notificationsEnabled && styles.disabledLabel,
                ]}
              >
                {item}
              </Text>
              <Switch
                value={toggles[item]}
                onValueChange={() => handleToggle(item)}
                disabled={!notificationsEnabled}
                thumbColor={
                  toggles[item] && notificationsEnabled
                    ? "#007AFF"
                    : (notificationsEnabled ?
                      "#f4f3f4" : "#eee")
                }
                trackColor={{
                  // false: "#ccc",
                  false: notificationsEnabled ? "#ccc" : "#f1f1f1",
                  true: notificationsEnabled ? "#81b0ff" : "#ddd",
                }}
              />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
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
});

export default NotificationSettings;