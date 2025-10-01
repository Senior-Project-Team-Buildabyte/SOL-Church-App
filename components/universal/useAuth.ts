import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { User } from "@supabase/supabase-js";

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        authService.getCurrentUser().then(user => {
            setIsLoggedIn(!!user);
        })
    }, []);

    return {
        userstate: isLoggedIn,
        loading: false, // You can implement a loading state if needed
    };
}