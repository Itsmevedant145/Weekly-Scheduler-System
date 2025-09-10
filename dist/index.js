"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const slotRoutes_1 = __importDefault(require("./routes/slotRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Routes
app.use('/api/slots', slotRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
