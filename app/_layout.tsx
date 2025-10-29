import { router, Stack } from "expo-router";
import * as Application from "expo-application";
import HeaderBar from '../components/universal/header-bar';
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { Alert, Platform, View } from "react-native";
import { useEffect, useRef } from "react";
import { useAuth } from "@/components/universal/useAuth";
import { getRouteFromNotificationData, registerForPushAsync, savePushTokenToDB, subscribeNotifications } from "@/services/notifications";
import * as Notifications from 'expo-notifications';
import { AuthContext } from '@/context/authContext';


const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export default function RootLayout() {
    const { session, userstate, loading, role } = useAuth();
    const responseListener = useRef<Notifications.Subscription | null>(null);
    const receiveListener = useRef<Notifications.Subscription | null>(null);

  // const [session, setSession] = useState<Session | null>(null);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // On mount: fetch existing session (if user is already logged in)
  //   supabase.auth.getSession().then(({ data }) => {
  //     setSession(data.session);
  //     setIsLoading(false);
  //   });

  //   // Subscribe to auth state changes (login, logout, token refresh)
  //   const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
  //     setSession(newSession);
  //   });

  //   // Clean up subscription on unmount
  //   return () => {
  //     sub.subscription.unsubscribe();
  //   };
  // }, []);
   useEffect(() => {
    (async () => {
      const token = await registerForPushAsync();
      const userID = userstate?.identities![0].user_id ?? null;
      //console.log("Role: ", role);
      if (!token) return;
      // Example deviceId (Android: ANDROID_ID; iOS: vendorId fallback; else random)
      const deviceId =
        Platform.OS === "android"
          ? Application.getAndroidId() ?? "unknown-android"
          : Application.getIosIdForVendorAsync
          ? (await Application.getIosIdForVendorAsync()) ?? "unknown-ios"
          : "unknown";
      //console.log("Layout deviceID: ", deviceId)
      await savePushTokenToDB(token, Platform.OS === "ios" ? "ios" : "android", deviceId, supabaseAnonKey, userID);
    })();
    const unsubscribe = subscribeNotifications({
      onReceive: (n) => {
        // App in foreground: you might custom-handle
        const title = n.request.content.title ?? "Notification";
        const body = n.request.content.body ?? "";
        Alert.alert(title, body);
      },
      onRespond: (resp) => {
        // User tapped notif from bg/quit: route based on data
        const data = resp.notification.request.content.data;
        const { screen, params } = getRouteFromNotificationData(data);

        if (screen) {
          const path = screen.startsWith("/") ? screen : `/${screen}`;
          const stringParams = params
            ? Object.fromEntries(
              Object.entries(params).map(([k, v]) => [k, String(v)])
            )
            : undefined;

          router.push({
            pathname: path,
            params: stringParams
          } as any);
          console.log("Navigate to:", screen, params);
        }
      }
    });

    return () => {
      // cleanup listeners
      unsubscribe();
    };
  }, [loading]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AuthContext.Provider value={{ session, userstate, loading, role }}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ 
            header: () => <HeaderBar/>,
            headerShown: true }} />
        </View>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}
