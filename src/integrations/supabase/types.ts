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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      check_ins: {
        Row: {
          bonus_type: string | null
          created_at: string
          id: string
          points_earned: number
          user_id: string
          venue_id: string
        }
        Insert: {
          bonus_type?: string | null
          created_at?: string
          id?: string
          points_earned?: number
          user_id: string
          venue_id: string
        }
        Update: {
          bonus_type?: string | null
          created_at?: string
          id?: string
          points_earned?: number
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          state: string
        }
        Insert: {
          country?: string
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          name: string
          state: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          state?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_at: string
          changed_by_user_id: string | null
          duration_seconds: number | null
          id: string
          notes: string | null
          order_id: string
          previous_status: string | null
          status: string
        }
        Insert: {
          changed_at?: string
          changed_by_user_id?: string | null
          duration_seconds?: number | null
          id?: string
          notes?: string | null
          order_id: string
          previous_status?: string | null
          status: string
        }
        Update: {
          changed_at?: string
          changed_by_user_id?: string | null
          duration_seconds?: number | null
          id?: string
          notes?: string | null
          order_id?: string
          previous_status?: string | null
          status?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          completed_at: string | null
          created_at: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          preparing_at: string | null
          ready_at: string | null
          received_at: string | null
          special_instructions: string | null
          status: string
          table_number: string | null
          total_amount: number
          updated_at: string
          user_id: string
          venue_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          preparing_at?: string | null
          ready_at?: string | null
          received_at?: string | null
          special_instructions?: string | null
          status?: string
          table_number?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
          venue_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          preparing_at?: string | null
          ready_at?: string | null
          received_at?: string | null
          special_instructions?: string | null
          status?: string
          table_number?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          type: string
          used: boolean
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          type: string
          used?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          type?: string
          used?: boolean
        }
        Relationships: []
      }
      points_transactions: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          order_id: string | null
          points: number
          reason: string
          reward_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          points: number
          reason: string
          reward_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          points?: number
          reason?: string
          reward_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          alcohol_content: number | null
          allergy_information: string | null
          category_id: string
          created_at: string
          description: string | null
          fine_print: string | null
          id: string
          image_url: string | null
          is_available: boolean
          is_featured: boolean
          name: string
          price: number
          tags: string[] | null
          updated_at: string
          venue_id: string
          volume_ml: number | null
        }
        Insert: {
          alcohol_content?: number | null
          allergy_information?: string | null
          category_id: string
          created_at?: string
          description?: string | null
          fine_print?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          name: string
          price: number
          tags?: string[] | null
          updated_at?: string
          venue_id: string
          volume_ml?: number | null
        }
        Update: {
          alcohol_content?: number | null
          allergy_information?: string | null
          category_id?: string
          created_at?: string
          description?: string | null
          fine_print?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          name?: string
          price?: number
          tags?: string[] | null
          updated_at?: string
          venue_id?: string
          volume_ml?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          birthday: string | null
          city: string | null
          country_code: string | null
          created_at: string
          customer_id: string
          email: string | null
          external_id: string | null
          first_name: string | null
          gender: string | null
          home_phone: string | null
          id_document_url: string | null
          last_name: string | null
          mobile_number: string | null
          postal_code: string | null
          state: string | null
          updated_at: string
          user_id: string
          work_phone: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          birthday?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          customer_id?: string
          email?: string | null
          external_id?: string | null
          first_name?: string | null
          gender?: string | null
          home_phone?: string | null
          id_document_url?: string | null
          last_name?: string | null
          mobile_number?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          work_phone?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          birthday?: string | null
          city?: string | null
          country_code?: string | null
          created_at?: string
          customer_id?: string
          email?: string | null
          external_id?: string | null
          first_name?: string | null
          gender?: string | null
          home_phone?: string | null
          id_document_url?: string | null
          last_name?: string | null
          mobile_number?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          work_phone?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_id: string
          referred_points: number
          referrer_id: string
          referrer_points: number
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_id: string
          referred_points?: number
          referrer_id: string
          referrer_points?: number
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_id?: string
          referred_points?: number
          referrer_id?: string
          referrer_points?: number
          status?: string
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          order_id: string | null
          points_spent: number
          reward_id: string
          status: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          order_id?: string | null
          points_spent: number
          reward_id: string
          status?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          order_id?: string | null
          points_spent?: number
          reward_id?: string
          status?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_tiers: {
        Row: {
          benefits: Json | null
          color: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          minimum_points: number
          name: string
          updated_at: string
        }
        Insert: {
          benefits?: Json | null
          color?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          minimum_points?: number
          name: string
          updated_at?: string
        }
        Update: {
          benefits?: Json | null
          color?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          minimum_points?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          created_at: string
          current_redemptions: number
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          max_redemptions: number | null
          minimum_tier_id: string | null
          name: string
          points_cost: number
          product_id: string | null
          reward_type: string
          reward_value: number | null
          updated_at: string
          venue_id: string | null
        }
        Insert: {
          created_at?: string
          current_redemptions?: number
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          minimum_tier_id?: string | null
          name: string
          points_cost: number
          product_id?: string | null
          reward_type: string
          reward_value?: number | null
          updated_at?: string
          venue_id?: string | null
        }
        Update: {
          created_at?: string
          current_redemptions?: number
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          minimum_tier_id?: string | null
          name?: string
          points_cost?: number
          product_id?: string | null
          reward_type?: string
          reward_value?: number | null
          updated_at?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rewards_minimum_tier_id_fkey"
            columns: ["minimum_tier_id"]
            isOneToOne: false
            referencedRelation: "reward_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          anniversary_date: string | null
          available_points: number
          birthday: string | null
          created_at: string
          id: string
          lifetime_spent: number
          referral_code: string | null
          referred_by: string | null
          reward_tier_id: string | null
          social_sharing_enabled: boolean
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          anniversary_date?: string | null
          available_points?: number
          birthday?: string | null
          created_at?: string
          id?: string
          lifetime_spent?: number
          referral_code?: string | null
          referred_by?: string | null
          reward_tier_id?: string | null
          social_sharing_enabled?: boolean
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          anniversary_date?: string | null
          available_points?: number
          birthday?: string | null
          created_at?: string
          id?: string
          lifetime_spent?: number
          referral_code?: string | null
          referred_by?: string | null
          reward_tier_id?: string | null
          social_sharing_enabled?: boolean
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_loyalty_tier_id_fkey"
            columns: ["reward_tier_id"]
            isOneToOne: false
            referencedRelation: "reward_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string
          category_id: string | null
          city_id: string
          created_at: string
          description: string | null
          hours_friday: string | null
          hours_monday: string | null
          hours_saturday: string | null
          hours_sunday: string | null
          hours_thursday: string | null
          hours_tuesday: string | null
          hours_wednesday: string | null
          id: string
          is_active: boolean
          latitude: number
          longitude: number
          name: string
          phone: string | null
          price_range: number | null
          rating: number | null
          review_count: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address: string
          category_id?: string | null
          city_id: string
          created_at?: string
          description?: string | null
          hours_friday?: string | null
          hours_monday?: string | null
          hours_saturday?: string | null
          hours_sunday?: string | null
          hours_thursday?: string | null
          hours_tuesday?: string | null
          hours_wednesday?: string | null
          id?: string
          is_active?: boolean
          latitude: number
          longitude: number
          name: string
          phone?: string | null
          price_range?: number | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          category_id?: string | null
          city_id?: string
          created_at?: string
          description?: string | null
          hours_friday?: string | null
          hours_monday?: string | null
          hours_saturday?: string | null
          hours_sunday?: string | null
          hours_thursday?: string | null
          hours_tuesday?: string | null
          hours_wednesday?: string | null
          id?: string
          is_active?: boolean
          latitude?: number
          longitude?: number
          name?: string
          phone?: string | null
          price_range?: number | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "venue_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venues_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_otps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_order_status: {
        Args: {
          new_status: string
          notes_param?: string
          order_id_param: string
        }
        Returns: undefined
      }
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
