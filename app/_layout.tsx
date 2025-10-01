import { Stack } from "expo-router";
import HeaderBar from '../components/universal/header-bar';
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import { supabase } from "@/lib/supabase";
import { createContext, useContext, useEffect, useState } from "react";
import { Session } from '@supabase/supabase-js'



// Create an auth context so child screens/components can read the session
const AuthContext = createContext<{ session: Session | null }>({ session: null });
export function useAuth() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On mount: fetch existing session (if user is already logged in)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    // Subscribe to auth state changes (login, logout, token refresh)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    // Clean up subscription on unmount
    return () => {
      sub.subscription.unsubscribe();
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