import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import get_database

router = APIRouter()

# Pydantic Schemas
class ResumeCreateSchema(BaseModel):
    name: str
    base64_data: str  # Base64 string of the uploaded PDF

class ResumeMetaSchema(BaseModel):
    id: str
    name: str
    is_active: bool
    created_at: str

class ResumeFullSchema(BaseModel):
    id: str
    name: str
    base64_data: str
    is_active: bool
    created_at: str

@router.get("/", response_model=List[ResumeMetaSchema])
async def list_resumes(db = Depends(get_database)):
    """List all resumes (metadata only, excluding massive file content for speed)"""
    cursor = db["resumes"].find({}, {"base64_data": 0})
    resumes = []
    async for doc in cursor:
        resumes.append(ResumeMetaSchema(
            id=str(doc.get("_id")),
            name=doc.get("name", "Untitled Resume"),
            is_active=doc.get("is_active", False),
            created_at=doc.get("created_at", datetime.utcnow().isoformat())
        ))
    # Sort: active first, then newest
    resumes.sort(key=lambda r: (not r.is_active, r.created_at), reverse=True)
    return resumes

@router.get("/active", response_model=ResumeFullSchema)
async def get_active_resume(db = Depends(get_database)):
    """Retrieve the currently active resume with base64 file data for download"""
    doc = await db["resumes"].find_one({"is_active": True})
    if not doc:
        # Fallback to the latest uploaded resume if none is marked active
        doc = await db["resumes"].find_one(sort=[("created_at", -1)])
        
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resumes available. Please upload one in the Admin Panel."
        )
        
    return ResumeFullSchema(
        id=str(doc.get("_id")),
        name=doc.get("name"),
        base64_data=doc.get("base64_data"),
        is_active=doc.get("is_active", True),
        created_at=doc.get("created_at")
    )

@router.get("/{resume_id}", response_model=ResumeFullSchema)
async def get_resume(resume_id: str, db = Depends(get_database)):
    """Retrieve a single resume with full base64 file data for preview"""
    doc = await db["resumes"].find_one({"_id": resume_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    return ResumeFullSchema(
        id=str(doc.get("_id")),
        name=doc.get("name"),
        base64_data=doc.get("base64_data"),
        is_active=doc.get("is_active", False),
        created_at=doc.get("created_at")
    )

@router.post("/", response_model=ResumeMetaSchema, status_code=status.HTTP_201_CREATED)
async def upload_resume(resume_in: ResumeCreateSchema, db = Depends(get_database)):
    """Upload a new PDF resume"""
    resume_id = uuid.uuid4().hex
    
    # If this is the first resume, make it active automatically
    count = await db["resumes"].count_documents({})
    is_active = True if count == 0 else False
    
    doc = {
        "_id": resume_id,
        "name": resume_in.name,
        "base64_data": resume_in.base64_data,
        "is_active": is_active,
        "created_at": datetime.utcnow().isoformat()
    }
    
    await db["resumes"].insert_one(doc)
    
    return ResumeMetaSchema(
        id=resume_id,
        name=doc["name"],
        is_active=doc["is_active"],
        created_at=doc["created_at"]
    )

@router.post("/{resume_id}/activate", response_model=ResumeMetaSchema)
async def activate_resume(resume_id: str, db = Depends(get_database)):
    """Set a specific resume as active and deactivate all others"""
    # 1. Verify existence
    doc = await db["resumes"].find_one({"_id": resume_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
        
    # 2. Deactivate all others
    await db["resumes"].update_many({"_id": {"$ne": resume_id}}, {"$set": {"is_active": False}})
    
    # 3. Activate this one
    await db["resumes"].update_one({"_id": resume_id}, {"$set": {"is_active": True}})
    
    return ResumeMetaSchema(
        id=resume_id,
        name=doc["name"],
        is_active=True,
        created_at=doc["created_at"]
    )

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(resume_id: str, db = Depends(get_database)):
    """Delete a resume"""
    doc = await db["resumes"].find_one({"_id": resume_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
        
    was_active = doc.get("is_active", False)
    await db["resumes"].delete_one({"_id": resume_id})
    
    # If the deleted resume was active, automatically activate the latest remaining resume
    if was_active:
        latest = await db["resumes"].find_one(sort=[("created_at", -1)])
        if latest:
            await db["resumes"].update_one({"_id": latest["_id"]}, {"$set": {"is_active": True}})
            
    return None
