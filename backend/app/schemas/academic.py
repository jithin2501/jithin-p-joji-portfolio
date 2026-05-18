from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class AcademicCreate(BaseModel):
    title: str = Field(..., min_length=1, description="Degree or level (e.g. B.Tech)")
    school: str = Field(..., min_length=1, description="School/University name")
    location: str = Field(..., min_length=1, description="Location or division details")
    date_range: str = Field(..., min_length=1, description="Date duration (e.g. 2022 - 2026)")
    score: str = Field(..., min_length=1, description="Performance score (e.g. 8.5 CGPA)")
    color_theme: str = Field(default="purple", description="Thematic color accent (purple, blue, green)")
    icon_type: str = Field(default="graduation", description="Timeline icon (graduation, book, pencil)")

class AcademicUpdate(BaseModel):
    title: Optional[str] = None
    school: Optional[str] = None
    location: Optional[str] = None
    date_range: Optional[str] = None
    score: Optional[str] = None
    color_theme: Optional[str] = None
    icon_type: Optional[str] = None

class AcademicResponse(BaseModel):
    id: str
    title: str
    school: str
    location: str
    date_range: str
    score: str
    color_theme: str
    icon_type: str
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True

class AcademicSettingsSchema(BaseModel):
    description: str = Field(..., description="Left-side description text")
    highlights: List[str] = Field(..., description="List of 5 highlights")
    stat1_label: str = Field(..., description="Label for B.Tech stat")
    stat1_value: str = Field(..., description="Value for B.Tech stat")
    stat2_label: str = Field(..., description="Label for 12th stat")
    stat2_value: str = Field(..., description="Value for 12th stat")
    stat3_label: str = Field(..., description="Label for 10th stat")
    stat3_value: str = Field(..., description="Value for 10th stat")
