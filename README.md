# MCC Event Hub

A comprehensive event management system for the University of Oregon Multicultural Center (MCC), built with Next.js and FastAPI.

## Features

### Event Management
- **Interactive Calendar View** - Visual calendar interface with weekly and daily views
- **Event CRUD Operations** - Create, read, update, and delete events (admin-only)
- **Organization Filtering** - Filter events by organization with intelligent name normalization
- **Event Details Modal** - Click on any event to view full details

### AI-Powered Agenda Optimizer
- **Meeting Organization** - Input meeting topics and get AI-generated structured agendas
- **Markdown Support** - AI responses formatted with proper markdown rendering
- **Conversation History** - Multi-turn conversations for iterative agenda refinement

### Admin Dashboard
- **Secure Authentication** - Admin-only access with session-based authentication
- **Event Management** - Full CRUD interface for managing all events
- **Admin Management** - Add or remove admin users
- **Real-time Updates** - Changes reflect immediately across the application

## Tech Stack

### Frontend
- **Next.js 16.0.5** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Big Calendar** - Interactive calendar component
- **react-markdown** - Markdown rendering for AI responses

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Database (hosted on Supabase)
- **OpenAI API** - Powers the AI Agenda Optimizer
- **Uvicorn** - ASGI server

## Project Structure

```
mcc-event-hub/
├── frontend/                  # Next.js frontend application
│   ├── app/
│   │   ├── page.tsx          # Main calendar view
│   │   ├── agenda/           # AI Agenda Optimizer
│   │   ├── admin/            # Admin dashboard
│   │   └── components/       # Reusable React components
│   ├── lib/
│   │   ├── constants.ts      # API URL and shared constants
│   │   └── auth.ts           # Authentication utilities
│   └── public/               # Static assets
│
└── backend/                   # FastAPI backend application
    ├── app/
    │   ├── main.py           # FastAPI app initialization
    │   ├── routers/
    │   │   ├── events.py     # Event CRUD endpoints
    │   │   ├── agenda.py     # AI Agenda endpoints
    │   │   └── auth.py       # Authentication endpoints
    │   ├── database/
    │   │   ├── db.py         # Database connection
    │   │   └── models.py     # SQLAlchemy models
    │   ├── models/
    │   │   └── schemas.py    # Pydantic schemas
    │   ├── services/
    │   │   └── ai.py         # OpenAI integration
    │   └── crud.py           # Database utility functions
    └── requirements.txt       # Python dependencies
```

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL database (or Supabase account)
- OpenAI API key

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the development server:
```bash
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:
```env
DATABASE_URL=postgresql://user:password@host:port/database
OPENAI_API_KEY=your_openai_api_key
```

Run the development server:
```bash
uvicorn app.main:app --reload
```

The backend will be available at [http://localhost:8000](http://localhost:8000)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Import repository to Vercel
3. Set Root Directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com`
5. Deploy

### Backend (Render)
1. Connect your GitHub repository
2. Set Root Directory to `backend`
3. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `OPENAI_API_KEY` - Your OpenAI API key
4. Deploy

### Database (Supabase)
- Use **Transaction mode** pooler connection string for production
- Format: `postgresql://postgres.PROJECT_REF:PASSWORD@aws-REGION.pooler.supabase.com:6543/postgres`

## API Endpoints

### Events
- `GET /events/` - Get all events (with optional organization filter)
- `GET /events/{id}` - Get single event
- `POST /events/` - Create event (admin only)
- `PUT /events/{id}` - Update event (admin only)
- `DELETE /events/{id}` - Delete event (admin only)

### AI Agenda
- `POST /api/agenda` - Generate AI-optimized agenda

### Authentication
- `POST /auth/login` - Admin login
- `POST /auth/logout` - Admin logout
- `GET /auth/me` - Get current admin profile
- `POST /auth/admin` - Add new admin (admin only)
- `DELETE /auth/admin/{email}` - Remove admin (admin only)

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key for agenda optimizer

## Key Features Implementation

### Organization Name Normalization
Events can be filtered by organization with intelligent normalization that:
- Removes all whitespace
- Converts to uppercase
- Ensures "BSU", "B S U", and " BSU " all match correctly

### Calendar Navigation
Full calendar navigation support with:
- Today button
- Next/Previous week navigation
- Day/Week view switching
- Time range: 9 AM - 8 PM

### Admin Authentication
Secure admin access with:
- Session-based authentication
- Protected routes and endpoints
- Admin management capabilities

## License

Built for the University of Oregon Multicultural Center.

## Support

For issues or questions, please contact the development team or open an issue on GitHub.
