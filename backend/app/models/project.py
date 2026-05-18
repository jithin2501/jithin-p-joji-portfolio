from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime

class Project:
    def __init__(
        self,
        title: str,
        subtitle: str,
        description: str,
        long_desc: str,
        image: str,
        images: List[str],
        category: str,
        role: str,
        duration: str,
        completed: str,
        tools: str,
        methodology: str,
        features: List[Dict[str, str]],
        tech_stack: List[Dict[str, str]],
        learned: str,
        featured: bool = False,
        live_url: str = "#",
        github_url: str = "#",
        created_at: Optional[datetime] = None,
        id: Optional[str] = None
    ):
        self.id = id
        self.title = title
        self.subtitle = subtitle or "PROJECT DETAILS"
        self.description = description
        self.long_desc = long_desc
        self.image = image
        self.images = images or [image]
        self.category = category
        self.role = role
        self.duration = duration
        self.completed = completed
        self.tools = tools
        self.methodology = methodology
        self.features = features or []
        self.tech_stack = tech_stack or []
        self.learned = learned
        self.featured = featured
        self.live_url = live_url or "#"
        self.github_url = github_url or "#"
        self.created_at = created_at or datetime.utcnow()

    @staticmethod
    def from_mongo(data: dict) -> "Project":
        if not data:
            return None
        return Project(
            id=str(data.get("_id")),
            title=data.get("title"),
            subtitle=data.get("subtitle") or "PROJECT DETAILS",
            description=data.get("description") or "",
            long_desc=data.get("long_desc") or data.get("longDesc") or "",
            image=data.get("image") or "",
            images=data.get("images") or [],
            category=data.get("category") or "Others",
            role=data.get("role") or "",
            duration=data.get("duration") or "",
            completed=data.get("completed") or "",
            tools=data.get("tools") or "",
            methodology=data.get("methodology") or "",
            features=data.get("features") or [],
            tech_stack=data.get("tech_stack") or data.get("techStack") or [],
            learned=data.get("learned") or "",
            featured=data.get("featured", False),
            live_url=data.get("live_url") or data.get("liveUrl") or "#",
            github_url=data.get("github_url") or data.get("githubUrl") or "#",
            created_at=data.get("created_at") or datetime.utcnow()
        )

    def to_mongo(self) -> dict:
        data = {
            "title": self.title,
            "subtitle": self.subtitle,
            "description": self.description,
            "long_desc": self.long_desc,
            "image": self.image,
            "images": self.images,
            "category": self.category,
            "role": self.role,
            "duration": self.duration,
            "completed": self.completed,
            "tools": self.tools,
            "methodology": self.methodology,
            "features": self.features,
            "tech_stack": self.tech_stack,
            "learned": self.learned,
            "featured": self.featured,
            "live_url": self.live_url,
            "github_url": self.github_url,
            "created_at": self.created_at
        }
        if self.id:
            data["_id"] = ObjectId(self.id)
        return data
