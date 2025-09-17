import { Database as GeneratedTypes } from './supabase';

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = GeneratedTypes & {
  public: {
    Tables: {
      items: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          quantity_available: number;
          quantity_total: number;
          category_id: number | null;
          location: string | null;
          barcode: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          quantity_available: number;
          quantity_total: number;
          category_id?: number | null;
          location?: string | null;
          barcode?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          quantity_available?: number;
          quantity_total?: number;
          category_id?: number | null;
          location?: string | null;
          barcode?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      decrease_item_quantity: {
        Args: {
          item_id: number;
          amount: number;
        };
        Returns: Database['public']['Tables']['items']['Row'];
      };
      increase_item_quantity: {
        Args: {
          item_id: number;
          amount: number;
        };
        Returns: Database['public']['Tables']['items']['Row'];
      };
    };
  };
};
