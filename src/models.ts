export type Task = {
  id: string;
  name: string;
  start: string;
  end?: string;
  checked?: boolean;
  contributesToDay?: boolean;
  category?: 'morning' | 'breakfast' | 'work' | 'lunch' | 'class' | 'exercise' | 'dinner' | 'evening' | 'other';
};

export type DaySchedule = {
  dateISO: string;
  tasks: Task[];
  notes?: string;
  expenses?: { id: string; amount: number; reason: 'food'|'travel'|'entertainment'|'other'; note?: string }[];
  alarms?: { sixAM: boolean; tenPM: boolean };
};

export type ReportScope = 'daily' | 'weekly' | 'monthly';
