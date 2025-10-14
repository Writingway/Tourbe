// Types de base pour la base de données Supabase
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
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'user' | 'admin';
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'user' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'user' | 'admin';
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_results: {
        Row: {
          id: string;
          user_id: string;
          quiz_data: Json;
          recommendations: Json;
          user_level: 'BEGINNER' | 'INTERMEDIATE' | 'CONNOISSEUR' | null;
          completion_time: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_data: Json;
          recommendations: Json;
          user_level?: 'BEGINNER' | 'INTERMEDIATE' | 'CONNOISSEUR' | null;
          completion_time?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_data?: Json;
          recommendations?: Json;
          user_level?: 'BEGINNER' | 'INTERMEDIATE' | 'CONNOISSEUR' | null;
          completion_time?: number | null;
          created_at?: string;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          user_id: string | null;
          event_type: string;
          event_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_type: string;
          event_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          event_type?: string;
          event_data?: Json | null;
          created_at?: string;
        };
      };
      whiskies: {
        Row: {
          id: string;
          name: string;
          region: string;
          distillery: string;
          abv: number;
          price_band: string;
          style: string[];
          intensity: string;
          mouthfeel: string[];
          finish: Json;
          experimental: boolean;
          tasting_note_short: string;
          image: string;
          distillery_location: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          region: string;
          distillery: string;
          abv: number;
          price_band: string;
          style: string[];
          intensity: string;
          mouthfeel: string[];
          finish: Json;
          experimental?: boolean;
          tasting_note_short: string;
          image: string;
          distillery_location: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          region?: string;
          distillery?: string;
          abv?: number;
          price_band?: string;
          style?: string[];
          intensity?: string;
          mouthfeel?: string[];
          finish?: Json;
          experimental?: boolean;
          tasting_note_short?: string;
          image?: string;
          distillery_location?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Types utilitaires
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type QuizResult = Database['public']['Tables']['quiz_results']['Row'];
export type QuizResultInsert = Database['public']['Tables']['quiz_results']['Insert'];

export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row'];
export type AnalyticsEventInsert = Database['public']['Tables']['analytics_events']['Insert'];

export type WhiskyDB = Database['public']['Tables']['whiskies']['Row'];
export type WhiskyDBInsert = Database['public']['Tables']['whiskies']['Insert'];
export type WhiskyDBUpdate = Database['public']['Tables']['whiskies']['Update'];

export type UserRole = 'user' | 'admin';
export type UserLevel = 'BEGINNER' | 'INTERMEDIATE' | 'CONNOISSEUR';
