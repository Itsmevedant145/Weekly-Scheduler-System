import { Router } from 'express';
import {
  createSlot,
  getSlotsByWeek,
  updateSlotException,
  deleteSlotException,
} from '../controllers/slotsController';

const router = Router();

// Base path: /api/v1/slots
router.post('/', createSlot); // POST /api/v1/slots
router.get('/', getSlotsByWeek); // GET /api/v1/slots?start=YYYY-MM-DD
router.put('/:id/exception', updateSlotException); // PUT /api/v1/slots/:id/exception
router.delete('/:id/exception', deleteSlotException); // DELETE /api/v1/slots/:id/exception

export default router;
