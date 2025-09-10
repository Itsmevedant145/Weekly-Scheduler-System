// WeeklyScheduler.tsx
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import SlotModal from './SlotModal';
import WeekView from './WeekView';
import { getWeekStart, formatDate, addWeeks } from './dateUtils';
import api from './api';
import type { Slot, WeekData } from './types';

const WeeklyScheduler = () => {
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number | null>(null);

  useEffect(() => {
    loadWeek(new Date());
  }, []);

  const loadWeek = async (startDate: Date) => {
    setLoading(true);
    setError(null);
    try {
      const weekStart = formatDate(getWeekStart(startDate));
      const slots = await api.getSlotsByWeek(weekStart);

      const newWeek: WeekData = { weekStart, slotsPerDay: slots };

      setWeeks(prev => {
        const exists = prev.some(w => w.weekStart === weekStart);
        if (!exists) {
          return [...prev, newWeek].sort((a, b) =>
            new Date(a.weekStart).getTime() - new Date(b.weekStart).getTime()
          );
        }
        return prev;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading week');
    } finally {
      setLoading(false);
    }
  };

  const loadNextWeek = () => {
    if (weeks.length > 0) {
      const lastWeek = new Date(weeks[weeks.length - 1].weekStart);
      const nextWeek = addWeeks(lastWeek, 1);
      loadWeek(nextWeek);
    }
  };

  const loadPreviousWeek = () => {
    if (weeks.length > 0) {
      const firstWeek = new Date(weeks[0].weekStart);
      const previousWeek = addWeeks(firstWeek, -1);
      loadWeek(previousWeek);
    }
  };

  const handleSlotAction = async (action: any) => {
    try {
      if (action.type === 'create') {
        await api.createSlot(action);
      } else if (action.type === 'update') {
        await api.updateSlotException(action.id, {
          exception_date: action.exception_date,
          start_time: action.start_time,
          end_time: action.end_time
        });
      }

      const actionDate = action.exception_date ? new Date(action.exception_date) : new Date();
      const weekStart = getWeekStart(actionDate);
      await loadWeek(weekStart);
    } catch (err) {
      setError('Failed to save slot');
    }
  };

  const handleDeleteSlot = async (slot: Slot, date: string) => {
    if (!window.confirm('Delete this slot?')) return;

    try {
      await api.deleteSlotException(slot.id, date);
      const weekStart = getWeekStart(new Date(date));
      await loadWeek(weekStart);
    } catch {
      setError('Failed to delete slot');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-md">
        {error && (
          <div className="fixed top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-50 max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Load Previous Week Button */}
        <div className="text-center py-4">
          <button
            onClick={loadPreviousWeek}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-sm"
          >
            {loading ? 'Loading...' : 'Load Previous Week'}
          </button>
        </div>

        {/* Week Views */}
        <div className="space-y-6 pb-6">
          {weeks.map((week) => (
            <WeekView
              key={week.weekStart}
              week={week}
              onAdd={(dayIndex) => {
                setSelectedSlot(null);
                setSelectedDate(null);
                setSelectedDayOfWeek(dayIndex);
                setModalOpen(true);
              }}
              onEdit={(slot, date) => {
                setSelectedSlot(slot);
                setSelectedDate(date);
                setSelectedDayOfWeek(null);
                setModalOpen(true);
              }}
              onDelete={handleDeleteSlot}
            />
          ))}
        </div>

        {/* Load Next Week Button */}
        <div className="text-center pb-6">
          <button
            onClick={loadNextWeek}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-sm"
          >
            {loading ? 'Loading...' : 'Load Next Week'}
          </button>
        </div>

        <SlotModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSlotAction}
          slot={selectedSlot || undefined}
          date={selectedDate || undefined}
          dayOfWeek={selectedDayOfWeek || undefined}
        />
      </div>
    </div>
  );
};

export default WeeklyScheduler;