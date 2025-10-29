export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      button_config: {
        Row: {
          background_color: string | null
          background_gradient: string | null
          background_image_id: number | null
          button_config_id: number
          icon: string | null
          icon_color: string | null
          internal_link: string | null
          internal_page_id: number | null
          link: string | null
          sub_text: string | null
          text: string | null
          text_color: string | null
        }
        Insert: {
          background_color?: string | null
          background_gradient?: string | null
          background_image_id?: number | null
          button_config_id?: number
          icon?: string | null
          icon_color?: string | null
          internal_link?: string | null
          internal_page_id?: number | null
          link?: string | null
          sub_text?: string | null
          text?: string | null
          text_color?: string | null
        }
        Update: {
          background_color?: string | null
          background_gradient?: string | null
          background_image_id?: number | null
          button_config_id?: number
          icon?: string | null
          icon_color?: string | null
          internal_link?: string | null
          internal_page_id?: number | null
          link?: string | null
          sub_text?: string | null
          text?: string | null
          text_color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "button_config_background_image_id_fkey"
            columns: ["background_image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["image_id"]
          },
          {
            foreignKeyName: "button_config_internal_page_id_fkey"
            columns: ["internal_page_id"]
            isOneToOne: false
            referencedRelation: "internal_page"
            referencedColumns: ["internal_page_id"]
          },
        ]
      }
      button_setup: {
        Row: {
          button_config_id: number
          button_id: number
          button_name: string
          page_id: number
          shape_id: number | null
          type_id: number | null
        }
        Insert: {
          button_config_id: number
          button_id?: number
          button_name: string
          page_id: number
          shape_id?: number | null
          type_id?: number | null
        }
        Update: {
          button_config_id?: number
          button_id?: number
          button_name?: string
          page_id?: number
          shape_id?: number | null
          type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "button_setup_button_config_id_fkey"
            columns: ["button_config_id"]
            isOneToOne: false
            referencedRelation: "button_config"
            referencedColumns: ["button_config_id"]
          },
          {
            foreignKeyName: "button_setup_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "page"
            referencedColumns: ["page_id"]
          },
        ]
      }
      connect_button: {
        Row: {
          connect_button_id: number
          connect_button_name: string
          forms_id: number | null
        }
        Insert: {
          connect_button_id?: number
          connect_button_name: string
          forms_id?: number | null
        }
        Update: {
          connect_button_id?: number
          connect_button_name?: string
          forms_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "connect_button_forms_id_fkey"
            columns: ["forms_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["forms_id"]
          },
        ]
      }
      event: {
        Row: {
          date: string | null
          description: string | null
          event_id: number
          group: string | null
          guest_speaker: string | null
          image_id: number | null
          is_removed: boolean
          latitude: number | null
          link: string | null
          location: string | null
          longitude: number | null
          time: string | null
          title: string
        }
        Insert: {
          date?: string | null
          description?: string | null
          event_id?: number
          group?: string | null
          guest_speaker?: string | null
          image_id?: number | null
          is_removed?: boolean
          latitude?: number | null
          link?: string | null
          location?: string | null
          longitude?: number | null
          time?: string | null
          title: string
        }
        Update: {
          date?: string | null
          description?: string | null
          event_id?: number
          group?: string | null
          guest_speaker?: string | null
          image_id?: number | null
          is_removed?: boolean
          latitude?: number | null
          link?: string | null
          location?: string | null
          longitude?: number | null
          time?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["image_id"]
          },
        ]
      }
      forms: {
        Row: {
          forms_id: number
          link: string
          title: string
        }
        Insert: {
          forms_id?: number
          link: string
          title: string
        }
        Update: {
          forms_id?: number
          link?: string
          title?: string
        }
        Relationships: []
      }
      images: {
        Row: {
          image_id: number
          image_link: string
        }
        Insert: {
          image_id?: number
          image_link: string
        }
        Update: {
          image_id?: number
          image_link?: string
        }
        Relationships: []
      }
      internal_page: {
        Row: {
          internal_link: string | null
          internal_page_html: string | null
          internal_page_id: number
        }
        Insert: {
          internal_link?: string | null
          internal_page_html?: string | null
          internal_page_id?: number
        }
        Update: {
          internal_link?: string | null
          internal_page_html?: string | null
          internal_page_id?: number
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          created_by_id: string | null
          created_date: string
          deleted_by_id: string | null
          deleted_date: string | null
          inventory_item_id: number
          is_available: boolean
          item_barcode: string | null
          item_category_id: number | null
          item_description: string | null
          item_image_id: number | null
          item_location: string | null
          item_name: string
          quantity_available: number | null
          quantity_total: number | null
          updated_at: string | null
        }
        Insert: {
          created_by_id?: string | null
          created_date?: string
          deleted_by_id?: string | null
          deleted_date?: string | null
          inventory_item_id?: number
          is_available?: boolean
          item_barcode?: string | null
          item_category_id?: number | null
          item_description?: string | null
          item_image_id?: number | null
          item_location?: string | null
          item_name: string
          quantity_available?: number | null
          quantity_total?: number | null
          updated_at?: string | null
        }
        Update: {
          created_by_id?: string | null
          created_date?: string
          deleted_by_id?: string | null
          deleted_date?: string | null
          inventory_item_id?: number
          is_available?: boolean
          item_barcode?: string | null
          item_category_id?: number | null
          item_description?: string | null
          item_image_id?: number | null
          item_location?: string | null
          item_name?: string
          quantity_available?: number | null
          quantity_total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_item_category_id_fkey"
            columns: ["item_category_id"]
            isOneToOne: false
            referencedRelation: "item_category"
            referencedColumns: ["item_category_id"]
          },
          {
            foreignKeyName: "inventory_items_item_image_id_fkey"
            columns: ["item_image_id"]
            isOneToOne: false
            referencedRelation: "items_images"
            referencedColumns: ["items_image_id"]
          },
        ]
      }
      inventory_request: {
        Row: {
          inventory_request_id: number
          is_approved: boolean | null
          return_date: string | null
          start_date: string | null
          user_requesting_id: string | null
          user_reviewing_id: string | null
        }
        Insert: {
          inventory_request_id?: number
          is_approved?: boolean | null
          return_date?: string | null
          start_date?: string | null
          user_requesting_id?: string | null
          user_reviewing_id?: string | null
        }
        Update: {
          inventory_request_id?: number
          is_approved?: boolean | null
          return_date?: string | null
          start_date?: string | null
          user_requesting_id?: string | null
          user_reviewing_id?: string | null
        }
        Relationships: []
      }
      inventory_request_items: {
        Row: {
          inventory_item_id: number
          inventory_request_id: number
          inventory_request_items_id: number
          is_scanned_borrowed: boolean
          is_scanned_returned: boolean
          return_image_id: number | null
        }
        Insert: {
          inventory_item_id: number
          inventory_request_id: number
          inventory_request_items_id?: number
          is_scanned_borrowed?: boolean
          is_scanned_returned?: boolean
          return_image_id?: number | null
        }
        Update: {
          inventory_item_id?: number
          inventory_request_id?: number
          inventory_request_items_id?: number
          is_scanned_borrowed?: boolean
          is_scanned_returned?: boolean
          return_image_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_request_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["inventory_item_id"]
          },
          {
            foreignKeyName: "inventory_request_items_inventory_request_id_fkey"
            columns: ["inventory_request_id"]
            isOneToOne: false
            referencedRelation: "inventory_request"
            referencedColumns: ["inventory_request_id"]
          },
          {
            foreignKeyName: "inventory_request_items_return_image_id_fkey"
            columns: ["return_image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["image_id"]
          },
        ]
      }
      invitems_tags: {
        Row: {
          inventory_item_id: number
          item_tag_id: number
        }
        Insert: {
          inventory_item_id: number
          item_tag_id: number
        }
        Update: {
          inventory_item_id?: number
          item_tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "invitems_tags_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["inventory_item_id"]
          },
          {
            foreignKeyName: "invitems_tags_item_tag_id_fkey"
            columns: ["item_tag_id"]
            isOneToOne: false
            referencedRelation: "item_tag"
            referencedColumns: ["item_tag_id"]
          },
        ]
      }
      item_category: {
        Row: {
          item_category_id: number
          item_category_name: string
        }
        Insert: {
          item_category_id?: number
          item_category_name: string
        }
        Update: {
          item_category_id?: number
          item_category_name?: string
        }
        Relationships: []
      }
      item_tag: {
        Row: {
          item_tag_id: number
          item_tag_name: string
        }
        Insert: {
          item_tag_id?: number
          item_tag_name: string
        }
        Update: {
          item_tag_id?: number
          item_tag_name?: string
        }
        Relationships: []
      }
      items_images: {
        Row: {
          image_link: string
          items_image_id: number
        }
        Insert: {
          image_link: string
          items_image_id?: number
        }
        Update: {
          image_link?: string
          items_image_id?: number
        }
        Relationships: []
      }
      notification: {
        Row: {
          notificationdescription: string | null
          notificationgroupid: number
          notificationid: number
          notificationlink: Json | null
          notificationscheduledtime: string | null
          notificationsenttime: string | null
          notificationtitle: string
        }
        Insert: {
          notificationdescription?: string | null
          notificationgroupid: number
          notificationid?: number
          notificationlink?: Json | null
          notificationscheduledtime?: string | null
          notificationsenttime?: string | null
          notificationtitle: string
        }
        Update: {
          notificationdescription?: string | null
          notificationgroupid?: number
          notificationid?: number
          notificationlink?: Json | null
          notificationscheduledtime?: string | null
          notificationsenttime?: string | null
          notificationtitle?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_notificationgroupid_fkey"
            columns: ["notificationgroupid"]
            isOneToOne: false
            referencedRelation: "notification_group"
            referencedColumns: ["notificationgroupid"]
          },
        ]
      }
      notification_group: {
        Row: {
          groupname: string
          notificationgroupid: number
        }
        Insert: {
          groupname: string
          notificationgroupid?: number
        }
        Update: {
          groupname?: string
          notificationgroupid?: number
        }
        Relationships: []
      }
      page: {
        Row: {
          page_id: number
          page_name: string
        }
        Insert: {
          page_id?: number
          page_name: string
        }
        Update: {
          page_id?: number
          page_name?: string
        }
        Relationships: []
      }
      role: {
        Row: {
          role_id: number
          role_name: string
        }
        Insert: {
          role_id?: number
          role_name: string
        }
        Update: {
          role_id?: number
          role_name?: string
        }
        Relationships: []
      }
      slider_image: {
        Row: {
          description: string | null
          image_id: number | null
          is_removed: boolean
          slider_image_id: number
          title: string | null
        }
        Insert: {
          description?: string | null
          image_id?: number | null
          is_removed?: boolean
          slider_image_id?: number
          title?: string | null
        }
        Update: {
          description?: string | null
          image_id?: number | null
          is_removed?: boolean
          slider_image_id?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "slider_image_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["image_id"]
          },
        ]
      }
      user_devices: {
        Row: {
          expo_push_token: string
          id: string
          last_seen_at: string | null
          platform: string | null
          user_id: string
        }
        Insert: {
          expo_push_token: string
          id?: string
          last_seen_at?: string | null
          platform?: string | null
          user_id: string
        }
        Update: {
          expo_push_token?: string
          id?: string
          last_seen_at?: string | null
          platform?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_role: {
        Row: {
          role_id: number
          user_id: string
          user_role_id: number
        }
        Insert: {
          role_id: number
          user_id: string
          user_role_id?: number
        }
        Update: {
          role_id?: number
          user_id?: string
          user_role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_role_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role"
            referencedColumns: ["role_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
