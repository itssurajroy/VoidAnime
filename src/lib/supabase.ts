import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase: SupabaseClient | null = null;
let supabaseAdmin: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
} else {
  console.warn('Supabase credentials not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY to your environment.');
}

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { supabase, supabaseAdmin };

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Please configure NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.');
  }
  return supabase;
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          avatar_url: string | null;
          role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'EDITOR' | 'SEO_MANAGER' | 'ANALYST' | 'USER';
          status: 'ACTIVE' | 'INACTIVE' | 'BANNED' | 'PENDING_VERIFICATION';
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
          xp: number;
          level: number;
          void_coins: number;
          current_streak: number;
          longest_streak: number;
          badges: string[];
          daily_xp_earned: number;
          last_xp_reset_date: string | null;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      watchlist: {
        Row: {
          id: string;
          user_id: string;
          anime_id: string;
          anime_name: string;
          poster: string;
          anime_type: string | null;
          episodes: { sub: number; dub: number };
          status: 'WATCHING' | 'COMPLETED' | 'PLAN_TO_WATCH' | 'ON_HOLD' | 'DROPPED';
          progress: number;
          total_episodes: number;
          user_rating: number | null;
          notes: string | null;
          is_private: boolean;
          added_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['watchlist']['Row'], 'id' | 'added_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['watchlist']['Row']>;
      };
      watch_history: {
        Row: {
          id: string;
          user_id: string;
          anime_id: string;
          anime_name: string;
          anime_poster: string;
          episode_id: string;
          episode_number: number;
          progress: number;
          duration: number;
          watched_at: string;
        };
        Insert: Omit<Database['public']['Tables']['watch_history']['Row'], 'id' | 'watched_at'>;
        Update: Partial<Database['public']['Tables']['watch_history']['Row']>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          anime_id: string;
          anime_name: string;
          poster: string;
          added_at: string;
        };
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'added_at'>;
        Update: Partial<Database['public']['Tables']['favorites']['Row']>;
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          anime_id: string;
          anime_name: string;
          poster: string;
          rating: number;
          content: string;
          is_spoiler: boolean;
          likes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Row']>;
      };
      comments: {
        Row: {
          id: string;
          anime_id: string;
          episode_id: string | null;
          user_id: string;
          username: string;
          user_avatar: string | null;
          content: string;
          likes: number;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['comments']['Row']>;
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          user_avatar: string | null;
          title: string;
          content: string;
          tags: string[];
          likes: number;
          views: number;
          is_pinned: boolean;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['community_posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['community_posts']['Row']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          link: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
      };
    };
  };
};
