import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // On mount: fetch existing session (if user is already logged in)
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            //setIsLoading(false);
        });

        // Subscribe to auth state changes (login, logout, token refresh)
        const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
            if (_event === 'SIGNED_OUT') {
                setSession(null)
            } else if (newSession) {
            // } else { 
                setSession(newSession)
            }
            console.log(_event, newSession)

            if (_event === 'INITIAL_SESSION') {
                // handle initial session
                setIsLoading(false);
            } else if (_event === 'SIGNED_IN') {
                // if (newSession?.user.)
                // handle sign in event
            } else if (_event === 'SIGNED_OUT') {
                // router.replace('/');
                router.dismissTo('/');
                // handle sign out event
            } else if (_event === 'PASSWORD_RECOVERY') {
                router.push('/[auth]/update-password');
                // handle password recovery event
            } else if (_event === 'TOKEN_REFRESHED') {
                // handle token refreshed event
            } else if (_event === 'USER_UPDATED') {
                // handle user updated event
            }
        });

        // Clean up subscription on unmount
        return () => {
            sub.subscription.unsubscribe();
            console.log('unsubscribed from auth changes')
        };
    }, []);

    return {
        session: session,
        userstate: session?.user,
        loading: isLoading, // You can implement a loading state if needed
    };
}