// notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import * as Application from "expo-application";
import { useAuth } from '@/components/universal/useAuth';

const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Foreground behavior: show alert, play sound, set badge
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export type PushRegistration = {
  token: string | null;
  permissionStatus: Notifications.PermissionStatus;
};


/**
 * Subscribe to notification delivery (foreground) and user responses (tap from bg/quit).
 * Returns an unsubscribe function to clean up listeners.
 */
export function subscribeNotifications(params: {
  onReceive?: (notification: Notifications.Notification) => void;
  onRespond?: (response: Notifications.NotificationResponse) => void;
}) {
  const { onReceive, onRespond } = params;

  const receivedSub = Notifications.addNotificationReceivedListener((n) => {
    // fires when a notification arrives while app is in foreground
    console.log("Notification foreground: ", n)
    onReceive?.(n);
  });

  const responseSub = Notifications.addNotificationResponseReceivedListener((resp) => {
    // fires when user taps a notification (from background or quit)
    console.log("Notification background: ", resp)
    onRespond?.(resp);
  });

  return () => {
    receivedSub.remove();
    responseSub.remove();
  };
}

/**
 * Optional helper to parse deep-link/navigation intent from notification data
 */
export function getRouteFromNotificationData(data: any): { screen?: string; params?: any } {
  // Example convention:
  // data = { route: "MessageDetail", params: { id: "123" } }
  if (data?.route) return { screen: data.route, params: data.params ?? {} };
  return {};
}


export async function registerForPushAsync() {
  if (!Device.isDevice) return null;

  // Android: create a channel BEFORE requesting permission (A13+)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      bypassDnd: false,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC
    });
  }

  // Get or ask for permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  // Get Expo push token (ensure your EAS projectId is set)
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  const token = (
    await Notifications.getExpoPushTokenAsync({ projectId })
  ).data;
  return token;
}

export async function savePushTokenToDB(token: string, platform: "ios" | "android" | "web", deviceId: string, supabaseAccessToken: string, userID: string | null) {

  const resp = await fetch("https://ppmszdaibfhfkpbsgfxe.supabase.co/functions/v1/save_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseAccessToken}`,
    },
    body: JSON.stringify({ token, platform, deviceId, userID }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    console.log("Error: ", err.error)
    throw new Error(err.error || `HTTP ${resp.status}`);
  }
}



export async function updateUserIDForToken(userID: string | null) {

  const token = await registerForPushAsync();
  console.log(userID, token)
  //console.log("Role: ", role);
  if (!token) return;
  // Example deviceId (Android: ANDROID_ID; iOS: vendorId fallback; else random)
  const deviceId =
    Platform.OS === "android"
      ? Application.getAndroidId() ?? "unknown-android"
      : Application.getIosIdForVendorAsync
        ? (await Application.getIosIdForVendorAsync()) ?? "unknown-ios"
        : "unknown";
  //console.log("Layout deviceID: ", deviceId, userID)
  await savePushTokenToDB(token, Platform.OS === "ios" ? "ios" : "android", deviceId, supabaseAnonKey, userID);
}

export async function getUserNotification(userID: string | undefined, isAdmin: boolean) {
  if (userID && isAdmin) {
    const orFilter = [
      `notificationlink->>user_id.eq.${userID}`,
      "notificationgroupid.eq.1",
      "notificationlink->>user_id.is.null",
    ].join(",");
    const { data, error } = await supabase
      .from('notification')
      .select('*')
      .or(orFilter)
      .order('notificationid', { ascending: false })
      .limit(100);
    //console.log("NOTIFICATIONS admin user: ", data?.length, data);
    return data;
  }
  else if (userID && !isAdmin) {
    const orFilter = [
      `notificationlink->>user_id.eq.${userID}`,
      "and(notificationgroupid.is.null",
      "notificationlink->>user_id.is.null)",
    ].join(",");
    const { data, error } = await supabase
      .from('notification')
      .select('*')
      .or(orFilter)
      .order('notificationid', { ascending: false })
      .limit(100);
    //console.log("NOTIFICATIONS user : ", data?.length, data);
    return data;
  }
  else if (!userID && !isAdmin) {
    const orFilter = [
      "notificationgroupid.is.null",
      "notificationlink->>user_id.is.null",
    ].join(",");
    const { data, error } = await supabase
      .from('notification')
      .select('*')
      .or(orFilter)
      .order('notificationid', { ascending: false })
      .limit(100);
    //console.log("NOTIFICATIONS: ", data?.length);
    return data;
  }

}