Weekly Scheduler System
A full-stack weekly scheduler application with recurring slots and exception handling.
🚀 Live Demo

Frontend: [Your Vercel Link]
Backend API: [Your Render Link]

🏗️ Architecture
Frontend (React + TypeScript + Tailwind)

Framework: React 18 with TypeScript
Styling: Tailwind CSS
Key Features:

Weekly calendar view
Infinite scroll for future weeks
Create/Edit/Delete slots with modal
Real-time slot management
Responsive mobile-first design



Backend (Node.js + TypeScript + PostgreSQL)

Framework: Express.js with TypeScript
Database: PostgreSQL with Knex.js ORM
Key Features:

Recurring weekly slots
Exception handling for modifications
RESTful API design
Database migrations



📊 Database Schema
sql-- Recurring slots table
CREATE TABLE recurring_slots (
  id SERIAL PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Exception handling table
CREATE TABLE slot_exceptions (
  id SERIAL PRIMARY KEY,
  recurring_slot_id INTEGER REFERENCES recurring_slots(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(recurring_slot_id, date)
);
🛠️ Local Development Setup
Prerequisites

Node.js 18+
PostgreSQL 12+
Git

Backend Setup
bash# Clone repository
git clone <your-repo-url>
cd scheduler-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
createdb scheduler_dev
npm run migrate

# Start development server
npm run dev
Frontend Setup
bashcd scheduler-frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your backend URL

# Start development server
npm run dev
🚢 Deployment Guide
Backend Deployment (Render)

Create PostgreSQL Database:

Go to Render Dashboard
Create new PostgreSQL database
Note the connection details


Deploy Backend Service:

Create new Web Service from Git repository
Set build command: npm install && npm run build && npm run migrate
Set start command: npm start
Add environment variables:
NODE_ENV=production
DATABASE_URL=<your-postgres-connection-string>
FRONTEND_URL=https://your-frontend-domain.vercel.app



Get Backend URL: Note your service URL (e.g., https://your-service.onrender.com)

Frontend Deployment (Vercel)

Deploy to Vercel:
bash# Install Vercel CLI
npm i -g vercel

# Deploy from project root
cd scheduler-frontend
vercel --prod

Set Environment Variables:

In Vercel dashboard, go to Project Settings
Add environment variable:
REACT_APP_API_URL=https://your-backend.onrender.com/api



Redeploy: Trigger a new deployment to apply environment variables

📡 API Endpoints
GET /api/slots?start=YYYY-MM-DD
Get all slots for a specific week
json{
  "2024-01-01": [
    {
      "id": 1,
      "day_of_week": 1,
      "start_time": "09:00",
      "end_time": "11:00",
      "date": "2024-01-01"
    }
  ]
}
POST /api/slots
Create a new recurring slot
json{
  "day_of_week": 1,
  "start_time": "09:00",
  "end_time": "11:00"
}
PUT /api/slots/:id/exception
Update a slot for specific date (creates exception)
json{
  "date": "2024-01-01",
  "start_time": "10:00",
  "end_time": "12:00"
}
DELETE /api/slots/:id/exception?date=YYYY-MM-DD
Delete a slot for specific date (creates deletion exception)
✨ Key Features
🔄 Recurring Logic

Create a slot for any day of the week
Automatically appears on all future occurrences of that day
Maximum 2 slots per day

🎯 Exception Handling

Edit a specific occurrence without affecting other weeks
Delete a specific occurrence while keeping the recurring pattern
Exceptions are stored separately and merged during display

📱 User Experience

Clean, mobile-first design
Infinite scroll for future weeks
Modal-based slot editing
Real-time updates
Optimistic UI updates

🏗️ Technical Highlights

TypeScript for type safety
RESTful API design
Database migrations with Knex.js
Responsive Tailwind CSS design
Error handling and validation
Production-ready deployment configuration

🐛 Troubleshooting
Common Issues

Database Connection Error: Verify DATABASE_URL environment variable
CORS Issues: Ensure FRONTEND_URL is correctly set in backend
Build Failures: Check Node.js version compatibility
Migration Issues: Ensure database exists and credentials are correct

Debug Commands
bash# Backend logs
npm run dev

# Database connection test
npm run migrate:status

# Frontend build
npm run build
🔧 Development Commands
Backend

npm run dev - Start development server
npm run build - Build for production
npm run migrate - Run database migrations
npm run migrate:rollback - Rollback last migration

Frontend

npm run dev - Start development server
npm run build - Build for production
npm run preview - Preview production build

📈 Future Enhancements

 User authentication
 Multiple timezone support
 Email notifications
 Bulk operations
 Export/Import functionality
 Mobile app
 Calendar integrations
