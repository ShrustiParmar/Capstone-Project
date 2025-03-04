
export interface Reminder {
  id: string;
  title: string;
  time: string;
  days: string[];
  user_id: string;
  created_at?: string;
  priority?: ReminderPriority;
  category?: string;
  recurrence?: RecurrencePattern;
  location?: string;
  quietHours?: {
    start: string;
    end: string;
    enabled: boolean;
  };
  lastSuggested?: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  digestMode: 'immediate' | 'daily' | 'weekly';
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ReminderPriority = 'low' | 'medium' | 'high';
