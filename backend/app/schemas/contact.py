from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1)

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    subject: str
    message: str
    createdAt: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
