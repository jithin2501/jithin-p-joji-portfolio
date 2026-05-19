from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class AnalyticsVisitCreate(BaseModel):
    userId: str = Field(..., min_length=1)
    path: str = Field(..., min_length=1)
    ip: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    userAgent: Optional[str] = None

class AnalyticsVisitResponse(BaseModel):
    id: str
    userId: str
    path: str
    ip: str
    city: str
    country: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    userAgent: str
    createdAt: datetime

    class Config:
        from_attributes = True
        populate_by_name = True
