export type User = {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
};

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  color: string;
  icon: string;
  frequency: string;
  target_days: number;
  created_at: string;
  is_archived: boolean;
};

export type HabitCompletion = {
  id: string;
  habit_id: string;
  user_id: string;
  completed_date: string;
  created_at?: string;
};

export type JournalEntry = {
  id: string;
  user_id: string;
  title?: string | null;
  content: string;
  mood?: string | null;
  tags: string[] | null;
  image_url?: string | null;
  entry_date: string;
  created_at?: string;
  updated_at?: string;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  quadrant?: "q1" | "q2" | "q3" | "q4" | null;
  due_date?: string | null;
  kanban_order?: number;
  created_at?: string;
  updated_at?: string;
};

export type PomodoroSession = {
  id: string;
  user_id: string;
  task_id?: string | null;
  duration_minutes: number;
  break_minutes?: number;
  completed: boolean;
  session_date: string;
  created_at?: string;
};

export type ProductivityScore = {
  score: number;
  habits: number;
  pomodoros: number;
  journal: number;
  tasks: number;
};

export type Profile = {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: 'main' | 'monthly' | 'weekly';
  status: 'active' | 'completed' | 'abandoned';
  progress: number; // 0-100
  target_date?: string;
  created_at: string;
  updated_at: string;
};
