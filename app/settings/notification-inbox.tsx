import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Dummy notifications data type
type NotificationItem = {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  read: boolean;
};

// Initial dummy data
const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New Event Added",
    subtitle: "Youth Group Meeting",
    date: "2025-09-16T12:00:00Z",
    read: false,
  },
  {
    id: "2",
    title: "Weekly Bulletin",
    subtitle: "September 15",
    date: "2025-09-15T08:30:00Z",
    read: false,
  },
  {
    id: "3",
    title: "Prayer Request",
    subtitle: "From Jane Doe",
    date: "2025-09-14T16:45:00Z",
    read: true,
  },
  {
    id: "4",
    title: "Service Reminder",
    subtitle: "Sunday Service at 10 AM",
    date: "2025-09-13T09:00:00Z",
    read: true,
  },
];

// Helper to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const NotificationsInbox = () => {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);

  // Handler to open a notification and mark as read
  const handleOpenNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    console.log("Open notification:", id);
    // TODO: open full notification content here
  };

  // Sort so unread notifications are on top
  const sortedNotifications = [
    ...notifications.filter((n) => !n.read),
    ...notifications.filter((n) => n.read),
  ];

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <FlatList
          data={sortedNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
              onPress={() => handleOpenNotification(item.id)}
            >
              {/* Left Red Dot for unread */}
              {!item.read && <View style={styles.unreadDot} />}

              {/* Text content */}
              <View style={styles.textContainer}>
                <Text style={[styles.title, !item.read && styles.unreadTitle]}>
                  {item.title}
                </Text>
                {item.subtitle && (
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                )}
                <Text style={styles.date}>{formatDate(item.date)}</Text>
              </View>

              {/* Caret icon */}
              <FontAwesome name="angle-right" size={24} color="#666" />
            </Pressable>
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
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    paddingHorizontal: 16,
  },
  rowPressed: {
    backgroundColor: "#f2f2f2",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    color: "#555",
  },
  unreadTitle: {
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 16,
  },
});

export default NotificationsInbox;
