import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchUser() {
      setLoading(true);
      const { data, error } = await authService.getCurrentUser();
      if (isMounted) {
        setUser(data?.session?.user ?? null);
        setLoading(false);
      }
    }
    fetchUser();
    return () => { isMounted = false; };
  }, []);

  return { user, loading };
}
