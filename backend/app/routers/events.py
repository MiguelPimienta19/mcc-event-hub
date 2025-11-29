from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ..database.db import get_db
from ..database.models import Event, Profile
from ..models.schemas import EventCreate, EventUpdate, EventResponse
from .auth import get_current_admin
from ..crud import get_event_or_404


router = APIRouter(
    prefix="/events",
    tags=["events"]
)


@router.get("/", response_model=List[EventResponse])
def get_events(
    skip: int = 0,
    limit: int = 100,
    organization: str = None,
    db: Session = Depends(get_db)
):
    """
    Get all events with optional filtering.

    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return
    - **organization**: Filter by organization name (optional)
    """
    query = db.query(Event)

    # Filter by organization if provided
    if organization:
        query = query.filter(Event.organization == organization)

    # Order by start time (ascending)
    events = query.order_by(Event.start_time.asc()).offset(skip).limit(limit).all()

    return events


@router.get("/{event_id}", response_model=EventResponse)
def get_event(event_id: UUID, db: Session = Depends(get_db)):
    """
    Get a single event by ID.
    """
    event = get_event_or_404(db, event_id)

    return event


@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(event_data: EventCreate, db: Session = Depends(get_db)):
    """
    Create a new event.

    This is called from the EventModal component when users create events.
    """
    # Create new event
    new_event = Event(**event_data.model_dump())

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: UUID,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    admin: Profile = Depends(get_current_admin)
):
    """
    Update an existing event.

    Only provided fields will be updated.
    **Requires admin authentication.**
    """
    event = get_event_or_404(db, event_id)

    # Update only provided fields
    update_data = event_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)

    db.commit()
    db.refresh(event)

    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: UUID,
    db: Session = Depends(get_db),
    admin: Profile = Depends(get_current_admin)
):
    """
    Delete an event.

    This will also delete all associated agenda items (cascade).
    **Requires admin authentication.**
    """
    event = get_event_or_404(db, event_id)

    db.delete(event)
    db.commit()

    return None
