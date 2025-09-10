"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlot = createSlot;
exports.getSlotsByWeek = getSlotsByWeek;
exports.updateSlotException = updateSlotException;
exports.deleteSlotException = deleteSlotException;
const knex_1 = __importDefault(require("../db/knex"));
// Utility to parse date strings, etc.
const date_fns_1 = require("date-fns");
async function createSlot(req, res) {
    try {
        const { day_of_week, start_time, end_time } = req.body;
        if (day_of_week < 0 || day_of_week > 6) {
            return res.status(400).json({ error: 'Invalid day_of_week' });
        }
        // Check max 2 slots per day_of_week
        const count = await (0, knex_1.default)('recurring_slots').where({ day_of_week }).count('id as cnt').first();
        if (count && Number(count.cnt) >= 2) {
            return res.status(400).json({ error: 'Maximum 2 slots allowed per day' });
        }
        const [id] = await (0, knex_1.default)('recurring_slots').insert({ day_of_week, start_time, end_time }).returning('id');
        res.status(201).json({ id, day_of_week, start_time, end_time });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create slot' });
    }
}
// Get slots for week (starting from ?start=YYYY-MM-DD)
async function getSlotsByWeek(req, res) {
    try {
        const { start } = req.query;
        if (!start || typeof start !== 'string') {
            return res.status(400).json({ error: 'start query param required as YYYY-MM-DD' });
        }
        const startDate = new Date(start);
        if (isNaN(startDate.getTime())) {
            return res.status(400).json({ error: 'Invalid start date' });
        }
        // Build an array of dates for the week
        // Assuming week starts on Sunday (day 0)
        // Or adjust if you want Monday start with startOfWeek(date, { weekStartsOn: 1 })
        const weekStart = (0, date_fns_1.startOfWeek)(startDate, { weekStartsOn: 0 });
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = (0, date_fns_1.addDays)(weekStart, i);
            dates.push(date);
        }
        // Fetch all recurring slots
        const recurringSlots = await (0, knex_1.default)('recurring_slots').select('*');
        // Fetch all exceptions for this week
        const exceptions = await (0, knex_1.default)('slot_exceptions')
            .whereIn('date', dates.map(d => (0, date_fns_1.formatISO)(d, { representation: 'date' })))
            .select('*');
        // Build slots per day applying exceptions
        const slotsPerDay = {};
        for (const date of dates) {
            const dayOfWeek = date.getDay(); // 0-6
            const dateString = (0, date_fns_1.formatISO)(date, { representation: 'date' });
            // Get base recurring slots for this day
            const baseSlots = recurringSlots.filter(slot => slot.day_of_week === dayOfWeek);
            // Get exceptions for this date
            const exForDate = exceptions.filter(e => e.date === dateString);
            // Apply exceptions: if is_deleted true, skip; if override times, replace
            const finalSlots = baseSlots.map(slot => {
                const exception = exForDate.find(e => e.recurring_slot_id === slot.id);
                if (exception) {
                    if (exception.is_deleted)
                        return null;
                    return {
                        id: slot.id,
                        day_of_week: dayOfWeek,
                        start_time: exception.start_time || slot.start_time,
                        end_time: exception.end_time || slot.end_time,
                        exception_id: exception.id,
                        date: dateString,
                    };
                }
                return {
                    id: slot.id,
                    day_of_week: dayOfWeek,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    date: dateString,
                };
            });
            // Filter out nulls (deleted)
            slotsPerDay[dateString] = finalSlots.filter(s => s !== null);
        }
        res.json(slotsPerDay);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch slots' });
    }
}
// Update exception on specific date for a slot (PUT /api/slots/:id/exception)
async function updateSlotException(req, res) {
    try {
        const slotId = Number(req.params.id);
        const { date, start_time, end_time } = req.body;
        if (!date)
            return res.status(400).json({ error: 'Date is required' });
        // Check if slot exists
        const slot = await (0, knex_1.default)('recurring_slots').where({ id: slotId }).first();
        if (!slot)
            return res.status(404).json({ error: 'Slot not found' });
        // Upsert exception
        const existing = await (0, knex_1.default)('slot_exceptions')
            .where({ recurring_slot_id: slotId, date })
            .first();
        if (existing) {
            await (0, knex_1.default)('slot_exceptions')
                .where({ id: existing.id })
                .update({ start_time, end_time, is_deleted: false, updated_at: knex_1.default.fn.now() });
            return res.json({ message: 'Exception updated' });
        }
        else {
            await (0, knex_1.default)('slot_exceptions').insert({ recurring_slot_id: slotId, date, start_time, end_time, is_deleted: false });
            return res.status(201).json({ message: 'Exception created' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update exception' });
    }
}
// Delete exception (mark is_deleted true)
async function deleteSlotException(req, res) {
    try {
        const slotId = Number(req.params.id);
        const { date } = req.body;
        if (!date)
            return res.status(400).json({ error: 'Date is required' });
        // Check if slot exists
        const slot = await (0, knex_1.default)('recurring_slots').where({ id: slotId }).first();
        if (!slot)
            return res.status(404).json({ error: 'Slot not found' });
        // Mark exception as deleted or create one if not exist
        const existing = await (0, knex_1.default)('slot_exceptions')
            .where({ recurring_slot_id: slotId, date })
            .first();
        if (existing) {
            await (0, knex_1.default)('slot_exceptions')
                .where({ id: existing.id })
                .update({ is_deleted: true, updated_at: knex_1.default.fn.now() });
            return res.json({ message: 'Exception marked as deleted' });
        }
        else {
            await (0, knex_1.default)('slot_exceptions').insert({ recurring_slot_id: slotId, date, is_deleted: true });
            return res.status(201).json({ message: 'Exception created and marked as deleted' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete exception' });
    }
}
