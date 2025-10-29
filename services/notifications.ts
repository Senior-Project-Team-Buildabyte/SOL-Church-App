// notifications.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';


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
    onReceive?.(n);
  });

  const responseSub = Notifications.addNotificationResponseReceivedListener((resp) => {
    // fires when user taps a notification (from background or quit)
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