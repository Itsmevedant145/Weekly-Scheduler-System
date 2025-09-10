"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const slotsController_1 = require("../controllers/slotsController");
const router = (0, express_1.Router)();
router.post('/', slotsController_1.createSlot); // Create recurring slot
router.get('/', slotsController_1.getSlotsByWeek); // Get slots for week, pass ?start=YYYY-MM-DD
router.put('/:id/exception', slotsController_1.updateSlotException); // Update slot exception
router.delete('/:id/exception', slotsController_1.deleteSlotException); // Delete slot exception
exports.default = router;
