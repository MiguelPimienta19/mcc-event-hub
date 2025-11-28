"""
CRUD (Create, Read, Update, Delete) utility functions.

This module contains reusable database query functions to avoid duplication
across router endpoints.
"""

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from typing import Optional

from .database.models import Event, Profile


# ============================================
# Event CRUD Functions
# ============================================

def get_event_or_404(db: Session, event_id: UUID) -> Event:
    """
    Fetch event by ID or raise 404 HTTPException.

    This consolidates the repeated pattern of:
    - Querying for an event by ID
    - Checking if it exists
    - Raising 404 if not found

    Used in: get_event, update_event, delete_event endpoints
    """
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with id {event_id} not found"
        )

    return event


# ============================================
# Profile CRUD Functions
# ============================================

def get_profile_by_email(db: Session, email: str) -> Optional[Profile]:
    """
    Fetch profile by email, returns None if not found.

    Simple query without error handling - lets the caller decide
    what to do if the profile doesn't exist.
    """
    return db.query(Profile).filter(Profile.email == email).first()


def get_profile_by_email_or_404(db: Session, email: str) -> Profile:
    """
    Fetch profile by email or raise 404 HTTPException.

    Similar to get_event_or_404 but for profiles.
    """
    profile = get_profile_by_email(db, email)

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Profile with email {email} not found"
        )

    return profile
