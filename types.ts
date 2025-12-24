export interface DailyLog {
  id: string;
  date: string;
  mood: number; // 1-10
  energy: number; // 1-10
  sleepHours: number;
  symptoms: string[];
  notes: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type ViewState = 'dashboard' | 'log' | 'report' | 'chat';

export interface SimplifiedReport {
  summary: string;
  keyTerms: { term: string; definition: string }[];
  actionItems: string[];
}
