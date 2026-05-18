from typing import Optional, List
from bson import ObjectId
from datetime import datetime

class Experience:
    def __init__(
        self, 
        title: str, 
        company: str, 
        date_from: str, 
        date_to: str, 
        desc: str, 
        tags: List[str], 
        location: str, 
        dot_color: Optional[str] = "#818cf8",
        created_at: Optional[datetime] = None,
        id: Optional[str] = None
    ):
        self.id = id
        self.title = title
        self.company = company
        self.date_from = date_from
        self.date_to = date_to
        self.desc = desc
        self.tags = tags
        self.location = location
        self.dot_color = dot_color
        self.created_at = created_at or datetime.utcnow()

    @staticmethod
    def from_mongo(data: dict) -> "Experience":
        if not data:
            return None
        return Experience(
            id=str(data.get("_id")),
            title=data.get("title"),
            company=data.get("company"),
            date_from=data.get("date_from") or data.get("dateFrom", ""),
            date_to=data.get("date_to") or data.get("dateTo", "Present"),
            desc=data.get("desc"),
            tags=data.get("tags") or [],
            location=data.get("location") or "",
            dot_color=data.get("dot_color") or data.get("dotColor") or "#818cf8",
            created_at=data.get("created_at") or data.get("createdAt") or datetime.utcnow()
        )

    def to_mongo(self) -> dict:
        data = {
            "title": self.title,
            "company": self.company,
            "date_from": self.date_from,
            "date_to": self.date_to,
            "desc": self.desc,
            "tags": self.tags,
            "location": self.location,
            "dot_color": self.dot_color,
            "created_at": self.created_at
        }
        if self.id:
            data["_id"] = ObjectId(self.id)
        return data
