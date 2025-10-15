import { Stack } from "expo-router";
import * as Application from "expo-application";
import HeaderBar from '../components/universal/header-bar';
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { Alert, Platform, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Session } from '@supabase/supabase-js'
import { useAuth } from "@/components/universal/useAuth";
import { getRouteFromNotificationData, registerForPushAsync, savePushTokenToDB, subscribeNotifications } from "@/services/notifications";
import * as Notifications from 'expo-notifications';


const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
// Create an auth context so child screens/components can read the session
const AuthContext = createContext<{ session: Session | null }>({ session: null });
export function useAuthContext() {
  return useContext(AuthContext);
}

export default function RootLayout() {
    const { session } = useAuth();
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
      if (!token) return;
      // Example deviceId (Android: ANDROID_ID; iOS: vendorId fallback; else random)
      const deviceId =
        Platform.OS === "android"
          ? Application.getAndroidId() ?? "unknown-android"
          : Application.getIosIdForVendorAsync
          ? (await Application.getIosIdForVendorAsync()) ?? "unknown-ios"
          : "unknown";
      console.log("Layout deviceID: ", deviceId)
      await savePushTokenToDB(token, Platform.OS === "ios" ? "ios" : "android", deviceId, supabaseAnonKey);
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
          // navigate(screen, params);
          console.log("Navigate to:", screen, params);
        }
      }
    });

    return () => {
      // cleanup listeners
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AuthContext.Provider value={{ session }}>
        <View style={{ flex: 1 }}>
          {/* {session && session.user ? <Stack key={session.user.id} session={session} /> : <Stack />} */}

          <Stack screenOptions={{ 
            header: () => <HeaderBar/>,
            headerShown: true }} />
        </View>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}