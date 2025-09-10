import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // ✅ import cors
import slotsRouter from './routes/slotRoutes';

dotenv.config();

const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // ✅ allow requests from your frontend
  credentials: true, // Optional: if you’re using cookies/auth headers
}));

app.use(express.json());

// Versioned API route prefix
app.use('/api/v1/slots', slotsRouter);

// Root health check route (optional)
app.get('/', (_req, res) => {
  res.send('Scheduler API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
