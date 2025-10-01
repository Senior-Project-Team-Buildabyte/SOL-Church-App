import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useAuth() {
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

    return {
        session: session,
        userstate: session?.user,
        loading: isLoading, // You can implement a loading state if needed
    };
}