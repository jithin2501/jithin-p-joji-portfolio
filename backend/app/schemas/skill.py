from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SkillCreate(BaseModel):
    name: str = Field(..., min_length=1, description="Skill name (e.g. React)")
    color: str = Field(..., min_length=4, description="Hex color theme (e.g. #61DAFB)")
    slug: str = Field(..., min_length=1, description="Skillicon slug (e.g. react)")
    desc: str = Field(..., min_length=1, description="Short skill description")
    page: int = Field(default=1, ge=1, le=4, description="Display page index (1 to 4)")

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    slug: Optional[str] = None
    desc: Optional[str] = None
    page: Optional[int] = None

class SkillResponse(BaseModel):
    id: str
    name: str
    color: str
    slug: str
    desc: str
    page: int
    created_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
