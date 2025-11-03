import React, { createContext, useContext } from 'react';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  userstate: User | undefined;
  loading: boolean;
  role: number;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  userstate: undefined,
  loading: false,
  role: 3,
});

export const useAuthContext = () => useContext(AuthContext);
