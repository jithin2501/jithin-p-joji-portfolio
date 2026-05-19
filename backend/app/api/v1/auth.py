from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.core.config import settings
from app.core.auth import create_access_token
from app.core.database import get_database
from app.models.admin_user import AdminUser, DEFAULT_PAGE_ACCESS
from app.repositories.admin_user_repository import AdminUserRepository

router = APIRouter()

class LoginRequest(BaseModel):
    pincode: str

class CreateUserRequest(BaseModel):
    username: str
    pincode: str

class UpdateAccessRequest(BaseModel):
    page_access: str

class UserResponse(BaseModel):
    id: Optional[str] = None
    username: str
    role: str
    status: str
    last_login: str
    page_access: str

def get_admin_repository(db = Depends(get_database)) -> AdminUserRepository:
    return AdminUserRepository(db)

@router.post("/login")
async def login_admin(req: LoginRequest, repo: AdminUserRepository = Depends(get_admin_repository)):
    # 1. First, check if matches the Superadmin pincode in .env
    correct_pincode = settings.ADMIN_PINCODE
    
    if req.pincode == correct_pincode:
        access_token = create_access_token({"role": "super_admin", "username": "admin"})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": "Superadmin",
            "username": "admin",
            "page_access": DEFAULT_PAGE_ACCESS + ",users"
        }
        
    # 2. Otherwise, check MongoDB for custom Admin users
    admin_user = await repo.find_by_pincode(req.pincode)
    if not admin_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect passcode"
        )
        
    # Check if account is active
    if admin_user.status == "Inactive":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive. Please contact the Superadmin."
        )
        
    # Update last login time
    now = datetime.utcnow()
    await repo.update_last_login(admin_user.id, now)
    
    access_token = create_access_token({"role": "admin", "username": admin_user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": admin_user.role,
        "username": admin_user.username,
        "page_access": admin_user.page_access
    }

@router.get("/users", response_model=List[UserResponse])
async def get_users(repo: AdminUserRepository = Depends(get_admin_repository)):
    admins = await repo.get_all_admins()
    users_list = []
    
    # Virtual Superadmin row at the top
    now_str = datetime.utcnow().strftime("%d/%m/%Y, %H:%M:%S")
    users_list.append(
        UserResponse(
            id="superadmin-id",
            username="admin",
            role="Superadmin",
            status="Active",
            last_login=now_str,
            page_access="FULL ACCESS"
        )
    )
    
    for admin in admins:
        users_list.append(
            UserResponse(
                id=admin.id,
                username=admin.username,
                role=admin.role,
                status=admin.status,
                last_login=admin.last_login.strftime("%d/%m/%Y, %H:%M:%S"),
                page_access=admin.page_access
            )
        )
        
    return users_list

@router.post("/users", response_model=UserResponse)
async def create_user(req: CreateUserRequest, repo: AdminUserRepository = Depends(get_admin_repository)):
    # Check if username already exists
    existing = await repo.find_by_username(req.username)
    if existing or req.username.lower() == "admin":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
        
    # Enforce exactly 6 numeric digits
    if len(req.pincode) != 6 or not req.pincode.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passcode must be exactly 6 numeric digits"
        )

    # Check if pincode already exists
    existing_pin = await repo.find_by_pincode(req.pincode)
    if existing_pin or req.pincode == settings.ADMIN_PINCODE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passcode must be unique"
        )
        
    # Create custom admin with hardcoded role, active status and default accesses
    new_admin = AdminUser(
        username=req.username,
        pincode=req.pincode,
        role="Admin",
        status="Active",
        last_login=datetime.utcnow(),
        page_access=DEFAULT_PAGE_ACCESS
    )
    
    saved = await repo.create_admin(new_admin)
    return UserResponse(
        id=saved.id,
        username=saved.username,
        role=saved.role,
        status=saved.status,
        last_login=saved.last_login.strftime("%d/%m/%Y, %H:%M:%S"),
        page_access=saved.page_access
    )

@router.put("/users/{user_id}/status", response_model=UserResponse)
async def toggle_user_status(user_id: str, repo: AdminUserRepository = Depends(get_admin_repository)):
    if user_id == "superadmin-id":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify Superadmin status"
        )
        
    admins = await repo.get_all_admins()
    target = None
    for admin in admins:
        if admin.id == user_id:
            target = admin
            break
            
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin user not found"
        )
        
    new_status = "Inactive" if target.status == "Active" else "Active"
    
    await repo.collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"status": new_status}}
    )
    
    target.status = new_status
    return UserResponse(
        id=target.id,
        username=target.username,
        role=target.role,
        status=target.status,
        last_login=target.last_login.strftime("%d/%m/%Y, %H:%M:%S"),
        page_access=target.page_access
    )

@router.put("/users/{user_id}/access", response_model=UserResponse)
async def update_user_access(user_id: str, req: UpdateAccessRequest, repo: AdminUserRepository = Depends(get_admin_repository)):
    if user_id == "superadmin-id":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot customize Superadmin access"
        )
        
    admins = await repo.get_all_admins()
    target = None
    for admin in admins:
        if admin.id == user_id:
            target = admin
            break
            
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin user not found"
        )
        
    await repo.collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"pageAccess": req.page_access}}
    )
    
    target.page_access = req.page_access
    return UserResponse(
        id=target.id,
        username=target.username,
        role=target.role,
        status=target.status,
        last_login=target.last_login.strftime("%d/%m/%Y, %H:%M:%S"),
        page_access=target.page_access
    )

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str, repo: AdminUserRepository = Depends(get_admin_repository)):
    if user_id == "superadmin-id":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete Superadmin"
        )
        
    success = await repo.delete_admin(user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin user not found"
        )
