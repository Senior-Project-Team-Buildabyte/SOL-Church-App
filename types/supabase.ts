export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          email: string;
          first_name: string | null;
          last_name: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: string;
          created_at?: string;
        };
      };
      items: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          quantity_available: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          quantity_available: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          quantity_available?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add other tables (categories, transactions, transaction_items) here
      // Following the same pattern as users table
    };
    Views: {
      // Add any views you might have
    };
    Functions: {
      // Add any database functions you might use
    };
  };
}