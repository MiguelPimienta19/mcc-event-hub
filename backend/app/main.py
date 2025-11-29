from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.db import engine, Base
from .routers import events, agenda, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    # runs once on startup
    Base.metadata.create_all(bind=engine)
    yield
    # place any shutdown cleanup after yield

app = FastAPI(
    title="MCC Event Hub API",
    description="Backend API for the University of Oregon Multicultural Center Event Management System",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
# This allows your Next.js frontend to communicate with this backend
origins = [
    "http://localhost:3000",  # Local development
    "https://mcc-event-hub.vercel.app",  # Production frontend
    "https://*.vercel.app",  # All Vercel preview deployments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(events.router)  # Event CRUD endpoints
app.include_router(agenda.router)  # AI Agenda Optimizer
app.include_router(auth.router)  # Admin Authentication


# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Welcome to the MCC Event Hub API!",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }


# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}