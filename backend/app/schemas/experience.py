from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ExperienceCreate(BaseModel):
    title: str = Field(..., min_length=1, description="Job title")
    company: str = Field(..., min_length=1, description="Company name")
    date_from: str = Field(..., min_length=1, description="Start date (e.g. Mar 2026)")
    date_to: str = Field(..., min_length=1, description="End date (e.g. Present)")
    desc: str = Field(..., min_length=1, description="Description of roles and achievements")
    tags: List[str] = Field(default=[], description="List of skills and tools tags")
    location: str = Field(default="", description="Location details (e.g. Bangalore)")
    dot_color: str = Field(default="#818cf8", description="Timeline dot accent color")

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    desc: Optional[str] = None
    tags: Optional[List[str]] = None
    location: Optional[str] = None
    dot_color: Optional[str] = None

class ExperienceResponse(BaseModel):
    id: str
    title: str
    company: str
    date_from: str
    date_to: str
    desc: str
    tags: List[str]
    location: str
    dot_color: str
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
