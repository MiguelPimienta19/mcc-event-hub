"""
Authentication Router

This handles admin login and session management.

Key Concepts:
- Session Token: A random string that proves "you're logged in"
- We check if the email exists in the Profile table (admin allowlist)
- If yes, we generate a token and return it
- Frontend stores this token and sends it with future requests
"""

from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, List
import secrets

from ..database.db import get_db
from ..database.models import Profile
from ..models.schemas import AdminLoginRequest, AdminLoginResponse, AdminProfileResponse, AddAdminRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory session storage (simple approach for learning)
# In production, you'd use Redis or a database table
# Format: {token: {"email": "user@example.com", "expires": datetime}}
active_sessions = {}


def generate_session_token() -> str:
    """
    Generate a secure random token for the session.

    secrets.token_urlsafe() creates a cryptographically secure random string.
    This is what makes each session unique and hard to guess.
    """
    return secrets.token_urlsafe(32)


@router.post("/login", response_model=AdminLoginResponse)
def login(
    request: AdminLoginRequest,
    db: Session = Depends(get_db)
):
    """
    Admin Login Endpoint

    Flow:
    1. Check if email exists in Profile table
    2. If yes, generate session token
    3. Store session with expiration time
    4. Return token to frontend

    The frontend will store this token and send it with future requests.
    """

    # Step 1: Query the database for this email
    profile = db.query(Profile).filter(Profile.email == request.email).first()

    # Step 2: If email not found, return error
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not authorized. Contact an administrator."
        )

    # Step 3: Generate a session token
    token = generate_session_token()

    # Step 4: Store session (expires in 24 hours)
    expiration = datetime.utcnow() + timedelta(hours=24)
    active_sessions[token] = {
        "email": request.email,
        "expires": expiration
    }

    # Step 5: Return token to frontend
    return AdminLoginResponse(
        token=token,
        email=request.email,
        message="Login successful"
    )


@router.post("/logout")
def logout(authorization: Optional[str] = Header(None)):
    """
    Logout Endpoint

    Removes the session token from active sessions.
    After this, the token can't be used anymore.

    The token comes from the Authorization header: "Bearer <token>"
    """
    if not authorization:
        return {"message": "No session to logout"}

    # Extract token from "Bearer <token>" format
    token = authorization.replace("Bearer ", "")

    if token in active_sessions:
        del active_sessions[token]
        return {"message": "Logged out successfully"}

    return {"message": "Already logged out"}


@router.get("/verify")
def verify_session(authorization: Optional[str] = Header(None)):
    """
    Verify Session Endpoint

    Frontend can call this to check if their token is still valid.
    Useful for checking auth status when loading the admin dashboard.

    The token comes from the Authorization header: "Bearer <token>"
    """

    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No authorization token provided"
        )

    # Extract token from "Bearer <token>" format
    token = authorization.replace("Bearer ", "")

    # Check if token exists
    if token not in active_sessions:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session"
        )

    session = active_sessions[token]

    # Check if token expired
    if datetime.utcnow() > session["expires"]:
        del active_sessions[token]
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please login again."
        )

    # Token is valid!
    return {
        "valid": True,
        "email": session["email"]
    }


def get_current_admin(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Profile:
    """
    Dependency function to get the current authenticated admin.

    This is called by protected routes to verify the user is logged in.

    Usage in other routes:
        @router.delete("/events/{id}")
        def delete_event(
            id: str,
            admin: Profile = Depends(get_current_admin)
        ):
            # admin is guaranteed to be a valid Profile object
            # Only runs if token is valid

    This is called a "dependency" in FastAPI - it runs before your endpoint.
    The token comes from the Authorization header: "Bearer <token>"
    """

    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please login.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Extract token from "Bearer <token>" format
    token = authorization.replace("Bearer ", "")

    # Check if token exists
    if token not in active_sessions:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
            headers={"WWW-Authenticate": "Bearer"}
        )

    session = active_sessions[token]

    # Check if expired
    if datetime.utcnow() > session["expires"]:
        del active_sessions[token]
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please login again.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Get the profile from database
    profile = db.query(Profile).filter(Profile.email == session["email"]).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return profile


# ============================================
# Admin Management Endpoints
# ============================================

@router.get("/admins", response_model=List[AdminProfileResponse])
def list_admins(
    admin: Profile = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    List all admin profiles.

    **Requires admin authentication.**
    """
    admins = db.query(Profile).order_by(Profile.created_at.desc()).all()
    return admins


@router.post("/admins", response_model=AdminProfileResponse, status_code=status.HTTP_201_CREATED)
def add_admin(
    request: AddAdminRequest,
    admin: Profile = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Add a new admin by email.

    **Requires admin authentication.**
    """
    # Check if admin already exists
    existing = db.query(Profile).filter(Profile.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Admin with email {request.email} already exists"
        )

    # Create new admin profile
    new_admin = Profile(email=request.email, role="admin")
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return new_admin


@router.delete("/admins/{email}", status_code=status.HTTP_204_NO_CONTENT)
def remove_admin(
    email: str,
    admin: Profile = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Remove an admin by email.

    **Requires admin authentication.**

    Note: You cannot remove yourself!
    """
    # Prevent self-deletion
    if admin.email == email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot remove yourself as an admin"
        )

    # Find the admin
    admin_to_remove = db.query(Profile).filter(Profile.email == email).first()

    if not admin_to_remove:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Admin with email {email} not found"
        )

    db.delete(admin_to_remove)
    db.commit()

    return None
