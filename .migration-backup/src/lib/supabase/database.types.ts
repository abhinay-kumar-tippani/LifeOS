export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          color: string;
          icon: string;
          frequency: string;
          target_days: number;
          created_at: string;
          is_archived: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          color?: string;
          icon?: string;
          frequency?: string;
          target_days?: number;
          created_at?: string;
          is_archived?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          icon?: string;
          frequency?: string;
          target_days?: number;
          created_at?: string;
          is_archived?: boolean;
        };
      };
      habit_completions: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          created_at?: string;
        };
        Update: {
          habit_id?: string;
          user_id?: string;
          completed_date?: string;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          content: string;
          mood: string | null;
          tags: string[] | null;
          image_url: string | null;
          entry_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          content: string;
          mood?: string | null;
          tags?: string[] | null;
          image_url?: string | null;
          entry_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string | null;
          content?: string;
          mood?: string | null;
          tags?: string[] | null;
          image_url?: string | null;
          entry_date?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          quadrant: string | null;
          due_date: string | null;
          kanban_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          status?: string;
          priority?: string;
          quadrant?: string | null;
          due_date?: string | null;
          kanban_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: string;
          priority?: string;
          quadrant?: string | null;
          due_date?: string | null;
          kanban_order?: number;
          updated_at?: string;
        };
      };
      pomodoro_sessions: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          duration_minutes: number;
          break_minutes: number;
          completed: boolean;
          session_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id?: string | null;
          duration_minutes?: number;
          break_minutes?: number;
          completed?: boolean;
          session_date?: string;
          created_at?: string;
        };
        Update: {
          task_id?: string | null;
          duration_minutes?: number;
          break_minutes?: number;
          completed?: boolean;
          session_date?: string;
        };
      };
    };
  };
}

