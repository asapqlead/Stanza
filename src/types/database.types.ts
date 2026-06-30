export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Blocked';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  urgency: UrgencyLevel;
  due_date: string; // YYYY-MM-DD
  due_time: string | null; // HH:MM:SS
  completed: boolean;
  completed_at: string | null;
  sort_order: number;
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  updated_at: string;
}

export interface TaskAssignee {
  task_id: string;
  user_id: string;
}

export interface Attachment {
  id: string;
  task_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

export type NavTab = 'home' | 'calendar' | 'settings';
