export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
      orders: {
        Row: {
          created_at: string
          id: string
          special_instructions: string | null
          status: string
          table_number: string | null
          total_amount: number
          updated_at: string
          user_id: string
          venue_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          special_instructions?: string | null
          status?: string
          table_number?: string | null
          total_amount: number
          updated_at?: string
          user_id: string
          venue_id: string
        }
        Update: {
          created_at?: string
          id?: string
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
          category_id: string
          created_at: string
          description: string | null
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
          category_id: string
          created_at?: string
          description?: string | null
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
          category_id?: string
          created_at?: string
          description?: string | null
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
