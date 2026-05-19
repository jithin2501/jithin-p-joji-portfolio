from datetime import datetime
from typing import Optional
from bson import ObjectId

class AnalyticsVisit:
    def __init__(self, user_id: str, path: str, ip: str, city: Optional[str] = None, 
                 country: Optional[str] = None, latitude: Optional[float] = None, 
                 longitude: Optional[float] = None, user_agent: Optional[str] = None, 
                 created_at: Optional[datetime] = None, id: Optional[str] = None):
        self.id = id
        self.user_id = user_id
        self.path = path
        self.ip = ip
        self.city = city or "Unknown"
        self.country = country or "Unknown"
        self.latitude = latitude
        self.longitude = longitude
        self.user_agent = user_agent or "Unknown"
        self.created_at = created_at or datetime.utcnow()

    @staticmethod
    def from_mongo(data: dict) -> "AnalyticsVisit":
        if not data:
            return None
        return AnalyticsVisit(
            id=str(data.get("_id")),
            user_id=data.get("userId") or data.get("user_id"),
            path=data.get("path"),
            ip=data.get("ip"),
            city=data.get("city"),
            country=data.get("country"),
            latitude=data.get("latitude"),
            longitude=data.get("longitude"),
            user_agent=data.get("userAgent") or data.get("user_agent"),
            created_at=data.get("createdAt") or data.get("created_at") or datetime.utcnow()
        )

    def to_mongo(self) -> dict:
        data = {
            "userId": self.user_id,
            "path": self.path,
            "ip": self.ip,
            "city": self.city,
            "country": self.country,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "userAgent": self.user_agent,
            "createdAt": self.created_at
        }
        if self.id:
            data["_id"] = ObjectId(self.id)
        return data
