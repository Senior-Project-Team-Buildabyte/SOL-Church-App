// @ts-ignore - This is a workaround for the URL polyfill
import 'react-native-url-polyfill/auto';
// @ts-ignore - This is a workaround for AsyncStorage types
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types/supabase';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Create the Supabase client with type assertion
export const supabase: SupabaseClient<Database> = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // @ts-ignore - TypeScript doesn't recognize AsyncStorage type here
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Export types
export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;
export type TableRow<T extends TableName> = Tables[T]['Row'];
export type TableInsert<T extends TableName> = Tables[T]['Insert'];
export type TableUpdate<T extends TableName> = Tables[T]['Update'];
