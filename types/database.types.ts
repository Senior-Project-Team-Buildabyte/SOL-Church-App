import { Database as GeneratedTypes } from './supabase';

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ------------------------------------------------------------
// MEDIA LINK TYPE
// ------------------------------------------------------------
export type MediaLink = {
  id: number;
  title: string;
  link: string | null;
  internal_link: string | null;
  background_url: string | null;
  background_key: string | null;
  type: number;
  shape: number;
  created_at: string;
};

// ------------------------------------------------------------
// OVERRIDE DATABASE TYPES
// ------------------------------------------------------------
export type Database = GeneratedTypes & {
  public: {
    Tables: {

      // -----------------------------
      // media_links TABLE (correct)
      // -----------------------------
      media_links: {
        Row: MediaLink;
        Insert: {
          title: string;
          link?: string | null;
          internal_link?: string | null;
          background_url?: string | null;
          background_key?: string | null;
          type: number;
          shape: number;
        };
        Update: {
          id?: number;
          title?: string;
          link?: string | null;
          internal_link?: string | null;
          background_url?: string | null;
          background_key?: string | null;
          type?: number;
          shape?: number;
          created_at?: string;
        };
      },

      // -----------------------------
      // EXISTING items TABLE (untouched)
      // -----------------------------
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
      }
    },

    // -----------------------------
    // EXISTING FUNCTIONS (untouched)
    // -----------------------------
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
    }
  }
};
