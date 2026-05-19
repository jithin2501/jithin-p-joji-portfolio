from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.core.config import settings
from app.core.auth import create_access_token

router = APIRouter()

class LoginRequest(BaseModel):
    pincode: str

@router.post("/login")
async def login_admin(req: LoginRequest):
    # Retrieve the admin code from settings (.env)
    correct_pincode = settings.ADMIN_PINCODE
    
    if req.pincode != correct_pincode:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect super admin passcode"
        )
        
    # Generate secure JWT access token
    access_token = create_access_token({"role": "super_admin"})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
