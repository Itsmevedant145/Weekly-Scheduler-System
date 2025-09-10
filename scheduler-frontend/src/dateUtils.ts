// src/dateUtils.ts

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (time: string): string => {
  return time.substring(0, 5);
};

export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

export const addWeeks = (date: Date, weeks: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + (weeks * 7));
  return result;
};

export const getDayName = (dayIndex: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
};
