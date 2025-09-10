// WeekView.tsx
import React from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { getDayName, formatDate, formatTime } from './dateUtils';
import type { Slot, WeekData } from './types';

interface Props {
  week: WeekData;
  onAdd: (dayIndex: number) => void;
  onEdit: (slot: Slot, date: string) => void;
  onDelete: (slot: Slot, date: string) => void;
}

const WeekView: React.FC<Props> = ({ week, onAdd, onEdit, onDelete }) => {
  const weekStart = new Date(week.weekStart);
  const today = new Date();
  const todayISO = formatDate(today);

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-8 h-8 flex flex-col items-center justify-center gap-1">
            <div className="w-5 h-0.5 bg-gray-400 rounded-full"></div>
            <div className="w-5 h-0.5 bg-gray-400 rounded-full"></div>
            <div className="w-5 h-0.5 bg-gray-400 rounded-full"></div>
          </div>
        </div>
        <h1 className="text-lg font-semibold text-gray-900">Your Schedule</h1>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
          Save
        </button>
      </div>

      {/* Mini Calendar Strip */}
      <div className="px-6 py-4 bg-gray-50/50">
        <div className="flex items-center justify-center gap-4 mb-3">
          {['S','M','T','W','T','F','S'].map((dayLetter, i) => {
            const currentDate = new Date(weekStart);
            currentDate.setDate(weekStart.getDate() + i);
            const dateStr = formatDate(currentDate);
            const isToday = dateStr === todayISO;
            const dayNum = currentDate.getDate();

            return (
              <div key={i} className="flex flex-col items-center">
                <div className="text-xs font-medium text-gray-500 mb-1">{dayLetter}</div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                  isToday 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600'
                }`}>
                  {dayNum}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-sm font-medium text-gray-700">
          {weekStart.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
          <span className="ml-1 text-xs">▼</span>
        </div>
      </div>

      {/* Schedule List */}
      <div className="px-6 py-4 max-h-96 overflow-y-auto">
        {Array.from({ length: 7 }, (_, dayIndex) => {
          const currentDate = new Date(weekStart);
          currentDate.setDate(weekStart.getDate() + dayIndex);
          const dateStr = formatDate(currentDate);
          const daySlots = week.slotsPerDay[dateStr] || [];
          const isToday = dateStr === todayISO;

          return (
            <div key={dayIndex} className="mb-6 last:mb-4">
              <div className="mb-3">
                <span className="text-blue-600 font-medium text-sm">
                  {getDayName(dayIndex).substring(0, 3)}, {currentDate.getDate().toString().padStart(2, '0')} {currentDate.toLocaleString(undefined, { month: 'long' })}
                </span>
                {isToday && <span className="ml-2 text-xs text-blue-600">(Today)</span>}
              </div>

              {/* Empty state */}
              {daySlots.length === 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-50 rounded-xl border px-4 py-3 text-sm text-gray-500">
                    00:00 - 00:00
                  </div>
                  <button
                    onClick={() => onAdd(dayIndex)}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    title="Add slot"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400"
                    title="Delete slot"
                    disabled
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              {/* Existing slots */}
              {daySlots.map((slot, i) => (
                <div key={`${slot.id}-${i}`} className="flex items-center gap-3 mb-2">
                  <button
                    className="flex-1 bg-white rounded-xl border border-blue-200 px-4 py-3 text-left text-sm hover:border-blue-400 transition-colors"
                    onClick={() => onEdit(slot, dateStr)}
                    title="Edit slot"
                  >
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </button>
                  {daySlots.length < 2 && (
                    <button
                      onClick={() => onAdd(dayIndex)}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      title="Add slot"
                    >
                      <Plus size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(slot, dateStr)}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    title="Edit slot"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(slot, dateStr)}
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    title="Delete slot"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-center border-t border-gray-100 bg-white">
        <div className="flex">
          <button className="flex flex-col items-center px-8 py-4 text-gray-400 hover:text-gray-600 transition-colors">
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-current rounded"></div>
            </div>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center px-8 py-4 text-blue-600">
            <Calendar size={20} className="mb-1" />
            <span className="text-xs font-medium">Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeekView;