from typing import Optional
from bson import ObjectId
from datetime import datetime

class Skill:
    def __init__(
        self,
        name: str,
        color: str,
        slug: str,
        desc: str,
        page: int = 1,
        created_at: Optional[datetime] = None,
        id: Optional[str] = None
    ):
        self.id = id
        self.name = name
        self.color = color
        self.slug = slug
        self.desc = desc
        self.page = page or 1
        self.created_at = created_at or datetime.utcnow()

    @staticmethod
    def from_mongo(data: dict) -> "Skill":
        if not data:
            return None
        return Skill(
            id=str(data.get("_id")),
            name=data.get("name"),
            color=data.get("color"),
            slug=data.get("slug"),
            desc=data.get("desc") or "",
            page=data.get("page") or 1,
            created_at=data.get("created_at") or datetime.utcnow()
        )

    def to_mongo(self) -> dict:
        data = {
            "name": self.name,
            "color": self.color,
            "slug": self.slug,
            "desc": self.desc,
            "page": self.page,
            "created_at": self.created_at
        }
        if self.id:
            data["_id"] = ObjectId(self.id)
        return data
