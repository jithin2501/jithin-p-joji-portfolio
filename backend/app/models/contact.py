from datetime import datetime
from typing import Optional
from bson import ObjectId

class Contact:
    def __init__(self, name: str, email: str, subject: str, message: str, created_at: Optional[datetime] = None, id: Optional[str] = None):
        self.id = id
        self.name = name
        self.email = email
        self.subject = subject
        self.message = message
        self.created_at = created_at or datetime.utcnow()

    @staticmethod
    def from_mongo(data: dict) -> "Contact":
        if not data:
            return None
        return Contact(
            id=str(data.get("_id")),
            name=data.get("name"),
            email=data.get("email"),
            subject=data.get("subject"),
            message=data.get("message"),
            created_at=data.get("createdAt") or data.get("created_at") or datetime.utcnow()
        )

    def to_mongo(self) -> dict:
        data = {
            "name": self.name,
            "email": self.email,
            "subject": self.subject,
            "message": self.message,
            "createdAt": self.created_at
        }
        if self.id:
            data["_id"] = ObjectId(self.id)
        return data
