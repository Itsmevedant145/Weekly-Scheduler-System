// src/types.ts

export interface Slot {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_at: string;
  exceptions?: Exception[];
  isException?: boolean;
}

export interface Exception {
  id: number;
  slot_id: number;
  exception_date: string;
  start_time?: string;
  end_time?: string;
  is_deleted: boolean;
}

export interface WeekData {
  weekStart: string;
  slotsPerDay: Record<string, Slot[]>;
}
