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
      conversations: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          seller_id: string
          status: string
          ticket_id: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          seller_id: string
          status?: string
          ticket_id: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          seller_id?: string
          status?: string
          ticket_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string
          city: string
          created_at: string | null
          description: string | null
          event_date: string
          id: string
          image_url: string | null
          name: string
          ticket_types: string[] | null
          university_id: string | null
          venue: string
          venue_id: string | null
        }
        Insert: {
          category: string
          city: string
          created_at?: string | null
          description?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          name: string
          ticket_types?: string[] | null
          university_id?: string | null
          venue: string
          venue_id?: string | null
        }
        Update: {
          category?: string
          city?: string
          created_at?: string | null
          description?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          name?: string
          ticket_types?: string[] | null
          university_id?: string | null
          venue?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          message_type: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message_type?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message_type?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          buyer_id: string
          created_at: string | null
          id: string
          message: string | null
          offered_price: number
          seller_id: string
          status: string
          ticket_id: string
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          id?: string
          message?: string | null
          offered_price: number
          seller_id: string
          status?: string
          ticket_id: string
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          id?: string
          message?: string | null
          offered_price?: number
          seller_id?: string
          status?: string
          ticket_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offers_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bank_account_name: string | null
          bank_account_number: string | null
          bank_name: string | null
          bank_sort_code: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_verified: boolean | null
          phone_number: string | null
          university: string
          updated_at: string | null
        }
        Insert: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bank_sort_code?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          is_verified?: boolean | null
          phone_number?: string | null
          university: string
          updated_at?: string | null
        }
        Update: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bank_sort_code?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_verified?: boolean | null
          phone_number?: string | null
          university?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          created_at: string | null
          description: string | null
          event_id: string
          id: string
          is_negotiable: boolean | null
          original_price: number
          quantity: number
          seller_id: string
          selling_price: number
          sold_at: string | null
          status: string
          ticket_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_id: string
          id?: string
          is_negotiable?: boolean | null
          original_price: number
          quantity?: number
          seller_id: string
          selling_price: number
          sold_at?: string | null
          status?: string
          ticket_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_id?: string
          id?: string
          is_negotiable?: boolean | null
          original_price?: number
          quantity?: number
          seller_id?: string
          selling_price?: number
          sold_at?: string | null
          status?: string
          ticket_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      user_university_pins: {
        Row: {
          created_at: string
          id: string
          university_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          university_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          university_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_university_pins_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string | null
          capacity: number | null
          city: string
          created_at: string
          id: string
          name: string
          university_id: string | null
        }
        Insert: {
          address?: string | null
          capacity?: number | null
          city: string
          created_at?: string
          id?: string
          name: string
          university_id?: string | null
        }
        Update: {
          address?: string | null
          capacity?: number | null
          city?: string
          created_at?: string
          id?: string
          name?: string
          university_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
