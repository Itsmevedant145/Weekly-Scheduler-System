// src/api.ts

import type { Slot } from './types'; // or '../types' based on your folder


const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = {
  getSlotsByWeek: async (weekStart: string): Promise<Record<string, Slot[]>> => {
    const response = await fetch(`${API_BASE_URL}/slots?start=${weekStart}`);
    if (!response.ok) throw new Error('Failed to fetch slots');
    return response.json();
  },

  createSlot: async (slot: { day_of_week: number; start_time: string; end_time: string }): Promise<Slot> => {
    const response = await fetch(`${API_BASE_URL}/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slot),
    });
    if (!response.ok) throw new Error('Failed to create slot');
    return response.json();
  },

  updateSlotException: async (
    id: number,
    exception: { exception_date: string; start_time: string; end_time: string }
  ): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/slots/${id}/exception`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exception),
    });
    if (!response.ok) throw new Error('Failed to update slot');
  },

  deleteSlotException: async (id: number, exceptionDate: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/slots/${id}/exception?date=${exceptionDate}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete slot');
  },
};

export default api;
