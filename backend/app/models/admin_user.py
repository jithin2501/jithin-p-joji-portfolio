from datetime import datetime
from typing import Optional
from bson import ObjectId

DEFAULT_PAGE_ACCESS = "messages,settings,resumes,skills,experience,academic,aboutImage,projects,analytics"

class AdminUser:
    def __init__(self, username: str, pincode: str, role: str = "Admin",
                 status: str = "Active", last_login: Optional[datetime] = None,
                 page_access: str = DEFAULT_PAGE_ACCESS, id: Optional[str] = None):
        self.id = id
        self.username = username
        self.pincode = pincode
        self.role = role
        self.status = status
        self.last_login = last_login or datetime.utcnow()
        self.page_access = page_access

    @staticmethod
    def from_mongo(data: dict) -> "AdminUser":
        if not data:
            return None
        return AdminUser(
            id=str(data.get("_id")),
            username=data.get("username"),
            pincode=data.get("pincode"),
            role=data.get("role", "Admin"),
            status=data.get("status", "Active"),
            last_login=data.get("lastLogin") or data.get("last_login") or datetime.utcnow(),
            page_access=data.get("pageAccess") or data.get("page_access") or DEFAULT_PAGE_ACCESS
        )

    def to_mongo(self) -> dict:
        data = {
            "username": self.username,
            "pincode": self.pincode,
            "role": self.role,
            "status": self.status,
            "lastLogin": self.last_login,
            "pageAccess": self.page_access
        }
        if self.id:
            data["_id"] = ObjectId(self.id)
        return data
