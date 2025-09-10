// SlotModal.tsx
import React, { useEffect, useState } from 'react';
import type { Slot } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  slot?: Slot;
  date?: string;
  dayOfWeek?: number;
}

const SlotModal: React.FC<Props> = ({ isOpen, onClose, onSave, slot, date, dayOfWeek }) => {
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');

  useEffect(() => {
    if (slot) {
      setStartTime(slot.start_time.substring(0, 5));
      setEndTime(slot.end_time.substring(0, 5));
    } else {
      setStartTime('00:00');
      setEndTime('00:00');
    }
  }, [slot, isOpen]);

  const handleSave = () => {
    if (!startTime || !endTime) return;

    if (slot && date) {
      onSave({
        type: 'update',
        id: slot.id,
        exception_date: date,
        start_time: startTime,
        end_time: endTime
      });
    } else {
      onSave({
        type: 'create',
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime
      });
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">
          {slot ? 'Edit Slot' : 'Create Slot'}
        </h2>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            {slot ? 'Update' : 'Create'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300/50 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotModal;