import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import { getUserNotification } from "@/services/notifications";

type NotificationItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  date: string;
  raw: any;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const NotificationsInbox = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Determine whether current user is an admin so we can hide admin-only notifications
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
       

      // Admin check: if the user has a user_role row with role_id == 2, treat as admin
      let isAdmin = false;
      if (userId) {
        try {
          const { data: urData, error: urErr } = await supabase
            .from('user_role')
            .select('user_role_id')
            .eq('user_id', userId)
            .eq('role_id', 2)
            .limit(1);

          if (!urErr && urData && urData.length > 0) {
            isAdmin = true;
          }
        } catch (e) {
          console.warn('Failed to determine admin status', e);
          isAdmin = false;
        }
      }

      getUserNotification(userId, isAdmin);

      const { data, error } = await supabase
        .from('notification')
        .select('*')
        .order('notificationid', { ascending: false })
        
        .limit(100);
      if (error) {
        console.error('Failed to load notifications', error);
        return;
      }

      const mapped = (data || [])
        .map((n: any) => ({
          id: String(n.notificationid),
          title: n.notificationtitle,
          subtitle: n.notificationdescription,
          date: n.notificationsenttime || n.notificationscheduledtime || new Date().toISOString(),
          raw: n,
        }))
        .filter((item) => {
          // If notification links to an inventory_request, only show to admins
          try {
            let link = item.raw?.notificationlink;
            // notificationlink may be stored as JSON string or object
            if (typeof link === 'string') {
              try { link = JSON.parse(link); } catch {} // leave as string if parse fails
            }

            if (link && (link.inventory_request_id || link.inventory_request_id === 0)) {
              // If notification links to an inventory_request and also includes a user_id,
              // show it only to that user (the requester). If it does NOT include user_id,
              // treat it as an admin-targeted notification and show only to admins.
              if (link.user_id) {
                // show only to the requesting user
                return userId === link.user_id;
              }

              // admin-targeted inventory request notification
              if (!isAdmin) {
                // Debug: admin-only notification being filtered out
                console.debug('Filtering inventory_request notification for non-admin user', { itemId: item.id });
                return false;
              }
              return true;
            }
          } catch (e) {
            // ignore parse errors and show the notification
            console.warn('Error parsing notificationlink', e);
          }
          return true;
        });

      setNotifications(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleOpenNotification = (item: NotificationItem) => {
    setReadIds(prev => new Set(prev).add(item.id));

    // If notification references an inventory_request, navigate accordingly:
    // - If notification has a user_id -> show user-facing approved request page
    // - Otherwise -> show admin review page
    try {
      let link: any = item.raw?.notificationlink;
      if (typeof link === 'string') {
        try { link = JSON.parse(link); } catch (e) { /* leave as string */ }
      }

      if (link && (link.inventory_request_id || link.inventory_request_id === 0)) {
        const rid = String(link.inventory_request_id);
        // if notification carries a user_id, navigate the requester to the approved-request page
        if (link.user_id) {
          console.log("router")
          router.push({ pathname: '/borrow/approved-request', params: { requestId: rid } } as any);
          return;
        }

        // otherwise, navigate admin to the review page
        router.push({ pathname: '/admin/inventory_requests', params: { requestId: rid } } as any);
        return;
      }
    } catch (e) {
      console.warn('Failed to parse notification link', e);
    }

    console.log('Open notification', item.id, item.raw);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const sorted = [
    ...notifications.filter(n => !readIds.has(n.id)),
    ...notifications.filter(n => readIds.has(n.id)),
  ];

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => handleOpenNotification(item)}
            >
              {!readIds.has(item.id) && <View style={styles.unreadDot} />}

              <View style={styles.textContainer}>
                <Text style={[styles.title, !readIds.has(item.id) && styles.unreadTitle]}>{item.title}</Text>
                {item.subtitle ? <Text style={styles.subtitle}>{item.subtitle}</Text> : null}
                <Text style={styles.date}>{formatDate(item.date)}</Text>
              </View>

              <FontAwesome name="angle-right" size={24} color="#666" />
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onRefresh={loadNotifications}
          refreshing={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { backgroundColor: '#fff', width: '100%', height: '100%' },
  container: { alignSelf: 'center', width: '100%', maxWidth: 600, backgroundColor: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', height: 80, paddingHorizontal: 16 },
  rowPressed: { backgroundColor: '#f2f2f2' },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'red', marginRight: 12 },
  textContainer: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 16, color: '#555' },
  unreadTitle: { fontWeight: 'bold', color: '#000' },
  subtitle: { fontSize: 14, color: '#777', marginTop: 2 },
  date: { fontSize: 12, color: '#aaa', marginTop: 2 },
  separator: { height: 1, backgroundColor: '#eee', marginHorizontal: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default NotificationsInbox;
