export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      menu_items: {
        Row: {
          accompaniment: string | null
          category: Database["public"]["Enums"]["menu_item_category"]
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_available: boolean
          menu_id: string
          name: string
          price: number
          restaurant_id: string
          updated_at: string
        }
        Insert: {
          accompaniment?: string | null
          category?: Database["public"]["Enums"]["menu_item_category"]
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_available?: boolean
          menu_id: string
          name: string
          price: number
          restaurant_id: string
          updated_at?: string
        }
        Update: {
          accompaniment?: string | null
          category?: Database["public"]["Enums"]["menu_item_category"]
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_available?: boolean
          menu_id?: string
          name?: string
          price?: number
          restaurant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_photos: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number
          id: string
          menu_id: string
          restaurant_id: string
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number
          id?: string
          menu_id: string
          restaurant_id: string
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number
          id?: string
          menu_id?: string
          restaurant_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_photos_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_photos_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          created_at: string
          description: string | null
          id: string
          menu_date: string
          published_at: string | null
          restaurant_id: string
          status: Database["public"]["Enums"]["menu_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          menu_date: string
          published_at?: string | null
          restaurant_id: string
          status?: Database["public"]["Enums"]["menu_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          menu_date?: string
          published_at?: string | null
          restaurant_id?: string
          status?: Database["public"]["Enums"]["menu_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menus_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json
          id: string
          is_read: boolean
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json
          id?: string
          is_read?: boolean
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json
          id?: string
          is_read?: boolean
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json
          paid_at: string | null
          provider: string
          provider_transaction_ref: string | null
          restaurant_id: string
          status: Database["public"]["Enums"]["payment_status"]
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          paid_at?: string | null
          provider?: string
          provider_transaction_ref?: string | null
          restaurant_id: string
          status?: Database["public"]["Enums"]["payment_status"]
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json
          paid_at?: string | null
          provider?: string
          provider_transaction_ref?: string | null
          restaurant_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          cancelled_at: string | null
          client_id: string
          confirmed_at: string | null
          created_at: string
          customer_name: string
          customer_phone: string
          id: string
          menu_id: string | null
          message: string | null
          party_size: number
          rejection_reason: string | null
          reservation_date: string
          reservation_time: string
          restaurant_id: string
          status: Database["public"]["Enums"]["reservation_status"]
          updated_at: string
        }
        Insert: {
          cancelled_at?: string | null
          client_id: string
          confirmed_at?: string | null
          created_at?: string
          customer_name: string
          customer_phone: string
          id?: string
          menu_id?: string | null
          message?: string | null
          party_size: number
          rejection_reason?: string | null
          reservation_date: string
          reservation_time: string
          restaurant_id: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
        }
        Update: {
          cancelled_at?: string | null
          client_id?: string
          confirmed_at?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          menu_id?: string | null
          message?: string | null
          party_size?: number
          rejection_reason?: string | null
          reservation_date?: string
          reservation_time?: string
          restaurant_id?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_followers: {
        Row: {
          client_id: string
          created_at: string
          id: string
          restaurant_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          restaurant_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_followers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_followers_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_hours: {
        Row: {
          close_time: string | null
          day_of_week: number
          id: string
          is_closed: boolean
          open_time: string | null
          restaurant_id: string
        }
        Insert: {
          close_time?: string | null
          day_of_week: number
          id?: string
          is_closed?: boolean
          open_time?: string | null
          restaurant_id: string
        }
        Update: {
          close_time?: string | null
          day_of_week?: number
          id?: string
          is_closed?: boolean
          open_time?: string | null
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_hours_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string | null
          capacity: number
          city: string | null
          country: string
          cover_image_url: string | null
          created_at: string
          cuisine_type: string | null
          description: string | null
          email: string | null
          formatted_address: string | null
          google_place_id: string | null
          accepts_reservations: boolean
          max_party_size: number
          reservation_instructions: string | null
          id: string
          is_active: boolean
          is_verified: boolean
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          owner_id: string
          phone: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          capacity?: number
          city?: string | null
          country?: string
          cover_image_url?: string | null
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          email?: string | null
          formatted_address?: string | null
          google_place_id?: string | null
          accepts_reservations?: boolean
          max_party_size?: number
          reservation_instructions?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          owner_id: string
          phone?: string | null
          slug?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          capacity?: number
          city?: string | null
          country?: string
          cover_image_url?: string | null
          created_at?: string
          cuisine_type?: string | null
          description?: string | null
          email?: string | null
          formatted_address?: string | null
          google_place_id?: string | null
          accepts_reservations?: boolean
          max_party_size?: number
          reservation_instructions?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          owner_id?: string
          phone?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          restaurant_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_end_at: string
          trial_start_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          restaurant_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_end_at?: string
          trial_start_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          restaurant_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_end_at?: string
          trial_start_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_payment_subscription: {
        Args: {
          p_restaurant_id: string
          p_amount?: number
          p_provider_ref?: string
          p_metadata?: Json
        }
        Returns: Json
      }
      generate_restaurant_slug: {
        Args: { p_id?: string; p_name: string }
        Returns: string
      }
      is_admin: { Args: never; Returns: boolean }
      is_restaurant_owner: {
        Args: { p_restaurant_id: string }
        Returns: boolean
      }
      is_subscription_active: {
        Args: { p_restaurant_id: string }
        Returns: boolean
      }
    }
    Enums: {
      menu_item_category:
        | "entree"
        | "plat"
        | "dessert"
        | "boisson"
        | "formule"
        | "autre"
      menu_status: "draft" | "published"
      notification_type:
        | "new_menu"
        | "reservation_confirmed"
        | "reservation_rejected"
        | "reservation_cancelled"
        | "reservation_completed"
        | "subscription_expiring"
        | "subscription_expired"
        | "system"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      reservation_status:
        | "pending"
        | "confirmed"
        | "rejected"
        | "cancelled"
        | "completed"
        | "no_show"
      subscription_status: "trialing" | "active" | "expired" | "cancelled"
      user_role: "client" | "restaurant_manager" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
