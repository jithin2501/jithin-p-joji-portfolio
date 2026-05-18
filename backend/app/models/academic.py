from typing import Optional
from bson import ObjectId
from datetime import datetime

class Academic:
    def __init__(
        self, 
        title: str, 
        school: str, 
        location: str, 
        date_range: str, 
        score: str, 
        color_theme: Optional[str] = "purple",
        icon_type: Optional[str] = "graduation",
        created_at: Optional[datetime] = None,
        id: Optional[str] = None
    ):
        self.id = id
        self.title = title
        self.school = school
        self.location = location
        self.date_range = date_range
        self.score = score
        self.color_theme = color_theme or "purple"
        self.icon_type = icon_type or "graduation"
        self.created_at = created_at or datetime.utcnow()

    @staticmethod
    def from_mongo(data: dict) -> "Academic":
        if not data:
            return None
        return Academic(
            id=str(data.get("_id")),
            title=data.get("title"),
            school=data.get("school"),
            location=data.get("location") or "",
            date_range=data.get("date_range") or data.get("dateRange", ""),
            score=data.get("score") or "",
            color_theme=data.get("color_theme") or data.get("colorTheme") or "purple",
            icon_type=data.get("icon_type") or data.get("iconType") or "graduation",
            created_at=data.get("created_at") or data.get("createdAt") or datetime.utcnow()
        )

    def to_mongo(self) -> dict:
        data = {
            "title": self.title,
            "school": self.school,
            "location": self.location,
            "date_range": self.date_range,
            "score": self.score,
            "color_theme": self.color_theme,
            "icon_type": self.icon_type,
            "created_at": self.created_at
        }
        if self.id:
            data["_id"] = ObjectId(self.id)
        return data
